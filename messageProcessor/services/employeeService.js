const employeeModel = require("../models/employee.model");

//Simple version, without validation or sanitation
exports.createEmployee = function(employeeDetail) {
  let employee = new employeeModel({
    name: employeeDetail.Name,
    phone: employeeDetail.Phone,
    company: employeeDetail.Company,
    email: employeeDetail.Email
  });

  employee.save(function(err){
      if(err){
          console.error(err);
      }
  })
};
