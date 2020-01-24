// Employee detail API response object
function EmployeeResponseModel(employeeName, phone, email, company) {
    this.name = employeeName;
    this.phone = phone;
    this.email = email;
    this.company = company;
}; 

function create(employeeName, phone, email, company){
    return new EmployeeResponseModel(employeeName, phone, email, company);
}

module.exports.create = create;