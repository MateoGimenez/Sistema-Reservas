import router from 'express';
import { login , register } from "../controllers/authController.js";


const authRouter = router();

authRouter.post("/login", login);

authRouter.post("/register" , register)

export default authRouter;