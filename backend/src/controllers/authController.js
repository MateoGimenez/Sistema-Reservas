import ValidationAuth, { RegisterUser } from "../services/authServices.js";

export const login = async (req, res) => {

    const { email, password } = req.body;

    const authData = await ValidationAuth(email, password);

    return res.json(authData);
};

export const register = async (req, res) => {
    const authData = await RegisterUser(req.body);

    return res.status(201).json(authData);
};