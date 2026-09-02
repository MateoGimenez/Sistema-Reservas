import router from 'express';
import { login } from "../controllers/authController.js";

const authRouter = router();

authRouter.post("/login", login);

export default authRouter;