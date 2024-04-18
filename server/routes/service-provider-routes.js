import express from "express";
import {isAuthenticated} from "../middlewares/auth.js";

const router = express.Router();

import { 
    register,
    login,
    getclientIdAndSecret
} from "../controllers/service-provider-controllers.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/details").get(isAuthenticated,getclientIdAndSecret);

export default router;