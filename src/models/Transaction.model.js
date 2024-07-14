import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    borrowedDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    returnedDate: {
        type: Date,
    },
    lateFee: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export const Transaction=mongoose.model("Transaction",transactionSchema);

