const jobsController = require('../controllers/jobsController');

module.exports = (app) => {
	app.get('/jobs/unpaid', async (req, res) => {
		const jobs = await jobsController.getUnpaidJobs(req);
		res.json(jobs);
	});

	app.post('/jobs/:job_id/pay', async (req, res) => {
		await jobsController.payForJob(req, res);
		res.status(204).end();
	});
};
