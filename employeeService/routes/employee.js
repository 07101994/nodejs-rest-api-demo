var express = require('express');
var router = express.Router();
var employeeController = require('../controllers/employeeController');

/* GET employees. */
router.get('*', function(req, res, next) {
  employeeController.getEmployees(req, res, next);
});

module.exports = router;