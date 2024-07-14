import { Book } from "../models/Book.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({}).select("-__v");
    if (!books.length) {
        throw new ApiError(404, "No books found");
    }
    return res.json(
        new ApiResponse(200, { books }, "Books fetched successfully")
    );
});

const getBookById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id).select("-__v");
    if (!book) {
        throw new ApiError(404, "Book not found");
    }
    return res.json(
        new ApiResponse(200, { book }, "Book fetched successfully")
    );
});

const createBook = asyncHandler(async (req, res) => {
    const { title, author, ISBN, quantity, description, genre } = req.body;
    
    if (!title || !author || !ISBN || !quantity) {
        throw new ApiError(400, "Title, author, ISBN, and quantity are required");
    }

    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
        throw new ApiError(409, "Book with this ISBN already exists");
    }

    const newBook = new Book({
        title,
        author,
        ISBN,
        quantity,
        available: quantity,
        description,
        genre
    });

    const savedBook = await newBook.save();

    return res.status(201).json(
        new ApiResponse(201, { book: savedBook }, "Book created successfully")
    );
});

const updateBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const book = await Book.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    return res.json(
        new ApiResponse(200, { book }, "Book updated successfully")
    );
});

const deleteBook = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    return res.json(
        new ApiResponse(200, {}, "Book deleted successfully")
    );
});

const searchBooks = asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (!query) {
        throw new ApiError(400, "Search query is required");
    }

    const books = await Book.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } },
            { ISBN: { $regex: query, $options: 'i' } }
        ]
    }).select("-__v");

    return res.json(
        new ApiResponse(200, { books }, "Search results fetched successfully")
    );
});

const getBooksByGenre = asyncHandler(async (req, res) => {
    const { genre } = req.params;
    const books = await Book.find({ genre }).select("-__v");

    if (!books.length) {
        throw new ApiError(404, "No books found for this genre");
    }

    return res.json(
        new ApiResponse(200, { books }, `Books in ${genre} genre fetched successfully`)
    );
});

export {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    searchBooks,
    getBooksByGenre
};