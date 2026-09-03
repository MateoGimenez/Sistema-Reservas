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

export default ValidationAuth;