import supabase from "../config/supabase.js"
import AppError from "../errors/AppError.js"

export const obtenerRolPorNombre = async (nombre) => {
    const { data, error } = await supabase
        .from("roles")
        .select("id, nombre")
        .ilike("nombre", nombre)
        .maybeSingle()

    if (error) {
        throw new AppError("Error al obtener el rol", 500)
    }

    if (!data) {
        throw new AppError(`El rol '${nombre}' no existe. Revisá los datos de roles en la DB.`, 500)
    }

    return data
}

export const obtenerEstadoPorNombre = async (nombre) => {
    const { data, error } = await supabase
        .from("estados_reserva")
        .select("id, nombre")
        .ilike("nombre", nombre)
        .maybeSingle()

    if (error || !data) {
        throw new AppError(`Estado '${nombre}' no encontrado`, 500)
    }

    return data
}

export const obtenerIdsEstadosQueOcupanTurno = async () => {
    const { data, error } = await supabase
        .from("estados_reserva")
        .select("id, nombre")

    if (error) {
        throw new AppError("Error al obtener estados de reserva", 500)
    }

    const ocupan = (data || []).filter((estado) => {
        const nombre = estado.nombre?.trim().toUpperCase()
        return nombre === "PENDIENTE" || nombre === "CONFIRMADA" || nombre === "CONFIRMADO"
    })

    if (ocupan.length === 0) {
        throw new AppError("No hay estados PENDIENTE/CONFIRMADA configurados", 500)
    }

    return ocupan.map((estado) => estado.id)
}
