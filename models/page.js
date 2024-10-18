const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    url: String,
    html: String,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Page', pageSchema);
