import Router from "express"
import { getBarbers , NewBarber , EditBarberId , DeleteBarberId } from "../controllers/barberosControllers.js"
import { authorizeRoles, authorizeToken } from "../middlewares/authMiddleware.js"; 

const router = Router();

router.get("/barberos" ,authorizeToken , authorizeRoles("admin"), getBarbers)

router.post("/barberos" , authorizeToken, authorizeRoles("admin"), NewBarber)

router.put('/barberos/:id', authorizeToken, authorizeRoles("admin"), EditBarberId)
router.delete('/barberos/:id', authorizeToken, authorizeRoles("admin"), DeleteBarberId)

export default router