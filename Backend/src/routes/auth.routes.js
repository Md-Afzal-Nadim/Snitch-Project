import {Router} from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { googleCallback } from "../controllers/auth.controller.js";
import passport from "passport";
import { authenticateUser } from "../middlewares/auth.middleware.js";


const router = Router();

router.post("/register",validateRegisterUser, register);


router.post("/login", validateLoginUser, login);


router.get("/google",
   passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
   passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login" }),
   googleCallback
  
  )


  /**
   * @route GET /api/auth/me
   * @description Get the authenticated user's profile
   * @access private
   */
  router.get('/me',authenticateUser, getMe);
   


export default router;