const balanceController = require('../controllers/balanceController.js');
const {getProfile} = require('../middleware/getProfile');

module.exports = (app) => {
	app.post('/balances/deposit/:userId', getProfile, async (req, res) => {
		await balanceController.depositClient(req, res);
		res.status(204).end();
	});
};
