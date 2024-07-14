import { Router } from "express";

import { admin, verifyJWT } from "../middleware/auth.middleware.js";
import { deleteUser, getAllUsers, getSystemStatistics } from "../controllers/admin.controller.js";
const router=Router();
    
router.route("/get-users").get(verifyJWT,admin,getAllUsers);
router.route("/delete/:id").delete(verifyJWT,admin,deleteUser);
router.route("/statistic").get(verifyJWT,admin,getSystemStatistics);


  

export default router