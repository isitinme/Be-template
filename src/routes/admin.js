const adminController = require('../controllers/adminController');

module.exports = (app) => {
	app.get('/admin/best-profession', async (req, res) => {
		const result = await adminController.getBestProfession(req);
		res.json(result);
	});

	app.get('/admin/best-clients', async (req, res) => {
		const result = await adminController.getBestClients(req);
		res.json(result);
	});
};
