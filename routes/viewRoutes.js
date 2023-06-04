const express = require('express');
const Router = express.Router();

const viewController = require('../controllers/viewController');

Router.get('/', viewController.getOverview);
Router.get('/tour', viewController.getTour);

module.exports = Router;