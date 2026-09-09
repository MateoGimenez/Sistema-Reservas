import supabase from "../config/supabase.js";
import AppError from "../errors/AppError.js";


export const createUsuario = async (usuario) => {

    const { data, error } = await supabase
        .from("usuarios")
        .insert(usuario)
        .select("id, nombre, apellido, email, telefono, rol_id")
        .single();

    if (error) {
        if (error.code === "23505") {
            throw new AppError("Ya existe un usuario con ese email", 409);
        }
        throw new AppError(
            "Error al crear el usuario",
            500
        );
    }

    return data;
};


export const createCliente = async (usuarioId) => {

    const { data, error } = await supabase
        .from("clientes")
        .insert({
            usuario_id: usuarioId
        })
        .select("id, usuario_id")
        .single();

    if (error) {
        throw new AppError(
            "Error al crear el cliente",
            500
        );
    }

    return data;
};