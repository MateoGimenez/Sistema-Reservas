import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";
import AppError from "../errors/AppError.js";

const CLIENTE_SELECT = `
  id,
  usuario_id (
    id,
    nombre,
    apellido,
    email,
    telefono,
    activo,
    creado_en,
    roles (id, nombre)
  )
`;

export const getAllClients = async () => {
  const { data, error } = await supabase
    .from("clientes")
    .select(CLIENTE_SELECT);

  if (error) {
    throw new AppError("Error al obtener los clientes", 500);
  }

  if (!data || data.length === 0) {
    throw new AppError("No se encontraron clientes", 404);
  }

  return data;
};

export const CreateClient = async (clientData) => {
  const usuario_id = typeof clientData === "object"
    ? clientData.usuario_id
    : clientData;

  if (!usuario_id) {
    throw new AppError("usuario_id es requerido", 400);
  }

  const { data, error } = await supabase
    .from("clientes")
    .insert({ usuario_id })
    .select(CLIENTE_SELECT)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new AppError("Este usuario ya es un cliente", 409);
    }
    if (error.code === "23503") {
      throw new AppError("El usuario indicado no existe", 400);
    }
    throw new AppError("Error al crear el cliente", 500);
  }

  if (!data) {
    throw new AppError("No se pudo crear el cliente", 400);
  }

  return data;
};

export const EditClient = async (clientId, userData) => {
  const { nombre, apellido, email, password, telefono } = userData;
  const updates = {};

  if (nombre) updates.nombre = nombre.trim();
  if (apellido) updates.apellido = apellido.trim();
  if (email) updates.email = email.trim().toLowerCase();
  if (password) updates.password = await bcrypt.hash(password, 10);
  if (telefono !== undefined) updates.telefono = telefono?.trim() || null;

  const { data: cliente, error: clienteError } = await supabase
    .from("clientes")
    .select("id, usuario_id")
    .eq("id", clientId)
    .single();

  if (clienteError || !cliente) {
    throw new AppError("No se encontró el cliente", 404);
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError("No hay campos para actualizar", 400);
  }

  const { data, error } = await supabase
    .from("usuarios")
    .update(updates)
    .eq("id", cliente.usuario_id)
    .select(`
      id,
      nombre,
      apellido,
      email,
      telefono,
      activo,
      creado_en,
      roles (id, nombre)
    `)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new AppError("Ya existe un usuario con ese email", 409);
    }
    throw new AppError("Error al actualizar el cliente", 500);
  }

  if (!data) {
    throw new AppError("No se pudo actualizar el cliente", 400);
  }

  return data;
};

export const DeleteClient = async (clientId) => {
  if (!clientId) {
    throw new AppError("ID de cliente no proporcionado", 400);
  }

  const { data: cliente, error: clienteError } = await supabase
    .from("clientes")
    .select("id, usuario_id")
    .eq("id", clientId)
    .single();

  if (clienteError || !cliente) {
    throw new AppError("No se encontró el cliente", 404);
  }

  const { data, error } = await supabase
    .from("usuarios")
    .update({ activo: false })
    .eq("id", cliente.usuario_id)
    .select("id, nombre, email, activo")
    .single();

  if (error || !data) {
    throw new AppError("No se pudo desactivar el cliente", 400);
  }

  return data;
};
