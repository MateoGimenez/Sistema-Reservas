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


export const EditUser = async (userId, userData) => {
  const { nombre, apellido, email, password, telefono, rol_id } = userData;
  const updates = {};

  if (nombre) updates.nombre = nombre.trim();
  if (apellido) updates.apellido = apellido.trim();
  if (email) updates.email = email.trim().toLowerCase();
  if (password) updates.password = await bcrypt.hash(password, 10);
  if (telefono !== undefined) updates.telefono = telefono?.trim() || null;
  if (rol_id !== undefined) updates.rol_id = rol_id;

  const { data, error } = await supabase
    .from("usuarios")
    .update(updates)
    .eq("id", userId)
    .select("id, nombre, apellido, email, telefono, activo, creado_en, roles(id, nombre)")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new AppError("Ya existe un usuario con ese email", 409);
    }

    if (error.code === "23503") {
      throw new AppError("El rol indicado no existe", 400);
    }

    throw new AppError("Error al actualizar el usuario", 500);
  }

  if (!data) {
    throw new AppError("No se pudo actualizar el usuario", 400);
  }

  return data;
}

export const DeleteUser = async (userId) => {
  
  if(!userId){
    throw new AppError("ID de usuario no proporcionado", 400);
  }

  const id = Number(userId);

  if (isNaN(id)) {
    throw new AppError("ID de usuario inválido", 400);
  }

  const {data , error } = await supabase.from("usuarios").delete().eq("id", id).single()

  if(error) {
    throw new AppError("Error al eliminar el usuario", 500);
  }

  if (!data) {
    throw new AppError("No se pudo eliminar el usuario", 400);
  }

  return data;
}