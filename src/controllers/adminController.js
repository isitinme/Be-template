const {Op, fn, col} = require('sequelize');
const {contractStatuses, profileTypes} = require('../enums');

async function getBestProfessions(req) {
	const {
		query: {start, end},
	} = req;
	const {Job, Contract, Profile} = req.app.get('models');
	const result = await Profile.findAll({
		attributes: [
			'profession',
			// [fn('SUM', col('price')), 'totalPrice'],
		],
		// order: [
			// [col('Contractor.Jobs.price'), 'DESC'],
		// ],
		// group: 'profession',
		include: {
			model: Contract,
			as: 'Contractor',
			where: {
				status: contractStatuses.inProgress,
			},
			include: {
				model: Job,
				attributes: [
					'price',
				],
				where: {
					paymentDate: {
						[Op.between]: [new Date(start), new Date(end)],
					},
					paid: true,
				},
			},
		},
	});
	return result;
}

module.exports = {
	getBestProfessions,
};
