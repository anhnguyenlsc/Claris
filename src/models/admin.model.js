const mongoose = require('mongoose');
const Admin = require('./admin.model');

const AdminSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String}
})

module.exports = mongoose.model('Admin', AdminSchema)