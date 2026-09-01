import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ValidationAuth = async (email, password) => {

    const { data, error } = await supabase
        .from("usuarios")
        .select(
            "id,nombre,email,telefono,password,activo,rol(id,nombre)"
        )
        .eq("email", email)
        .single();

    if (error && error.code !== "PGRST116") {
        throw new Error("Error de Supabase");
    }

    if (!data) {
        throw new Error("Credenciales Incorrectas");
    }

    if (!data.activo) {
        throw new Error("Credenciales Incorrectas");
    }

    const passwordCorrecta = await bcrypt.compare(
        password,
        data.password
    );

    if (!passwordCorrecta) {
        throw new Error("Credenciales Incorrectas");
    }

    const token = jwt.sign(
        {
            id: data.id,
            rol: data.rol.nombre
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
            rol: data.rol.nombre
        }
    };

    return resultado;
};

export default ValidationAuth;