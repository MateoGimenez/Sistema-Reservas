import { ValidationAuth, ValidationRegister } from "../services/authServices.js";

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: "Email y contraseña son requeridos"
            });
        }

        const authData = await ValidationAuth(email, password);
        return res.json(authData);
    } catch (error) {
        next(error);
    }
};

export const register = async (req, res, next) => {
    try {
        const usuario = await ValidationRegister(req.body);
        return res.status(201).json(usuario);
    } catch (error) {
        next(error);
    }
};
