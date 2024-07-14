import { Router } from "express";
import { librarian, verifyJWT } from "../middleware/auth.middleware";
import { addBook, generateReport, getOverdueBooks, issueBook, returnBook, updateBookDetails } from "../controllers/librarian.controller";


const router=Router();

router.route("/add-books").post(verifyJWT,librarian,addBook);
router.route("/update-books").put(verifyJWT,librarian,updateBookDetails);
router.route("/issue-books").post(verifyJWT,librarian,issueBook);
router.route("/return-books").patch(verifyJWT,librarian,returnBook);
router.route("/get-over-due-books").get(verifyJWT,librarian,getOverdueBooks);
router.route("report").post(verifyJWT,librarian,generateReport);

export default router;
