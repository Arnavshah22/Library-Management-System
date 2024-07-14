import { Router } from "express";
import { admin, librarian, verifyJWT } from "../middleware/auth.middleware";
import { createBook, deleteBook, getAllBooks, getBookById, getBooksByGenre, searchBooks, updateBook } from "../controllers/Books.controller";

const router=Router();

router.route("/get-books").get(verifyJWT,admin,librarian,getAllBooks);
router.route("/getbooks/:id").get(verifyJWT,admin,librarian,getBookById);
router.route("/add-books").post(verifyJWT,admin,librarian,createBook);
router.route("/update-books").put(verifyJWT,admin,librarian,updateBook);
router.route("/delete-books").delete(verifyJWT,admin,librarian,deleteBook);
router.route("/search-books").get(verifyJWT,admin,librarian,searchBooks);
router.route("/genere").get(verifyJWT,admin,librarian,getBooksByGenre);




export default router;

