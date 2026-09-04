import {getAllUsers , CreateUser }from "../services/userServices.js";

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