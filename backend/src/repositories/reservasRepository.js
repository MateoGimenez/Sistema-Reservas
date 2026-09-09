import supabase from "../config/supabase.js"
import AppError from "../errors/AppError.js"
import { obtenerIdsEstadosQueOcupanTurno } from "./catalogRepository.js"

export const obtenerTodasLasReservas = async () => {
    const { data, error } = await supabase
        .from("reservas")
        .select(`
            id,
            fecha,
            hora_inicio,
            hora_fin,
            cliente_id (id, usuario_id (nombre, telefono)),
            barbero_id (id, usuario_id (nombre)),
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
        .maybeSingle()

    if (error) throw new AppError("Error al obtener la reserva", 500)
    return data
}

export const obtenerClientePorUsuarioId = async (usuarioId) => {
    const { data, error } = await supabase
        .from("clientes")
        .select("id, usuario_id")
        .eq("usuario_id", usuarioId)
        .maybeSingle()

    if (error) throw new AppError("Error al obtener el cliente", 500)
    return data
}

export const obtenerBarberoActivo = async (barberoId) => {
    const { data, error } = await supabase
        .from("barberos")
        .select("id, activo, usuario_id")
        .eq("id", barberoId)
        .maybeSingle()

    if (error) throw new AppError("Error al obtener el barbero", 500)
    return data
}

export const obtenerServicioActivo = async (servicioId) => {
    const { data, error } = await supabase
        .from("servicios")
        .select("id, duracion_minutos, activo")
        .eq("id", servicioId)
        .maybeSingle()

    if (error) throw new AppError("Error al obtener el servicio", 500)
    return data
}

export const obtenerHorariosBarbero = async (barberoId, diaSemana) => {
    const { data, error } = await supabase
        .from("horarios")
        .select("hora_inicio, hora_fin")
        .eq("barbero_id", barberoId)
        .eq("dia_semana", diaSemana)

    if (error) throw new AppError("Error al obtener los horarios del barbero", 500)
    return data || []
}

export const verificarBarberoOfreceServicio = async (barberoId, servicioId) => {
    const { data, error } = await supabase
        .from("barbero_servicio")
        .select("barbero_id")
        .eq("barbero_id", barberoId)
        .eq("servicio_id", servicioId)
        .maybeSingle()

    if (error) return false
    return Boolean(data)
}

export const obtenerDuracionServicio = async (servicioId) => {
    const servicio = await obtenerServicioActivo(servicioId)
    if (!servicio) throw new AppError("Servicio no encontrado", 404)
    return servicio.duracion_minutos
}

export const obtenerReservasConflicto = async (barberoId, fecha, excluirId = null) => {
    const estadosOcupan = await obtenerIdsEstadosQueOcupanTurno()

    let query = supabase
        .from("reservas")
        .select("hora_inicio, hora_fin")
        .eq("barbero_id", barberoId)
        .eq("fecha", fecha)
        .in("estado_id", estadosOcupan)

    if (excluirId) {
        query = query.neq("id", excluirId)
    }

    const { data, error } = await query

    if (error) throw new AppError("Error al verificar disponibilidad", 500)
    return data || []
}

export const crearReserva = async (reservaData) => {
    const { data, error } = await supabase
        .from("reservas")
        .insert([reservaData])
        .select()

    if (error) {
        if (error.code === "23503") {
            throw new AppError("Alguna referencia de la reserva no existe", 400)
        }
        throw new AppError("Error al crear la reserva", 500)
    }
    return data[0]
}

export const actualizarReserva = async (id, actualizaciones) => {
    const { data, error } = await supabase
        .from("reservas")
        .update(actualizaciones)
        .eq("id", id)
        .select()

    if (error) throw new AppError("Error al actualizar la reserva", 500)
    return data[0]
}

export const eliminarReserva = async (id) => {
    const { error } = await supabase
        .from("reservas")
        .delete()
        .eq("id", id)

    if (error) throw new AppError("Error al eliminar la reserva", 500)
}
