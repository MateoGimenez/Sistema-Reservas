import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";
import AppError from "../errors/AppError.js";

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nombre, apellido, email, telefono, activo, creado_en, roles(id, nombre)");

  if (error) {
    throw new AppError("Error al obtener los usuarios", 500);
  }

  if (!data || data.length === 0) {
    throw new AppError("No se encontraron usuarios", 404);
  }

  return data;
};

export const CreateUser = async (userData) => {
  const { nombre, apellido, email, password, telefono, rol_id } = userData;
  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("usuarios")
    .insert({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim().toLowerCase(),
      password: passwordHash,
      telefono: telefono?.trim() || null,
      rol_id
    })
    .select("id, nombre, apellido, email, telefono, activo, creado_en, roles(id, nombre)")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new AppError("Ya existe un usuario con ese email", 409);
    }

    if (error.code === "23503") {
      throw new AppError("El rol indicado no existe", 400);
    }

    throw new AppError("Error al crear el usuario", 500);
  }

  if (!data) {
    throw new AppError("No se pudo crear el usuario", 400);
  }

  return data;
};
