const routes = require('express').Router();
const { notFound } = require('../controllers/resourceError');

routes.all('/', notFound);

module.exports = routes;