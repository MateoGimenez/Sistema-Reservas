import Router from "express"
import { getBarbers , NewBarber , EditBarberId , DeleteBarberId } from "../controllers/barberosControllers.js"
import { authorizeRoles, authorizeToken } from "../middlewares/authMiddleware.js"; 

const router = Router();

router.get("/barbers" ,authorizeToken , authorizeRoles("admin"), getBarbers)

router.post("/barbers" , authorizeToken, authorizeRoles("admin"), NewBarber)

router.put('/barbers/:id', authorizeToken, authorizeRoles("admin"), EditBarberId)

router.delete('/barbers/:id', authorizeToken, authorizeRoles("admin"), DeleteBarberId)

export default router