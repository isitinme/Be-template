const {expect} = require('chai');
const {request} = require('../utils');

describe('Admin', () => {
	it('should successfully get the best profession for a specified time period', async () => {
		const start = '2020-08-10';
		const end = '2020-08-15';
		const {data} = await request.get('/admin/best-profession', {
			params: {
				start,
				end,
			},
		});
		expect(data).to.have.property('profession').and.to.be.a('string');
		expect(data).to.have.property('totalEarned').and.to.be.a('number');
	});

	it('should successfully get the most paid clients within a specified time period', async () => {
		const start = '2020-08-10';
		const end = '2020-08-20';
		const limit = 3;
		const {data} = await request.get('/admin/best-clients', {
			params: {
				start,
				end,
				limit,
			},
		});
		expect(data).to.be.an('array');
		for (const item of data) {
			expect(item).to.have.property('id').and.to.be.a('number');
			expect(item).to.have.property('paid').and.to.be.a('number');
			expect(item).to.have.property('fullName').and.to.be.a('string');
		}
	});
});
