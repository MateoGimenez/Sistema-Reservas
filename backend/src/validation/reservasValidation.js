import AppError from "../errors/AppError.js"
import { fechaEsPasada } from "../utils/timeUtills.js"

export const validarDatosCreacion = (reservaData) => {
    const { barbero_id, servicio_id, fecha, hora_inicio } = reservaData

    if (!barbero_id || !servicio_id || !fecha || !hora_inicio) {
        throw new AppError("Faltan campos requeridos", 400)
    }

    if (fechaEsPasada(fecha)) {
        throw new AppError("La fecha no puede ser anterior a hoy", 400)
    }
}

export const validarDatosActualizacion = (reservaData) => {
    const camposValidos = ["cliente_id", "barbero_id", "servicio_id", "fecha", "hora_inicio", "estado_id", "metodo_pago_id"]

    Object.keys(reservaData).forEach((campo) => {
        if (!camposValidos.includes(campo)) {
            throw new AppError(`Campo no válido: ${campo}`, 400)
        }
    })

    if (reservaData.fecha && fechaEsPasada(reservaData.fecha)) {
        throw new AppError("La fecha no puede ser anterior a hoy", 400)
    }
}

export const validarExistenciaReserva = (reserva) => {
    if (!reserva) {
        throw new AppError("Reserva no encontrada", 404)
    }
}
