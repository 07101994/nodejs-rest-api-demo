const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EmployeeSchema = new Schema({
    name: {type: String, required: true, max: 100},
    phone: {type: String, required: true, max: 15},
    email: {type: String, required: true, max: 50},
    company: {type: String, required: true, max: 100}
});


// Export the model
module.exports = mongoose.model('Employee', EmployeeSchema);