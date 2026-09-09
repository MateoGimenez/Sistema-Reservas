import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../errors/AppError.js"
import { VerifEmail } from "../repositories/authRepository.js";
import { createUsuario, createCliente } from "../repositories/registerRepository.js";
import { obtenerRolPorNombre } from "../repositories/catalogRepository.js";

const ValidationAuth = async (email, password) => {

    const { data, error } = await supabase
        .from("usuarios")
        .select(
            "id,nombre,email,telefono,password,activo,roles(id,nombre)"
        )
        .eq("email", email.trim().toLowerCase())
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

    return {
        token,
        usuario: {
            id: data.id,
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono,
            rol: data.roles.nombre
        }
    };
};


export const ValidationRegister = async (data) => {

    const {
        nombre,
        apellido,
        email,
        password,
        telefono
    } = data;

    await VerifEmail(email);

    const rolCliente = await obtenerRolPorNombre("cliente");
    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await createUsuario({
        nombre,
        apellido,
        email: email.trim().toLowerCase(),
        password: passwordHash,
        telefono,
        rol_id: rolCliente.id
    });

    try {
        const cliente = await createCliente(usuario.id);
        return {
            usuario,
            cliente
        };
    } catch (error) {
        await supabase.from("usuarios").delete().eq("id", usuario.id);
        throw error;
    }
};

export { ValidationAuth };
