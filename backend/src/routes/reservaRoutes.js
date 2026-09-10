import Router from "express"
import { authorizeToken, authorizeRoles } from "../middlewares/authMiddleware.js"
import { getAllReservas, createReserva, updateReserva, deleteReserva } from "../controllers/reservasController.js"

const router = Router()

router.get("/reserve", authorizeToken, authorizeRoles('admin'), getAllReservas)

router.post("/reserve", authorizeToken, authorizeRoles('cliente', 'admin'), createReserva)

// PUT - Actualizar reserva (admin o dueño)
router.put("/reserve/:id", authorizeToken, authorizeRoles('admin', 'cliente'), updateReserva)

// DELETE - Eliminar reserva (admin o dueño)
router.delete("/reserve/:id", authorizeToken, authorizeRoles('admin', 'cliente'), deleteReserva)

export default router