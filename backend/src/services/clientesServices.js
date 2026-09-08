import supabase from "../config/supabase.js";

import bcrypt from "bcryptjs";


export const getAllClients = async () => {

  const { data, error } = await supabase

    .from("clientes")

    .select(`
      id,
      usuario_id,
      usuarios (
        id,
        nombre,
        apellido,
        email,
        telefono,
        activo,
        creado_en,
        roles (
          id,
          nombre
        )
      )
    `);

  if (error) {

    throw new AppError("Error al obtener los clientes", 500);

  }

  if (!data || data.length === 0) {

    throw new AppError("No se encontraron clientes", 404);

  }

  return data;

};


export const CreateClient = async (clientData) => {
  const userId = clientData?.usuario_id ?? clientData?.userId;

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError("El campo 'usuario_id' debe ser un entero positivo", 400);
  }

  const { data, error } = await supabase

    .from("clientes")

    .insert({
      usuario_id: userId
    })

    .select(`
      id,
      usuario_id,
      usuarios (
        id,
        nombre,
        apellido,
        email,
        telefono,
        activo,
        creado_en,
        roles (
          id,
          nombre
        )
      )
    `)

    .single();

  if (error) {

    if (error.code === "23505") {

      throw new AppError(
        "Este usuario ya es un cliente",
        409
      );

    }

    if (error.code === "23503") {

      throw new AppError(
        "El usuario indicado no existe",
        400
      );

    }

    throw new AppError(
      "Error al crear el cliente",
      500
    );

  }

  if (!data) {

    throw new AppError(
      "No se pudo crear el cliente",
      400
    );

  }

  return data;

};


export const EditClient = async (clientId, userData) => {

  const {
    nombre,
    apellido,
    email,
    password,
    telefono
  } = userData;

  const updates = {};

  if (nombre) updates.nombre = nombre.trim();

  if (apellido) updates.apellido = apellido.trim();

  if (email) updates.email = email.trim().toLowerCase();

  if (password) {
    updates.password = await bcrypt.hash(password, 10);
  }

  if (telefono !== undefined) {
    updates.telefono = telefono?.trim() || null;
  }


  // Primero obtenemos el usuario relacionado con el cliente

  const { data: cliente, error: clienteError } = await supabase

    .from("clientes")

    .select("id, usuario_id")

    .eq("id", clientId)

    .single();


  if (clienteError) {

    throw new AppError(
      "Error al buscar el cliente",
      500
    );

  }

  if (!cliente) {

    throw new AppError(
      "No se encontró el cliente",
      404
    );

  }


  // Ahora actualizamos la tabla usuarios

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
      roles (
        id,
        nombre
      )
    `)

    .single();


  if (error) {

    if (error.code === "23505") {

      throw new AppError(
        "Ya existe un usuario con ese email",
        409
      );

    }

    throw new AppError(
      "Error al actualizar el cliente",
      500
    );

  }

  if (!data) {

    throw new AppError(
      "No se pudo actualizar el cliente",
      400
    );

  }

  return data;

};


export const DeleteClient = async (clientId) => {

  if (!clientId) {

    throw new AppError(
      "ID de cliente no proporcionado",
      400
    );

  }


  const { data, error } = await supabase

    .from("clientes")

    .delete()

    .eq("id", clientId)

    .select()

    .single();


  if (error) {

    throw new AppError(
      "Error al eliminar el cliente",
      500
    );

  }

  if (!data) {

    throw new AppError(
      "No se pudo eliminar el cliente",
      400
    );

  }

  return data;

};