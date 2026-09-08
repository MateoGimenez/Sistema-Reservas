import router from 'express';
import { login, register } from "../controllers/authController.js";
import { ValidationRegister } from "../middlewares/userMiddleware.js";

const authRouter = router();

authRouter.post("/login", login);
authRouter.post("/register", ValidationRegister, register);

export default authRouter;