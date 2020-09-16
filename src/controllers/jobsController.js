const {getProfileQuery, contractStatuses} = require('../utils');

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

module.exports = {
	getUnpaidJobs,
};
