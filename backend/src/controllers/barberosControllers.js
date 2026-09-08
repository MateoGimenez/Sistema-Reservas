import { getAllBarbers , CreateBarber , EditBarber , DeleteBarber } from "../services/barberosServices.js";

export const getBarbers = async (req, res, next) => {
  try {
    const barbers = await getAllBarbers();

    return res.json(barbers);
  } catch (error) {
    next(error);
  }
};

export const NewBarber = async (req, res, next) => {
  try {
    const barberData = req.body;
    const createdBarber = await CreateBarber(barberData);

    return res.status(201).json(createdBarber);
  } catch (error) {
    next(error);
  }
};

export const EditBarberId = async (req, res, next) => {
  try{
    const barberId = Number(req.params.id);
    const barberData = req.body
    const BarberData = await EditBarber(barberId, barberData)
    return res.json(BarberData)
  } catch (error) {
    next(error)
  }
}

export const DeleteBarberId = async (req , res , next) =>{
  try{
    const barberId = Number(req.params.id);

    const BarberResult = await DeleteBarber(barberId)

    return res.json(BarberResult)

  }catch (error) {
    next(error)
  }
}