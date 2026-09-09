import * as reservasRepository from "../repositories/reservasRepository.js"
import * as reservasValidator from "../validation/reservasValidation.js"
import { obtenerEstadoPorNombre } from "../repositories/catalogRepository.js"
import {
    calcularHoraFin,
    hayConflictoHorario,
    estaDentroDelHorario,
    diaSemanaDesdeFecha,
    normalizarHora
} from "../utils/timeUtills.js"
import AppError from "../errors/AppError.js"

const rolDe = (user) => user?.role?.trim().toUpperCase()

const assertPuedeGestionarReserva = async (reserva, user) => {
    if (rolDe(user) === "ADMIN") return

    const cliente = await reservasRepository.obtenerClientePorUsuarioId(user.id)
    if (!cliente || cliente.id !== reserva.cliente_id) {
        throw new AppError("No puedes modificar esta reserva", 403)
    }
}

const resolverClienteId = async (reservaData, user) => {
    if (rolDe(user) === "CLIENTE") {
        const cliente = await reservasRepository.obtenerClientePorUsuarioId(user.id)
        if (!cliente) {
            throw new AppError("No existe un perfil de cliente para este usuario", 403)
        }
        return cliente.id
    }

    if (!reservaData.cliente_id) {
        throw new AppError("cliente_id es requerido", 400)
    }

    return reservaData.cliente_id
}

const validarTurnoDisponible = async ({ barberoId, servicioId, fecha, horaInicio, excluirId = null }) => {
    const barbero = await reservasRepository.obtenerBarberoActivo(barberoId)
    if (!barbero) throw new AppError("Barbero no encontrado", 404)
    if (!barbero.activo) throw new AppError("El barbero no está activo", 400)

    const servicio = await reservasRepository.obtenerServicioActivo(servicioId)
    if (!servicio) throw new AppError("Servicio no encontrado", 404)
    if (!servicio.activo) throw new AppError("El servicio no está activo", 400)

    const ofreceServicio = await reservasRepository.verificarBarberoOfreceServicio(barberoId, servicioId)
    if (!ofreceServicio) {
        throw new AppError("El barbero no ofrece este servicio", 400)
    }

    const hora_inicio = normalizarHora(horaInicio)
    const hora_fin = calcularHoraFin(hora_inicio, servicio.duracion_minutos)

    const diaSemana = diaSemanaDesdeFecha(fecha)
    const horarios = await reservasRepository.obtenerHorariosBarbero(barberoId, diaSemana)

    if (!horarios.length) {
        throw new AppError("El barbero no atiende ese día", 400)
    }

    const entraEnFranja = horarios.some((horario) =>
        estaDentroDelHorario(hora_inicio, hora_fin, horario.hora_inicio, horario.hora_fin)
    )

    if (!entraEnFranja) {
        throw new AppError("El horario está fuera de la franja de atención del barbero", 400)
    }

    const reservasConflicto = await reservasRepository.obtenerReservasConflicto(barberoId, fecha, excluirId)
    const hayConflicto = reservasConflicto.some((reserva) =>
        hayConflictoHorario(hora_inicio, hora_fin, reserva.hora_inicio, reserva.hora_fin)
    )

    if (hayConflicto) {
        throw new AppError("El barbero no tiene disponibilidad en ese horario", 400)
    }

    return { hora_inicio, hora_fin }
}

export const obtenerTodasLasReservas = async () => {
    const reservas = await reservasRepository.obtenerTodasLasReservas()

    if (!reservas || reservas.length === 0) {
        throw new AppError("No se encontraron reservas", 404)
    }

    return reservas
}

export const crearNuevaReserva = async (reservaData, user) => {
    reservasValidator.validarDatosCreacion(reservaData)

    const cliente_id = await resolverClienteId(reservaData, user)
    const { barbero_id, servicio_id, fecha, hora_inicio, metodo_pago_id } = reservaData

    const turno = await validarTurnoDisponible({
        barberoId: barbero_id,
        servicioId: servicio_id,
        fecha,
        horaInicio: hora_inicio
    })

    const estado = await obtenerEstadoPorNombre("PENDIENTE")

    return reservasRepository.crearReserva({
        cliente_id,
        barbero_id,
        servicio_id,
        fecha,
        hora_inicio: turno.hora_inicio,
        hora_fin: turno.hora_fin,
        estado_id: estado.id,
        metodo_pago_id: metodo_pago_id || null
    })
}

export const actualizarReservaExistente = async (id, reservaData, user) => {
    reservasValidator.validarDatosActualizacion(reservaData)

    const reservaExistente = await reservasRepository.obtenerReservaPorId(id)
    reservasValidator.validarExistenciaReserva(reservaExistente)
    await assertPuedeGestionarReserva(reservaExistente, user)

    if (rolDe(user) === "CLIENTE" && reservaData.cliente_id && reservaData.cliente_id !== reservaExistente.cliente_id) {
        throw new AppError("No puedes cambiar el cliente de la reserva", 403)
    }

    const actualizaciones = { ...reservaData }

    if (reservaData.barbero_id || reservaData.servicio_id || reservaData.fecha || reservaData.hora_inicio) {
        const turno = await validarTurnoDisponible({
            barberoId: reservaData.barbero_id || reservaExistente.barbero_id,
            servicioId: reservaData.servicio_id || reservaExistente.servicio_id,
            fecha: reservaData.fecha || reservaExistente.fecha,
            horaInicio: reservaData.hora_inicio || reservaExistente.hora_inicio,
            excluirId: id
        })

        actualizaciones.hora_inicio = turno.hora_inicio
        actualizaciones.hora_fin = turno.hora_fin
    }

    return reservasRepository.actualizarReserva(id, {
        ...actualizaciones,
        actualizado_en: new Date().toISOString()
    })
}

export const eliminarReservaExistente = async (id, user) => {
    const reserva = await reservasRepository.obtenerReservaPorId(id)
    reservasValidator.validarExistenciaReserva(reserva)
    await assertPuedeGestionarReserva(reserva, user)

    await reservasRepository.eliminarReserva(id)

    return { mensaje: "Reserva eliminada correctamente" }
}
