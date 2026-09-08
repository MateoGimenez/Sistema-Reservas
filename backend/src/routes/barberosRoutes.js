import Router from "express"
import { getBarbers , NewBarber , EditBarberId , DeleteBarberId } from "../controllers/barberosControllers.js"
import { authorizeRoles, authorizeToken } from "../middlewares/authMiddleware.js"; 
import { verificarBarbero } from "../middlewares/barberosMiddleware.js"; 

const router = Router();

router.get("/barberos" ,authorizeToken , authorizeRoles("admin"), getBarbers)

router.post("/barberos" , authorizeToken, authorizeRoles("admin"), NewBarber)

router.put('/barberos/:id', authorizeToken, authorizeRoles("admin"), verificarBarbero, EditBarberId)

router.delete('/barberos/:id', authorizeToken, authorizeRoles("admin"), verificarBarbero, DeleteBarberId)

export default router