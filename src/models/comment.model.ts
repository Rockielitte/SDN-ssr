const mongoose = require("mongoose");

export const commentSchema = mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, require: true },
    content: { type: String, require: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      require: true,
    },
  },
  { timestamps: true }
);

const commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;
