const {expect} = require('chai');
const {request} = require('../utils');
const {contractStatuses} = require('../../src/enums');

describe('Contracts', () => {
	it('should successfully return a specific contract', async () => {
		const contractId = 4;
		const profile_id = 2;
		const {data} = await request.get(`/contracts/${contractId}`, {headers: {profile_id}});
		const {id, ClientId, ContractorId} = data;
		expect(id).to.equal(contractId);
		expect([ClientId, ContractorId].some((id) => id === profile_id)).to.be.true;
	});

	it('should throw error if contract is not belongs to provided profile', async () => {
		const contractId = 4;
		const profile_id = 3;
		try {
			await request.get(`/contracts/${contractId}`, {headers: {profile_id}});
		} catch (err) {
			const {response: {status}} = err;
			expect(status).to.equal(404);
		}
	});

	it('should successfully get all the active contracts belongning to the profile', async () => {
		const profile_id = 2;
		const {data} = await request.get('/contracts', {headers: {profile_id}});
		expect(data).to.be.an('array');
		for (const contract of data) {
			const {status, ClientId, ContractorId} = contract;
			expect([contractStatuses.new, contractStatuses.inProgress].includes(status)).to.be.true;
			expect([ClientId, ContractorId].some((id) => id === profile_id)).to.be.true;
		}
	});
});
