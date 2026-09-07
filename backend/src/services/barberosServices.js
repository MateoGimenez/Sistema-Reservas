import supabase from "../config/supabase.js"

export const getAllBarbers = async () => {
  const { data, error } = await supabase
    .from("barberos")
    .select(`id,descripcion,activo,
      usuario_id(
        id,
        nombre,
        apellido,
        email,
        telefono,
        activo
      )
    `);
  
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
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const { data: usuarioData, error: usuarioError } = await supabase
      .from("barberos")
      .insert({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim().toLowerCase(),
        password: passwordHash,
        telefono: telefono?.trim() || null,
        rol_id: 2 // ID del rol "barbero"
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

    if (!usuarioData?.id) {
      throw new AppError("No se pudo obtener el ID del usuario creado", 400);
    }

    // 2. Crear el registro en barberos
    const { data: barberoData, error: barberoError } = await supabase
      .from("barberos")
      .insert({
        usuario_id: usuarioData.id,
        descripcion: descripcion?.trim() || null,
        activo: true
      })
      .select(`
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
      `)
      .single();

    if (barberoError) {
      throw new AppError("Error al crear el registro de barbero", 500);
    }

    if (!barberoData) {
      throw new AppError("No se pudo crear el barbero", 400);
    }

    // 3. Opcional: Agregar servicios al barbero
    if (servicios && servicios.length > 0) {
      const serviciosData = servicios.map(servicio_id => ({
        barbero_id: barberoData.id,
        servicio_id
      }));

      const { error: serviciosError } = await supabase
        .from("barbero_servicio")
        .insert(serviciosData);

      if (serviciosError) {
        console.error("Error al asignar servicios:", serviciosError);
        // No lanzamos error aquí, el barbero ya fue creado
      }
    }

    return barberoData;

  } catch (error) {
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
    rol_id
  } = BarberData;

  // 1. Buscar el barbero y obtener el usuario asociado
  const { data: barbero, error: barberoError } = await supabase
    .from("barberos")
    .select("id, usuario_id")
    .eq("id", BarberId)
    .single();

  if (barberoError) {
    throw new AppError("Error al buscar el Barbero", 500);
  }

  if (!barbero) {
    throw new AppError("El Barbero no existe", 404);
  }

  // 2. Preparar los datos del usuario que vamos a modificar
  const updates = {};

  if (nombre !== undefined) {
    updates.nombre = nombre.trim();
  }

  if (apellido !== undefined) {
    updates.apellido = apellido.trim();
  }

  if (email !== undefined) {
    updates.email = email.trim().toLowerCase();
  }

  if (password !== undefined && password !== "") {
    updates.password = await bcrypt.hash(password, 10);
  }

  if (telefono !== undefined) {
    updates.telefono = telefono?.trim() || null;
  }

  if (rol_id !== undefined) {
    updates.rol_id = rol_id;
  }

  // 3. Actualizar el usuario
  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .update(updates)
    .eq("id", barbero.usuario_id)
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

  // 4. Manejar errores
  if (usuarioError) {

    if (usuarioError.code === "23505") {
      throw new AppError(
        "Ya existe un usuario con ese email",
        409
      );
    }

    if (usuarioError.code === "23503") {
      throw new AppError(
        "El rol indicado no existe",
        400
      );
    }

    throw new AppError(
      "Error al actualizar el Barbero",
      500
    );
  }

  if (!usuario) {
    throw new AppError(
      "No se pudo actualizar el Barbero",
      400
    );
  }

  // 5. Devolver la información actualizada
  return {
    barbero_id: barbero.id,
    usuario
  };
};


export const DeleteBarber = async (BarberId) => {
  
  if(!BarberId){
    throw new AppError("ID de Barbero no proporcionado", 400);
  }

  const {data , error } = await supabase.from("barberos").delete().eq("id", BarberId).select().single();

  if(error) {
    throw new AppError("Error al eliminar el Barbero", 500);
  }

  if (!data) {
    throw new AppError("No se pudo eliminar el Barbero", 400);
  }

  return data;
}