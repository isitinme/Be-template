const express = require('express');
const bodyParser = require('body-parser');
const {Op} = require('sequelize');

const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * FIX ME!
 * @returns contract by id
 */
app.get(
	'/contracts/:id',
	getProfile,
	async (req, res) => {
		const {
			profile: {id: profileId, type},
			params: {id: contractId},
		} = req;

		const query = {
			where: {
				id: contractId,
				[type === 'client' ? 'clientId' : 'contractorId']: profileId,
			},
		};

		const {Contract} = req.app.get('models');
		const contract = await Contract.findOne(query);

		if (!contract) {
			return res.status(404).end();
		}

		res.json(contract);
	}
);

app.get(
	'/contracts',
	getProfile,
	async (req, res) => {
		const {
			profile: {id: profileId, type},
		} = req;

		const query = {
			where: {
				status: 'in_progress',
				[type === 'client' ? 'clientId' : 'contractorId']: profileId,
			},
		};

		const {Contract} = req.app.get('models');
		const contracts = await Contract.findAll(query);

		res.json(contracts);
	}
);

app.get(
	'/jobs/unpaid',
	getProfile,
	async (req, res) => {
		const {
			profile: {id: profileId, type},
		} = req;

		const {Job, Contract, Profile} = req.app.get('models');

		const JobSchema = await Job.describe();

		const query = {
			attributes: Object.keys(JobSchema),
			where: {
				paid: {
					[Op.is]: null,
				},			
			},
			include: {
				model: Contract,
				where: {
					[type === 'client' ? 'ClientId' : 'ContractorId']: profileId,
				},
			},
		};

		const jobs = await Job.findAll(query);

		res.json(jobs);
	}
);

module.exports = app;
