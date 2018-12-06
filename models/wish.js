const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    imageUrl: String,
    averagePrice: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wish', wishSchema);
