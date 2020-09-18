const {Op, fn, col} = require('sequelize');
const {contractStatuses, profileTypes} = require('../enums');

async function getBestProfession(req) {
	const {
		query: {start, end},
	} = req;
	const {Job, Contract, Profile} = req.app.get('models');
	const [bestContractor] = await Profile.findAll({
		where: {
			type: profileTypes.contractor,
		},
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

async function getBestClients(req) {
	const {
		query: {start, end, limit = 2},
	} = req;
	const {Job, Contract, Profile} = req.app.get('models');
	const bestClients = await Profile.findAll({
		where: {
			type: profileTypes.client,
		},
		attributes: [
			'id',
			'firstName',
			'lastName',
			[fn('SUM', col('Client.Jobs.price')), 'paid'],
		],
		group: 'Client.ClientId',
		order: [
			[fn('SUM', col('Client.Jobs.price')), 'DESC'],
		],
		include: {
			model: Contract,
			as: 'Client',
			include: {
				model: Job,
				where: {
					paid: true,
					paymentDate: {
						[Op.between]: [new Date(start), new Date(end)],
					},
				},
			},
		},
	});
	return bestClients
		.slice(0, limit)
		.map((client) => {
			const {id, paid} = client.toJSON();
			return {
				id,
				paid,
				fullName: client.getFullName(),
			};
		});
}

module.exports = {
	getBestProfession,
	getBestClients,
};
