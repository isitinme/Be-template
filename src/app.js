const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const routes = require('./routes');

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

module.exports = routes(app);
