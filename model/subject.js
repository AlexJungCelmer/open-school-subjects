const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
	name: { type: String, default: null, unique: true },
});

module.exports = mongoose.model("subject", subjectSchema);