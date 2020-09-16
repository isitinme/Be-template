const jobsController = require('../controllers/jobsController');

module.exports = (app) => {
	app.get('/jobs/unpaid', async (req, res) => {
		const jobs = await jobsController.getUnpaidJobs(req);
		res.json(jobs);
	});
};
