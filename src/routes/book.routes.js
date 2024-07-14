import { Router } from "express";
import { admin, librarian, verifyJWT } from "../middleware/auth.middleware";
import { createBook, deleteBook, getAllBooks, getBookById, getBooksByGenre, searchBooks, updateBook } from "../controllers/Books.controller";

const router=Router();

router.route("/get-books").get(verifyJWT,admin,getAllBooks);
router.route("/getbooks/:id").get(verifyJWT,admin,getBookById);
router.route("/add-books").post(verifyJWT,admin,createBook);
router.route("/update-books").put(verifyJWT,admin,updateBook);
router.route("/delete-books").delete(verifyJWT,admin,deleteBook);
router.route("/search-books").get(verifyJWT,admin,searchBooks);
router.route("/genere").get(verifyJWT,admin,getBooksByGenre);




export default router;

