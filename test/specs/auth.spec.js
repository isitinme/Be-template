const {expect} = require('chai');
const {request} = require('../utils');

describe('Authentication', () => {
	it('should throw authentication error when to auth headers were given', async () => {
		try {
			await request.get('/contracts');
		} catch (err) {
			const {response: {status, statusText}} = err;
			expect(status).to.equal(401);
			expect(statusText).to.equal('Unauthorized');
		}
	});

	it('should throw authentication error when invalid auth headers given', async () => {
		try {
			await request.get('/contracts', {headers: {profile_id: 100}});
		} catch (err) {
			const {response: {status, statusText}} = err;
			expect(status).to.equal(401);
			expect(statusText).to.equal('Unauthorized');
		}
	});
});
