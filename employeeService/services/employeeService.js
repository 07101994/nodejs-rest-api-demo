var employeeModel = require("../models/employee.model");

function getConditionByCompanyAndEmail(company, email) {
  var condition = {};
  if (company) {
    condition.company = company;
  }

  if (email) {
    condition.email = email;
  }
  return condition;
}

function getQueryByPageNoAndSize(pageNo, size) {
  var query = {};
  query.skip = size * (pageNo - 1);
  query.limit = size;
  return query;
}

// Get employees function
exports.getEmployees = function(pageNo, size, company, email) {
  var condition = getConditionByCompanyAndEmail(company, email);
  var query = getQueryByPageNoAndSize(pageNo, size);
  // Find employees with filtering and pagination
  var getEmployeesPromise = employeeModel.find(
    condition,
    { _id: 0, __v: 0 },
    query,
    function(err, employees) {
      // Mongo command to fetch all data from collection.
      if (err) {
        console.error(err);
        throw new Error("Internal server error");
      } else {
        return employees;
      }
    }
  );
  return getEmployeesPromise;
};

exports.getTotalEmployeesCount = function(company, email) {
  var condition = getConditionByCompanyAndEmail(company, email);
  var employeesCountPromise = employeeModel.countDocuments(condition, function(
    err,
    employeesCount
  ) {
    if (err) {
      console.error(err);
      throw new Error("Internal server error");
    } else {
      return employeesCount;
    }
  });
  return employeesCountPromise;
};
