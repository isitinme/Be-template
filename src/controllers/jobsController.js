const {getProfileQuery} = require('../utils');
const {contractStatuses, profileTypes} = require('../enums');

async function getUnpaidJobs(req) {
	const {Job, Contract} = req.app.get('models');
	const JobSchema = await Job.describe();
	const query = {
		attributes: Object.keys(JobSchema),
		where: {
			paid: null,			
		},
		include: {
			model: Contract,
			where: {
				status: contractStatuses.inProgress,
				...getProfileQuery(req.profile),
			},
		},
	};
	return Job.findAll(query);
}

async function payForJob(req, res) {
	const {
		profile: {type, id: profileId, balance: clientBalance}, params: {job_id},
	} = req;
	if (type !== profileTypes.client) {
		return res.status(403).json({message: 'Profile id must belongs to a client'});
	}
	const {Job, Contract, Profile} = req.app.get('models');
	const query = {
		where: {
			id: job_id,
		},
		include: {
			model: Contract,
			where: {
				clientId: profileId,
				status: contractStatuses.inProgress,
			},
		},
	};
	const job = await Job.findOne(query);
	if (!job || job.paid) {
		return res.status(404).json({message: 'No proper job to pay was found'});
	}
	const {price, ContractId} = job;
	if (price > clientBalance) {
		return res.status(400).json({message: 'Client balance is less than required price to pay'});
	}
	const {ContractorId} = await Contract.findOne({where: {id: ContractId}});
	const {balance: contractorBalance} = await Profile.findOne({where: {id: ContractorId}});
	await Promise.all([
		Profile.update({balance: (clientBalance || 0) - price}, {where: {id: profileId}});
		Profile.update({balance: (contractorBalance || 0) + price}, {where: {id: ContractorId}}); 
	]);
	await Job.update({paid: true}, {where: {id: job_id}});
}

module.exports = {
	getUnpaidJobs,
	payForJob,
};
