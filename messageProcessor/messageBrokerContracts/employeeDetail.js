function EmployeeDetail(employeeName, phone, email, company) {
    this.Name = employeeName;
    this.Phone = phone;
    this.Email = email;
    this.Company = company;
}; 

function create(employeeName, phone, email, company){
    return new EmployeeDetail(employeeName, phone, email, company);
}

module.exports.create = create;