const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: {
    type: String,
    enum: ['admin', 'manager', 'head-cook', 'supervisor'],
    required: true
  }
});

module.exports = mongoose.model('Staff', StaffSchema);

