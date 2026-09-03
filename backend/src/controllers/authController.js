import ValidationAuth from "../services/authServices.js";

export const login = async (req, res) => {

    const { email, password } = req.body;

    const authData = await ValidationAuth(email, password);

    return res.json(authData);
};