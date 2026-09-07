import { getAllReservas } from "../services/reservaServices.js"

export const getReservas = async (req, res, next) => {
  try {
    const Reservas = await getAllReservas();

    return res.json(Reservas);
  } catch (error) {
    next(error);
  }
};