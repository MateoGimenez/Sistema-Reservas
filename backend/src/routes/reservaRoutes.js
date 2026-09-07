import Router from "express"
import { authorizeToken, authorizeRoles } from "../middlewares/authMiddleware.js"
import { getReservas } from "../controllers/reservasController.js"

const router = Router()

router.get("/reserva",authorizeToken , authorizeRoles("admin"), getReservas)

export default router