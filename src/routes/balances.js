const balanceController = require('../controllers/balanceController.js');

module.exports = (app) => {
	app.post('/balances/deposit/:userId', async (req, res) => {
		await balanceController.depositClient(req, res);
		res.status(204).end();
	});
};
