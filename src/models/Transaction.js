import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  participants: {
    type: [String],
    required: [true, 'Please enter the emails of the participants'],
  },
  currency: {
    type: String,
    required: [true, 'Please enter the currency to be used for this account'],
  },
  editors: {
    type: [String],
    required: [
      true,
      'Please enter the email of users that can edit this transaction details',
    ],
  },
  statusChangers: {
    type: [String],
    required: [
      true,
      'Please enter the email of users that can change this transaction status',
    ],
  },
  lastEditorCanChangeStatus: {
    type: Boolean,
    default: false,
    required: [true, 'Please decide if the last editor can change status'],
  },
  creator: {
    type: String,
    required: [
      true,
      'Please enter the email of the user who created this transaction',
    ],
  },
  details: [
    {
      date: {
        type: Date,
        required: [true, 'Please enter the transaction date'],
      },
      description: { type: String, default: 'No Description' },
      amount: { type: Number, required: [true, 'Please enter an amount'] },
      status: {
        type: String,
        enum: ['Approved', 'Rejected', 'Pending'],
        default: 'Pending',
      },
      sender: {
        type: String,
        required: [true, 'Please enter the sender email'],
      },
      lastEditor: {
        type: String,
        required: [
          true,
          'Please enter the email of the last user that edited this detail',
        ],
      },
      detailsHistory: [{}],
    },
  ],
});

export default mongoose.models.Transaction ||
  mongoose.model('Transaction', TransactionSchema);
