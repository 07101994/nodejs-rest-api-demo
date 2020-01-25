var employeeService = require("../services/employeeService");
var employeeResponseModel = require("../contracts/employeeResponseModel");
var AppError = require("../utils/appError");

// Validate get employees request
function validateGetEmployeesRequest(pageNo, size, sortBy, sortDirection) {
  if (pageNo < 0 || pageNo === 0 || isNaN(pageNo)) {
    throw new AppError(
      400,
      "BAD_REQUEST",
      "Invalid page number, should start with 1"
    );
  }

  if (size < 0 || size === 0 || isNaN(size)) {
    throw new AppError(400, "BAD_REQUEST", "Invalid size, should start with 1");
  }

  if (!sortDirection && (sortDirection !== "asc" || sortDirection !== "desc")) {
    throw new AppError(
      400,
      "BAD_REQUEST",
      "Invalid sortBy, should be asc or desc"
    );
  }

  if (
    !sortBy &&
    (sortBy === "name" || sortBy === "email" || sortBy === "company")
  ) {
    throw new AppError(
      400,
      "BAD_REQUEST",
      "Invalid sortDirection, should be name, email or company"
    );
  }
}

// Get employees controller with pagination and filtering
exports.getEmployees = function(req, res, next) {
  try {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    // Validate request
    validateGetEmployeesRequest(
      pageNo,
      size,
      req.query.sortBy,
      req.query.sortDirection
    );

    filterParams = {
      pageNo: pageNo,
      size: size,
      company: req.query.company,
      email: req.query.email,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection
    };

    // Get employees promise
    var employeesPromise = employeeService.getEmployees(filterParams);

    // Get total employees count for showing pagination
    var employeesCountPromise = employeeService.getTotalEmployeesCount(
      req.query.company,
      req.query.email
    );

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

      res.json({ employees: response, totalCount: values[1] });
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
