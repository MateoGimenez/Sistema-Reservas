import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../errors/AppError.js"

const ValidationAuth = async (email, password) => {

    const { data, error } = await supabase
        .from("usuarios")
        .select(
            "id,nombre,email,telefono,password,activo,roles(id,nombre)"
        )
        .eq("email", email)
        .single();

    if (error && error.code !== "PGRST116") {
        throw new AppError("Error de Supabase", 500);
    }

    if (!data) {
        throw new AppError("Credenciales Incorrectas", 401);
    }

    if (!data.activo) {
        throw new AppError("Credenciales Incorrectas", 401);
    }

    const passwordCorrecta = await bcrypt.compare(
        password,
        data.password
    );

    if (!passwordCorrecta) {
        throw new AppError("Credenciales Incorrectas", 401);
    }

    const token = jwt.sign(
        {
            id: data.id,
            rol: data.roles.nombre
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    const resultado = {
        token,
        usuario: {
            id: data.id,
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono,
            rol: data.roles.nombre
        }
    };

    return resultado;
};

export const RegisterUser = async ({ nombre, apellido, email, password, telefono }) => {
    const passwordHash = await bcrypt.hash(password, 10);

    const { data: rol, error: rolError } = await supabase
        .from("roles")
        .select("id, nombre")
        .ilike("nombre", "cliente")
        .single();

    if (rolError || !rol) {
        throw new AppError("El rol CLIENTE no está configurado", 500);
    }

    const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .insert({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            email: email.trim().toLowerCase(),
            password: passwordHash,
            telefono: telefono?.trim() || null,
            rol_id: rol.id
        })
        .select("id, nombre, apellido, email, telefono, activo, roles(id, nombre)")
        .single();

    if (usuarioError) {
        if (usuarioError.code === "23505") {
            throw new AppError("Ya existe un usuario con ese email", 409);
        }

        throw new AppError("Error al registrar el usuario", 500);
    }

    const { error: clienteError } = await supabase
        .from("clientes")
        .insert({ usuario_id: usuario.id });

    if (clienteError) {
        await supabase.from("usuarios").delete().eq("id", usuario.id);
        throw new AppError("No se pudo completar el registro del cliente", 500);
    }

    const token = jwt.sign(
        { id: usuario.id, rol: usuario.roles.nombre },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {
        token,
        usuario
    };
};

export default ValidationAuth;