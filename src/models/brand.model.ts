const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  { brandName: { type: String, required: true } },
  { timestamps: true }
);

const brandModel = mongoose.model("Brand", brandSchema);
export default brandModel;
