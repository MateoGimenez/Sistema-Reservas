import Router from "express"
import { authorizeToken, authorizeRoles } from "../middlewares/authMiddleware.js"
import { getAllReservas, createReserva, updateReserva, deleteReserva } from "../controllers/reservasController.js"

const router = Router()

// GET - Obtener todas las reservas (solo admin)
router.get("/reservas", authorizeToken, authorizeRoles('admin'), getAllReservas)

// POST - Crear nueva reserva (cliente puede crear la suya, admin cualquiera)
router.post("/reservas", authorizeToken, authorizeRoles("admin", "cliente"), createReserva)

// PUT - Actualizar reserva (admin o dueño)
router.put("/reservas/:id", authorizeToken, authorizeRoles('admin', 'cliente'), updateReserva)

// DELETE - Eliminar reserva (admin o dueño)
router.delete("/reservas/:id", authorizeToken, authorizeRoles('admin', 'cliente'), deleteReserva)

export default router