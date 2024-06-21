import { commentSchema } from "./comment.model";

const mongoose = require("mongoose");

const watchSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    image: { type: String, require: true },
    price: { type: Number, require: true },
    automatic: { type: Boolean, default: false },
    description: { type: String, require: true },
    comments: [commentSchema],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      require: true,
    },
  },
  { timestamps: true }
);

const watchModel = mongoose.model("Watch", watchSchema);
export default watchModel;
