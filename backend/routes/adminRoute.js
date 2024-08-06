import express from 'express';
import { createPost} from '../controller/admin.js';


const router = express.Router();

router.post("/create",createPost);

export default router;

