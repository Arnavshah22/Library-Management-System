import { Router } from "express";
const router=Router();

    router.route("/register").post(registerUser)

    router.route("/login").post(loginUser)


    //secured routes
    router.route("/logout").post(verifyJWT,logoutUser)
  

export default router