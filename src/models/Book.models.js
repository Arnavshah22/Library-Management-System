import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book title is required"],
        trim: true,
        maxlength: [100, "Book title cannot be more than 100 characters"]
    },
    author: {
        type: String,
        required: [true, "Author name is required"],
        trim: true,
        maxlength: [50, "Author name cannot be more than 50 characters"]
    },
    ISBN: {
        type: String,
        required: [true, "ISBN is required"],
        unique: true,
        trim: true,
        match: [/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/, "Please enter a valid ISBN"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [0, "Quantity cannot be negative"]
    },
    available: {
        type: Number,
        min: [0, "Available quantity cannot be negative"],
        validate: {
            validator: function(value) {
                return value <= this.quantity;
            },
            message: "Available quantity cannot be more than total quantity"
        }
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "Description cannot be more than 500 characters"]
    },
    genre: {
        type: String,
        trim: true,
        lowercase: true,
        enum: ["fiction", "non-fiction", "science", "history", "biography", "children", "other"]
    },
    publishedDate: {
        type: Date
    },
    publisher: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        min: [0, "Price cannot be negative"]
    },
    coverImage: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Virtual for book's URL
bookSchema.virtual('url').get(function() {
    return `/catalog/book/${this._id}`;
});

// Pre-save hook to ensure available is set if not provided
bookSchema.pre('save', function(next) {
    if (this.isNew && this.available === undefined) {
        this.available = this.quantity;
    }
    next();
});

export const Book = mongoose.model("Book", bookSchema);