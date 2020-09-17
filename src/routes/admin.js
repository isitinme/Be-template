const adminController = require('../controllers/adminController');

module.exports = (app) => {
	app.get('/admin/best-profession', async (req, res) => {
		const result = await adminController.getBestProfessions(req);
		res.json(result);
	});
};
