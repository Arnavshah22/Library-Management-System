import { User } from "../models/user.models.js";
import { Book } from "../models/Book.models.js";
import { Transaction } from "../models/Transaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addBook = asyncHandler(async (req, res) => {
    const { title, author, ISBN, quantity, description, genre } = req.body;

    if (!title || !author || !ISBN || !quantity) {
        throw new ApiError(400, "Title, author, ISBN, and quantity are required");
    }

    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
        throw new ApiError(409, "Book with this ISBN already exists");
    }

    const newBook = await Book.create({
        title,
        author,
        ISBN,
        quantity,
        available: quantity,
        description,
        genre
    });

    return res.status(201).json(
        new ApiResponse(201, { book: newBook }, "Book added successfully")
    );
});

const updateBookDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const book = await Book.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    return res.json(
        new ApiResponse(200, { book }, "Book details updated successfully")
    );
});

const issueBook = asyncHandler(async (req, res) => {
    const { bookId, userId } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.available <= 0) {
        throw new ApiError(400, "Book not available");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const transaction = await Transaction.create({
        book: bookId,
        user: userId,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    });

    book.available -= 1;
    await book.save();

    return res.json(
        new ApiResponse(200, { transaction }, "Book issued successfully")
    );
});

const returnBook = asyncHandler(async (req, res) => {
    const { transactionId } = req.body;

    const transaction = await Transaction.findById(transactionId).populate('book');
    if (!transaction || transaction.returnDate) {
        throw new ApiError(400, "Invalid transaction or book already returned");
    }

    transaction.returnDate = new Date();
    await transaction.save();

    const book = transaction.book;
    book.available += 1;
    await book.save();

    return res.json(
        new ApiResponse(200, { transaction }, "Book returned successfully")
    );
});

const getOverdueBooks = asyncHandler(async (req, res) => {
    const overdueTransactions = await Transaction.find({
        returnDate: null,
        dueDate: { $lt: new Date() }
    }).populate('book user');

    return res.json(
        new ApiResponse(200, { overdueTransactions }, "Overdue books fetched successfully")
    );
});

const generateReport = asyncHandler(async (req, res) => {
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.aggregate([
        { $group: { _id: null, totalAvailable: { $sum: "$available" } } }
    ]);
    const activeTransactions = await Transaction.countDocuments({ returnDate: null });
    const overdueTransactions = await Transaction.countDocuments({
        returnDate: null,
        dueDate: { $lt: new Date() }
    });

    const report = {
        totalBooks,
        availableBooks: availableBooks[0]?.totalAvailable || 0,
        activeTransactions,
        overdueTransactions
    };

    return res.json(
        new ApiResponse(200, { report }, "Report generated successfully")
    );
});

export {
    addBook,
    updateBookDetails,
    issueBook,
    returnBook,
    getOverdueBooks,
    generateReport
};