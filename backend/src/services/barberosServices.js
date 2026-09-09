import supabase from "../config/supabase.js"
import bcrypt from "bcryptjs";
import AppError from "../errors/AppError.js";
import { obtenerRolPorNombre } from "../repositories/catalogRepository.js";

const BARBERO_SELECT = `
  id,
  descripcion,
  activo,
  usuario_id(
    id,
    nombre,
    apellido,
    email,
    telefono,
    activo,
    creado_en
  )
`;

export const getAllBarbers = async () => {
  const { data, error } = await supabase
    .from("barberos")
    .select(BARBERO_SELECT);

  if (error) {
    throw new AppError("Error al obtener los barberos", 500);
  }

  if (!data || data.length === 0) {
    throw new AppError("No se encontraron barberos", 404);
  }

  return data;
};

export const CreateBarber = async (barberData) => {
  const { nombre, apellido, email, password, telefono, descripcion, servicios } = barberData;

  if (!nombre || !apellido || !email || !password) {
    throw new AppError("Nombre, apellido, email y contraseña son requeridos", 400);
  }

  const rolBarbero = await obtenerRolPorNombre("barbero");
  const passwordHash = await bcrypt.hash(password, 10);

  let usuarioId = null;

  try {
    const { data: usuarioData, error: usuarioError } = await supabase
      .from("usuarios")
      .insert({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim().toLowerCase(),
        password: passwordHash,
        telefono: telefono?.trim() || null,
        rol_id: rolBarbero.id
      })
      .select("id")
      .single();

    if (usuarioError) {
      if (usuarioError.code === "23505") {
        throw new AppError("Ya existe un usuario con ese email", 409);
      }
      if (usuarioError.code === "23503") {
        throw new AppError("El rol barbero no existe", 400);
      }
      throw new AppError("Error al crear el usuario", 500);
    }

    usuarioId = usuarioData.id;

    const { data: barberoData, error: barberoError } = await supabase
      .from("barberos")
      .insert({
        usuario_id: usuarioId,
        descripcion: descripcion?.trim() || null,
        activo: true
      })
      .select(BARBERO_SELECT)
      .single();

    if (barberoError) {
      if (barberoError.code === "23505") {
        throw new AppError("Este usuario ya es un barbero", 409);
      }
      throw new AppError("Error al crear el registro de barbero", 500);
    }

    if (servicios && servicios.length > 0) {
      const serviciosData = servicios.map((servicio_id) => ({
        barbero_id: barberoData.id,
        servicio_id
      }));

      const { error: serviciosError } = await supabase
        .from("barbero_servicio")
        .insert(serviciosData);

      if (serviciosError) {
        throw new AppError("El barbero se creó pero no se pudieron asignar los servicios", 400);
      }
    }

    return barberoData;
  } catch (error) {
    if (usuarioId) {
      const { data: barberoExistente } = await supabase
        .from("barberos")
        .select("id")
        .eq("usuario_id", usuarioId)
        .maybeSingle();

      if (!barberoExistente) {
        await supabase.from("usuarios").delete().eq("id", usuarioId);
      }
    }

    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al crear el barbero", 500);
  }
};

export const EditBarber = async (BarberId, BarberData) => {
  const {
    nombre,
    apellido,
    email,
    password,
    telefono,
    descripcion,
    activo
  } = BarberData;

  const { data: barbero, error: barberoError } = await supabase
    .from("barberos")
    .select("id, usuario_id")
    .eq("id", BarberId)
    .single();

  if (barberoError || !barbero) {
    throw new AppError("El Barbero no existe", 404);
  }

  const updatesUsuario = {};

  if (nombre !== undefined) updatesUsuario.nombre = nombre.trim();
  if (apellido !== undefined) updatesUsuario.apellido = apellido.trim();
  if (email !== undefined) updatesUsuario.email = email.trim().toLowerCase();
  if (password !== undefined && password !== "") {
    updatesUsuario.password = await bcrypt.hash(password, 10);
  }
  if (telefono !== undefined) updatesUsuario.telefono = telefono?.trim() || null;

  let usuario = null;

  if (Object.keys(updatesUsuario).length > 0) {
    const { data, error: usuarioError } = await supabase
      .from("usuarios")
      .update(updatesUsuario)
      .eq("id", barbero.usuario_id)
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

    if (usuarioError) {
      if (usuarioError.code === "23505") {
        throw new AppError("Ya existe un usuario con ese email", 409);
      }
      throw new AppError("Error al actualizar el Barbero", 500);
    }

    usuario = data;
  }

  const updatesBarbero = {};
  if (descripcion !== undefined) updatesBarbero.descripcion = descripcion?.trim() || null;
  if (activo !== undefined) updatesBarbero.activo = activo;

  if (Object.keys(updatesBarbero).length > 0) {
    const { error: updateBarberoError } = await supabase
      .from("barberos")
      .update(updatesBarbero)
      .eq("id", BarberId);

    if (updateBarberoError) {
      throw new AppError("Error al actualizar el perfil del barbero", 500);
    }
  }

  return {
    barbero_id: barbero.id,
    usuario
  };
};

export const DeleteBarber = async (BarberId) => {
  if (!BarberId) {
    throw new AppError("ID de Barbero no proporcionado", 400);
  }

  const { data: barbero, error: barberoError } = await supabase
    .from("barberos")
    .select("id, usuario_id")
    .eq("id", BarberId)
    .single();

  if (barberoError || !barbero) {
    throw new AppError("El Barbero no existe", 404);
  }

  const { data, error } = await supabase
    .from("barberos")
    .update({ activo: false })
    .eq("id", BarberId)
    .select()
    .single();

  if (error || !data) {
    throw new AppError("No se pudo desactivar el Barbero", 400);
  }

  await supabase
    .from("usuarios")
    .update({ activo: false })
    .eq("id", barbero.usuario_id);

  return data;
}
