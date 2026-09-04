import { Router } from "express";
import { getUsers , NewUser } from "../controllers/userController.js";
import { authorizeRoles, authorizeToken } from "../middlewares/authMiddleware.js";
import { ValidationUser } from "../middlewares/userMiddleware.js"

const router = Router();

router.get("/users", authorizeToken, authorizeRoles("admin"), getUsers);

router.post("/users", authorizeToken, authorizeRoles("admin"), ValidationUser, NewUser);

export default router;
