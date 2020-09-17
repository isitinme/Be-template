const jobsController = require('../controllers/jobsController');
const {profileTypes} = require('../enums');

const TOTAL_DEBT_ALLOWED_PERCENT = 25;

const depositIsAllowed = (totalDebt, amount) =>
	parseFloat((totalDebt * TOTAL_DEBT_ALLOWED_PERCENT / 100).toFixed(2)) >= amount;

async function depositClient(req, res) {
	const {
		params: {userId},
		body: {amount},
	} = req;
	const {Profile} = req.app.get('models');
	if (typeof amount !== 'number' || amount < 0) {
		return res.status(400).json({message: 'Amount must be a positive integer'});
	}
    const profile = await Profile.findOne({where: {id: userId || 0}});
	if (!profile || profile.type !== profileTypes.client) {
		return res.status(403).json({message: 'Profile id must belongs to a client'});
	}
	const totalDebt = (await jobsController.getUnpaidJobs(req)).reduce((acc, {price}) => acc + price, 0);
	if (!depositIsAllowed(totalDebt, amount)) {
		return res.status(403).json({message: `User cannot be deposited for a given amount: ${amount}`});
	}
	return Profile.update({balance: profile.balance + amount}, {where: {id: userId}});
}

module.exports = {
	depositClient,
};
