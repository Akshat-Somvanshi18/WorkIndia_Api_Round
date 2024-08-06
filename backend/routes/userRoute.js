import express from 'express';
import { registerUser, loginUser, getFeed, getFeedWithfilters } from '../controller/user.js';


const router = express.Router();

router.post("/signup",registerUser);
router.post("/login",loginUser);
router.get("/shorts/feed",getFeed);
router.get("/shorts/filter",getFeedWithfilters);

export default router;


