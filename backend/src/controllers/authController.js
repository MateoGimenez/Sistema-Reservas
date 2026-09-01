import ValidationAuth from "../services/authServices.js";

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const authData = await ValidationAuth(email, password);

        return res.json(authData);

    } catch (error) {

        console.log(error);

        if (error.message === "Credenciales Incorrectas") {
            return res.status(401).json({
                message: "Credenciales Incorrectas"
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};