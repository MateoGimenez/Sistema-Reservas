import {getAllUsers , CreateUser , EditUser , DeleteUser}from "../services/userServices.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();

    return res.json(users);
  } catch (error) {
    next(error);
  }
};

export const NewUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const createdUser = await CreateUser(userData);

    return res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
};

export const EditUserId = async (req, res, next) => {
  try{
    const userId = Number(req.params.id);
    const userData = req.body
    const UserData = await EditUser(userId, userData)
    return res.json(UserData)
  } catch (error) {
    next(error)
  }
}

export const DeleteUserId = async (req , res , next) =>{
  try{
    const userId = Number(req.params.id);

    const UserResult = await DeleteUser(userId)

    return res.json(UserResult)

  }catch (error) {
    next(error)
  }
}