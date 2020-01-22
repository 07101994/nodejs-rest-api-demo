var fs = require('fs');
const csv = require('csv');
const employeeDetail = require('../messageBrokerContracts/employeeDetail');
const publisher = require('../messageBroker/publisher');

const obj = csv();

exports.saveEmployeeDetails = async (csvFilePath) => {
    // MyData array will contain the data from the CSV file and it will be sent to the clients request over HTTP. 
    obj.from.path(csvFilePath).to.array(function (data) {
        for (var index = 1; index < data.length; index++) {
            var employee = employeeDetail.create(data[index][0], data[index][1], data[index][2], data[index][3]);
            publisher.publishToQueue("process-csv-message", employee);
            console.log(employee);
        }
    });
}