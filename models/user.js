const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  wishes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Wish'
    }
  ],
  contributing: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Wish'
    }
  ]
  // User will have a list of notifications
});

module.exports = mongoose.model('User', userSchema);
