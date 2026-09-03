import Router from "express"
import supabase from "../config/supabase.js"
import {authorizeToken, authorizeRoles} from "../middlewares/authMiddleware.js"

const router = Router()

router.get("/users", authorizeToken,authorizeRoles("admin"), async (req, res) => {
  try {
    const { data, error } = await supabase.from("usuarios").select("id, nombre, email, telefono, activo, roles(id, nombre)")

    if (error) {
      console.error("Error de Supabase:", error)
      return res.status(500).json({ error: "Error al obtener los usuarios" })
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No se encontraron usuarios" })
    }

    return res.json(data)
  } catch (err) {
    console.error("Error inesperado:", err)
    return res.status(500).json({ error: "Error interno del servidor" })
  }
})

export default router