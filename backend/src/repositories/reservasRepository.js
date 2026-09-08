import supabase from "../config/supabase.js"
import AppError from "../errors/AppError.js"

// GET
export const obtenerTodasLasReservas = async () => {
    const { data, error } = await supabase
        .from("reservas")
        .select(`
            id,
            fecha,
            hora_inicio,
            hora_fin,
            cliente_id (usuario_id (nombre, telefono)),
            barbero_id (usuario_id (nombre)),
            servicio_id (nombre, precio, duracion_minutos),
            estado_id (nombre),
            metodo_pago_id (nombre)
        `)

    if (error) throw new AppError("Error al obtener las reservas", 500)
    return data
}

export const obtenerReservaPorId = async (id) => {
    const { data, error } = await supabase
        .from("reservas")
        .select("*")
        .eq("id", id)
        .single()

    if (error) throw new AppError("Reserva no encontrada", 404)
    return data
}

// Verificaciones
export const verificarBarberoOfreceServicio = async (barberoId, servicioId) => {
    const { data, error } = await supabase
        .from("barbero_servicio")
        .select("*")
        .eq("barbero_id", barberoId)
        .eq("servicio_id", servicioId)
        .single()

    if (error || !data) return false
    return true
}

export const obtenerDuracionServicio = async (servicioId) => {
    const { data, error } = await supabase
        .from("servicios")
        .select("duracion_minutos")
        .eq("id", servicioId)
        .single()

    if (error) throw new AppError("Servicio no encontrado", 404)
    return data.duracion_minutos
}

export const obtenerReservasConflicto = async (barberoId, fecha, horaInicio, horaFin, excluirId = null) => {
    let query = supabase
        .from("reservas")
        .select("hora_inicio, hora_fin")
        .eq("barbero_id", barberoId)
        .eq("fecha", fecha)
        .in("estado_id", [1, 2]) // Estados activos

    if (excluirId) {
        query = query.neq("id", excluirId)
    }

    const { data, error } = await query

    if (error) throw new AppError("Error al verificar disponibilidad", 500)
    return data || []
}

export const obtenerClientePorUsuarioId = async (usuarioId) => {
    const { data, error } = await supabase
        .from("clientes")
        .select("id")
        .eq("usuario_id", usuarioId)
        .single()

    if (error || !data) throw new AppError("Cliente no encontrado", 404)
    return data
}

export const obtenerEstadoPorNombre = async (nombre) => {
    const { data, error } = await supabase
        .from("estados_reserva")
        .select("id")
        .eq("nombre", nombre)
        .single()

    if (error) throw new AppError(`Estado '${nombre}' no encontrado`, 500)
    return data
}

// CREATE
export const crearReserva = async (reservaData) => {
    const { data, error } = await supabase
        .from("reservas")
        .insert([reservaData])
        .select()

    if (error) throw new AppError("Error al crear la reserva", 500)
    return data[0]
}

// UPDATE
export const actualizarReserva = async (id, actualizaciones) => {
    const { data, error } = await supabase
        .from("reservas")
        .update(actualizaciones)
        .eq("id", id)
        .select()

    if (error) throw new AppError("Error al actualizar la reserva", 500)
    return data[0]
}

// DELETE
export const eliminarReserva = async (id) => {
    const { error } = await supabase
        .from("reservas")
        .delete()
        .eq("id", id)

    if (error) throw new AppError("Error al eliminar la reserva", 500)
}