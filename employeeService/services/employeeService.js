var employeeModel = require("../models/employee.model");
var AppError = require("../utils/appError");

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

function getQueryOptions(pageNo, size, sortBy, sortDirection) {
  var query = {};
  query.skip = size * (pageNo - 1);
  query.limit = size;
  query.sort = getSortByAndDirection(sortBy, sortDirection);
  return query;
}

function getSortByAndDirection(sortBy, sortDirection){
  var sort = {};
  // We can validate the sort by and sort direction before using it
  if(sortDirection && sortDirection === "asc"){
    sort[sortBy] = 1;
  }
  else if(sortDirection && sortDirection === "desc"){
    sort[sortBy] = -1;
  }
  return sort;
}

// Get employees function
exports.getEmployees = function(filterParams) {
  var queryConditions = getConditionByCompanyAndEmail(filterParams.company, filterParams.email);
  var queryOptions = getQueryOptions(filterParams.pageNo, filterParams.size,filterParams.sortBy, filterParams.sortDirection);
  
  // Find employees with filtering and pagination
  var getEmployeesPromise = employeeModel.find(
    queryConditions,
    { _id: 0, __v: 0 },
    queryOptions,
    function(err, employees) {
      // Mongo command to fetch all data from collection.
      if (err) {
        console.error(err);
        throw new AppError(500, "INTERNAL_SERVER_ERROR", "Internal server error");
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
      throw new AppError(500, "INTERNAL_SERVER_ERROR", "Internal server error");
    } else {
      return employeesCount;
    }
  });
  return employeesCountPromise;
};
