const {Op, fn, col} = require('sequelize');
const {contractStatuses, profileTypes} = require('../enums');

async function getBestProfessions(req) {
	const {
		query: {start, end},
	} = req;
	const {Job, Contract, Profile} = req.app.get('models');
	const [bestContractor] = await Profile.findAll({
		attributes: [
			'profession',
			[fn('SUM', col('Contractor.Jobs.price')), 'totalEarned'],
		],
		order: [
			[fn('SUM', col('Contractor.Jobs.price')), 'DESC'],
		],
		group: 'profession',
		include: {
			model: Contract,
			as: 'Contractor',
			where: {
				status: contractStatuses.inProgress,
			},
			include: {
				model: Job,
				where: {
					paymentDate: {
						[Op.between]: [new Date(start), new Date(end)],
					},
					paid: true,
				},
			},
		},
	});
	const {profession, totalEarned} = bestContractor.toJSON();
	return {profession, totalEarned};
}

module.exports = {
	getBestProfessions,
};
