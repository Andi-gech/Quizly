const mongoose = require('mongoose');

const catagorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    FontAwesomeIconName: { type: String }
});
module.exports = mongoose.model('Catagory', catagorySchema);

