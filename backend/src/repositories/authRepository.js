import supabase from "../config/supabase.js"
import AppError from "../errors/AppError.js"

export const VerifEmail = async (email) => {
    const { data, error } = await supabase
        .from("usuarios")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle()

    if (error) {
        throw new AppError("Error al verificar el usuario", 500)
    }

    if (data) {
        throw new AppError("usuario o email ya registrado", 409)
    }
}
