import supabase from "../config/supabase.js";
import AppError from "../errors/AppError.js";

export const verificarBarbero = async (req, res, next) => {
  const barberId = req.params.id;
  const usuarioId = req.user.id;

  const { data: barbero, error } = await supabase
    .from("barberos")
    .select("id, usuario_id")
    .eq("id", barberId)
    .single();

  if (error) {
    throw new AppError("Error al verificar el Barbero", 500);
  }

  if (!barbero) {
    throw new AppError("El Barbero no existe", 404);
  }

  if (barbero.usuario_id !== usuarioId) {
    throw new AppError(
      "No tienes permisos para modificar este Barbero",
      403
    );
  }

  req.barbero = barbero;

  next();
};

export default verificarBarbero;