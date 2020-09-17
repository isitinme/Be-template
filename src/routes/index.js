const contracts = require('./contracts');
const jobs = require('./jobs');
const balances = require('./balances');
// const admin = require('./admin');

module.exports = (app) => {
	contracts(app);	
	jobs(app);
	balances(app);
	// admin(app);
	return app;
};
