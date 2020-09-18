const {expect} = require('chai');
const {request} = require('../utils');
const {sequelize} = require('../../src/model');

describe('Jobs', () => {
	it('should successfully get unpaid jobs for the given profile', async () => {
		const profile_id = 2;
		const {data} = await request.get('/jobs/unpaid', {headers: {profile_id}});
		expect(data).to.be.an('array');
		for (const job of data) {
			const {paid, Contract: {ContractorId, ClientId}} = job;
			expect(paid).to.equal(null);
			expect([ClientId, ContractorId].some((id) => id === profile_id)).to.be.true;
		}
	});

	it('should successfully pay for a job', async () => {
		const headers = {
			profile_id: 1,
		};
		const {data} = await request.get('/jobs/unpaid', {headers});
		const [job] = data;
		expect(job.paid).to.equal(null);
		await request.post(`/jobs/${job.id}/pay`, null, {headers});
		const paidJob = await sequelize.models.Job.findOne({where: {id: job.id}});
		expect(paidJob.paid).to.equal(true);
	});
});
