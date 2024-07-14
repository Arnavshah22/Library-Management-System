import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    isbn: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    image:{
        type:String ,   //cloudinary url
        require:true
    },
    author: {
        type: String,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    available: {
        type: Number,
        required: true,
    },
    
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
