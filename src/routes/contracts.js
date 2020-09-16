const contractsController = require('../controllers/contractController');

module.exports = (app) => {
	app.get('/contracts/:id', async (req, res) => {
		const contract = await contractsController.getContractById(req);
		if (!contract) {
			return res.status(404).end();
		}
		res.json(contract);
	});

	app.get('/contracts', async (req, res) => {
		const contracts = await contractsController.getActiveContracts(req);
		res.json(contracts);
	});
};
