const {expect} = require('chai');
const {request} = require('../utils');
const {sequelize} = require('../../src/model');

describe('Balance', () => {
	it('should successfully deposit amount into clients balance', async () => {
		const userId = 2;
		const amountToDeposit = 50;
		const {balance: balanceBefore} = await sequelize.models.Profile.findOne({where: {id: userId}});
		await request.post(
			`/balances/deposit/${userId}`,
			{amount: amountToDeposit},
			{headers: {profile_id: userId}}
		);
		const {balance: balanceAfter} = await sequelize.models.Profile.findOne({where: {id: userId}});
		expect(balanceAfter).to.equal(balanceBefore + amountToDeposit);
	});
});
