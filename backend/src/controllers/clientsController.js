import { CreateClient, getAllClients, getClientById, EditClient, DeleteClient } from '../controllers/clientsController.js';
export const getClients = async (req, res, next) => {
  try {
    const clients = await getAllClients();

    return res.json(clients);
  } catch (error) {
    next(error);
  }
};

export const NewClient = async (req, res, next) => {
  try {
    const clientData = req.body;
    const createdClient = await CreateClient(clientData);

    return res.status(201).json(createdClient);
  } catch (error) {
    next(error);
  }
};

export const EditClientId = async (req, res, next) => {
  try{
    const clientId = Number(req.params.id);
    const clientData = req.body
    const ClientData = await EditClient(clientId, clientData)
    return res.json(ClientData)
  } catch (error) {
    next(error)
  }
}

export const DeleteClientId = async (req , res , next) =>{
  try{
    const clientId = Number(req.params.id);

    const ClientResult = await DeleteClient(clientId)

    return res.json(ClientResult)

  }catch (error) {
    next(error)
  }
}