import * as reservasRepository from "../repositories/reservasRepository.js"
import * as reservasValidator from "../validation/reservasValidation.js"
import { calcularHoraFin, hayConflictoHorario } from "../utils/timeUtills.js"
import AppError from "../errors/AppError.js"

// GET
export const obtenerTodasLasReservas = async () => {
    const reservas = await reservasRepository.obtenerTodasLasReservas()
    
    if (!reservas || reservas.length === 0) {
        throw new AppError("No se encontraron reservas", 404)
    }

    return reservas
}

// POST
export const crearNuevaReserva = async (reservaData) => {
    // 1. Validar datos
    reservasValidator.validarDatosCreacion(reservaData)

    const { cliente_id, barbero_id, servicio_id, fecha, hora_inicio, metodo_pago_id } = reservaData

    // 3. Obtener duración del servicio y calcular hora_fin
    const duracion = await reservasRepository.obtenerDuracionServicio(servicio_id)
    const hora_fin = calcularHoraFin(hora_inicio, duracion)

    // 4. Verificar disponibilidad
    const reservasConflicto = await reservasRepository.obtenerReservasConflicto(barbero_id, fecha, hora_inicio, hora_fin)
    
    const hayConflicto = reservasConflicto.some(r => 
        hayConflictoHorario(hora_inicio, hora_fin, r.hora_inicio, r.hora_fin)
    )

    if (hayConflicto) {
        throw new AppError("El barbero no tiene disponibilidad en ese horario", 400)
    }

    // 5. Obtener estado "pendiente"
    const estado = await reservasRepository.obtenerEstadoPorNombre("PENDIENTE")

    // 6. Crear la reserva
    const nuevaReserva = await reservasRepository.crearReserva({
        cliente_id,
        barbero_id,
        servicio_id,
        fecha,
        hora_inicio,
        hora_fin,
        estado_id: estado.id,
        metodo_pago_id: metodo_pago_id || null,
        creado_en: new Date().toISOString()
    })

    return nuevaReserva
}

// PUT
export const actualizarReservaExistente = async (id, reservaData) => {
    // 1. Validar datos
    reservasValidator.validarDatosActualizacion(reservaData)

    // 2. Verificar que existe
    const reservaExistente = await reservasRepository.obtenerReservaPorId(id)
    reservasValidator.validarExistenciaReserva(reservaExistente)

    // 3. Si se cambian datos críticos, validar disponibilidad
    if (reservaData.barbero_id || reservaData.servicio_id || reservaData.fecha || reservaData.hora_inicio) {
        const nuevoBarberO = reservaData.barbero_id || reservaExistente.barbero_id
        const nuevoServicio = reservaData.servicio_id || reservaExistente.servicio_id
        const nuevaFecha = reservaData.fecha || reservaExistente.fecha
        const nuevaHoraInicio = reservaData.hora_inicio || reservaExistente.hora_inicio

        // Verificar que el barbero ofrece el servicio
        const ofreceServicio = await reservasRepository.verificarBarberoOfreceServicio(nuevoBarberO, nuevoServicio)
        if (!ofreceServicio) {
            throw new AppError("El barbero no ofrece este servicio", 400)
        }

        // Calcular nueva hora_fin
        const duracion = await reservasRepository.obtenerDuracionServicio(nuevoServicio)
        const nuevaHoraFin = calcularHoraFin(nuevaHoraInicio, duracion)

        // Verificar disponibilidad (excluyendo esta reserva)
        const reservasConflicto = await reservasRepository.obtenerReservasConflicto(nuevoBarberO, nuevaFecha, nuevaHoraInicio, nuevaHoraFin, id)
        
        const hayConflicto = reservasConflicto.some(r => 
            hayConflictoHorario(nuevaHoraInicio, nuevaHoraFin, r.hora_inicio, r.hora_fin)
        )

        if (hayConflicto) {
            throw new AppError("El barbero no tiene disponibilidad en ese horario", 400)
        }

        // Agregar hora_fin a las actualizaciones
        reservaData.hora_fin = nuevaHoraFin
    }

    // 4. Actualizar
    const reservaActualizada = await reservasRepository.actualizarReserva(id, {
        ...reservaData,
        actualizado_en: new Date().toISOString()
    })

    return reservaActualizada
}

// DELETE
export const eliminarReservaExistente = async (id) => {
    // 1. Verificar que existe
    const reserva = await reservasRepository.obtenerReservaPorId(id)
    reservasValidator.validarExistenciaReserva(reserva)

    // 2. Eliminar
    await reservasRepository.eliminarReserva(id)

    return { mensaje: "Reserva eliminada correctamente" }
}


// export const getAllReservas = async () =>{
//     const { data , error} = await supabase.from("reservas").select(`id,fecha,hora_inicio,hora_fin,
//             cliente_id (
//                 usuario_id (
//                     id,
//                     nombre,
//                     telefono
//                 )
//             ),
//             barbero_id (
//                 usuario_id (
//                     nombre
//                 )
//             ),
//             servicio_id (nombre , precio),
//             estado_id (nombre),
//             metodo_pago_id (nombre)
//         `)

//     if(error){
//         throw new AppError("Error al obtener las reservas", 500)
//     }

//     if (!data || data.length === 0) {

//         throw new AppError("No se encontraron reservas", 404);
//     }

//   return data;
// }