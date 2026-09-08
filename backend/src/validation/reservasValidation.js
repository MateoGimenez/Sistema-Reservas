import AppError from "../errors/AppError.js"

export const validarDatosCreacion = (reservaData) => {
    const { cliente_id, barbero_id, servicio_id, fecha, hora_inicio } = reservaData

    if (!cliente_id || !barbero_id || !servicio_id || !fecha || !hora_inicio) {
        throw new AppError("Faltan campos requeridos", 400)
    }

    // Validar que la fecha sea en el futuro
    const fechaReserva = new Date(fecha)
    const hoy = new Date()
    if (fechaReserva < hoy) {
        throw new AppError("La fecha debe ser en el futuro", 400)
    }
}

export const validarDatosActualizacion = (reservaData) => {
    // Las validaciones serán más flexibles aquí
    const camposValidos = ["cliente_id", "barbero_id", "servicio_id", "fecha", "hora_inicio", "estado_id", "metodo_pago_id"]
    
    Object.keys(reservaData).forEach(campo => {
        if (!camposValidos.includes(campo)) {
            throw new AppError(`Campo no válido: ${campo}`, 400)
        }
    })
}

export const validarExistenciaReserva = (reserva) => {
    if (!reserva) {
        throw new AppError("Reserva no encontrada", 404)
    }
}