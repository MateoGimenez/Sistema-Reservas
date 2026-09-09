import supabase from "../config/supabase.js";
import AppError from "../errors/AppError.js";

export const verificarBarbero = async (req, res, next) => {
  try {
    const barberId = req.params.id;
    const usuarioId = req.user?.id;
    const rol = req.user?.role?.trim().toUpperCase();

    const { data: barbero, error } = await supabase
      .from("barberos")
      .select("id, usuario_id")
      .eq("id", barberId)
      .single();

    if (error || !barbero) {
      return next(new AppError("El Barbero no existe", 404));
    }

    if (rol !== "ADMIN" && barbero.usuario_id !== usuarioId) {
      return next(new AppError("No tienes permisos para modificar este Barbero", 403));
    }

    req.barbero = barbero;
    next();
  } catch (error) {
    next(error);
  }
};

export default verificarBarbero;
