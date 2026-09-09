import { Router } from "express";
import { getUsers , NewUser, EditUserId , DeleteUserId} from "../controllers/userController.js";
import { authorizeRoles, authorizeToken } from "../middlewares/authMiddleware.js";
import { ValidationUser, ValidationUserUpdate } from "../middlewares/userMiddleware.js"

const router = Router();

router.get("/users", authorizeToken, authorizeRoles("admin"), getUsers);

router.post("/users", authorizeToken, authorizeRoles("admin"), ValidationUser, NewUser);

router.put("/users/:id", authorizeToken, authorizeRoles("admin"), ValidationUserUpdate, EditUserId);

router.delete("/users/:id", authorizeToken, authorizeRoles("admin"), DeleteUserId);

export default router;
