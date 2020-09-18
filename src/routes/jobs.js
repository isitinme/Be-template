const jobsController = require('../controllers/jobsController');
const {getProfile} = require('../middleware/getProfile');

module.exports = (app) => {
	app.get('/jobs/unpaid', getProfile, async (req, res) => {
		const jobs = await jobsController.getUnpaidJobs(req);
		res.json(jobs);
	});

	app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
		await jobsController.payForJob(req, res);
		res.status(204).end();
	});
};
