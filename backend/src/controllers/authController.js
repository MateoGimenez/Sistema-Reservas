import {ValidationAuth , ValidationRegister} from "../services/authServices.js";

export const login = async (req, res) => {

    const { email, password } = req.body;

    const authData = await ValidationAuth(email, password);

    return res.json(authData);
};

export const register = async (req , res) =>{

    const usuario = await ValidationRegister(req.body)

    return res.json(usuario)
}