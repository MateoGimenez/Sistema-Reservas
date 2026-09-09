import Router from "express"
import { authorizeToken, authorizeRoles } from "../middlewares/authMiddleware.js"
import { getAllReservas, createReserva, updateReserva, deleteReserva } from "../controllers/reservasController.js"

const router = Router()

router.get("/reservas", authorizeToken, authorizeRoles('admin'), getAllReservas)

router.post("/reservas", authorizeToken, authorizeRoles('cliente', 'admin'), createReserva)

// PUT - Actualizar reserva (admin o dueño)
router.put("/reservas/:id", authorizeToken, authorizeRoles('admin', 'cliente'), updateReserva)

// DELETE - Eliminar reserva (admin o dueño)
router.delete("/reservas/:id", authorizeToken, authorizeRoles('admin', 'cliente'), deleteReserva)

export default router