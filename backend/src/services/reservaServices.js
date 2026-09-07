import supabase from "../config/supabase.js"
import AppError from "../errors/AppError.js"

export const getAllReservas = async () =>{
    const { data , error} = await supabase.from("reservas").select("*")
    if(error){
        throw new AppError("Error al obtener las reservas", 500)
    }

    if (!data || data.length === 0) {

        throw new AppError("No se encontraron reservas", 404);
    }

  return data;
}