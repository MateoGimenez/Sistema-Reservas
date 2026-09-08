import supabse from "../config/supabase.js"
import AppError from "../errors/AppError.js"

export const VerifEmail = async(email)=> {
    const { data , error} = supabse.from('usuarios').select("id").eq('email' , email).maybeSingle()

    if(error){
        throw new AppError('Error al verificar el Usuariiio ',500)
    }

    if(data){
        throw new AppError("usuario o email ya registrado",409)
    }
}