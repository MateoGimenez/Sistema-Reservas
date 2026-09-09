import * as reservasService from "../services/reservaServices.js"

export const getAllReservas = async (req, res, next) => {
    try {
        const data = await reservasService.obtenerTodasLasReservas()
        res.json(data)
    } catch (error) {
        next(error)
    }
}

export const createReserva = async (req, res, next) => {
    try {
        const nuevaReserva = await reservasService.crearNuevaReserva(req.body, req.user)
        res.status(201).json(nuevaReserva)
    } catch (error) {
        next(error)
    }
}

export const updateReserva = async (req, res, next) => {
    try {
        const reservaActualizada = await reservasService.actualizarReservaExistente(req.params.id, req.body, req.user)
        res.json(reservaActualizada)
    } catch (error) {
        next(error)
    }
}

export const deleteReserva = async (req, res, next) => {
    try {
        const resultado = await reservasService.eliminarReservaExistente(req.params.id, req.user)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}
