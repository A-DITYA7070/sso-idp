import express from "express";
import {isAuthenticated} from "../middlewares/auth.js";
import { 
    register,
    login,
    loginVerify
} from "../controllers/user-controller.js";

const router = express.Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/sso/login").post(loginVerify);


export default router;