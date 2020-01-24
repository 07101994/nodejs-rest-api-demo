var employeeService = require("../services/employeeService");
var employeeResponseModel = require("../contracts/employeeResponseModel");

// Get employees controller with pagination and filtering
exports.getEmployees = function(req, res, next) {
  try {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    // Validate request
    validateGetEmployeesRequest(pageNo, size, next);

    // Get employees promise
    var employeesPromise = employeeService.getEmployees(
      pageNo,
      size,
      req.query.company,
      req.query.email
    );

    // Get total employees count for showing pagination
    var employeesCountPromise = employeeService.getTotalEmployeesCount(req.query.company, req.query.email);

    // When all the promises are completed
    Promise.all([employeesPromise, employeesCountPromise]).then(values => {
      response = [];

      values[0].forEach(element => {
        response.push(
          employeeResponseModel.create(
            element.name,
            element.phone,
            element.email,
            element.company
          )
        );
      });

      res.json({employees: response, totalCount: values[1]});
    })

  } catch (error) {
    next(error);
  }
};

// Validate get employees request
function validateGetEmployeesRequest(pageNo, size, next) {
  if (pageNo < 0 || pageNo === 0 || isNaN(pageNo)) {
    throw new Error("invalid page number, should start with 1");
  }

  if (size < 0 || size === 0 || isNaN(size)) {
    throw new Error("invalid size, should start with 1");
  }
}
