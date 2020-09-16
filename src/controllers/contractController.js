const {getProfileQuery, contractStatuses} = require('../utils');

async function getContractById(req) {
	const {
		profile, params: {id: contractId},
	} = req;

	const {Contract} = req.app.get('models');
	const query = {
		where: {
			id: contractId,
			...getProfileQuery(profile),
		},
	};
	return Contract.findOne(query);
}

async function getActiveContracts(req) {
	const {Contract} = req.app.get('models');
	const query = {
		where: {
			status: contractStatuses.inProgress,
			...getProfileQuery(req.profile),
		},
	};
	return Contract.findAll(query);
}

module.exports = {
	getContractById,
	getActiveContracts,
};
