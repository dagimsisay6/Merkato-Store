const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    flag: { type: String },
    capital: { type: String },
    currency: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Country", countrySchema);
