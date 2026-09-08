import AppError from "../errors/AppError.js";
export const ValidationUser = (req, res, next) => {
    const { nombre, apellido, email, password, telefono, rol_id } = req.body;

    if (
        typeof nombre !== "string" || !nombre.trim() ||
        typeof apellido !== "string" || !apellido.trim() ||
        typeof email !== "string" || !email.trim() ||
        typeof password !== "string" || !password ||
        rol_id === undefined
    ) {
        return next(new AppError("Nombre, apellido, email, contraseña y rol son requeridos", 400));
    }

    if (!Number.isInteger(rol_id) || rol_id <= 0) {
        return next(new AppError("El campo 'rol_id' debe ser un número entero positivo", 400));
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return next(new AppError("El campo 'email' debe ser un correo electrónico válido", 400));
    }

    if (password.length < 8) {
        return next(new AppError("La contraseña debe tener al menos 8 caracteres", 400));
    }

    if (telefono !== undefined && telefono !== null && typeof telefono !== "string") {
        return next(new AppError("El campo 'telefono' debe ser texto", 400));
    }

    next();
};

export const ValidationRegister = (req, res, next) => {
    const { nombre, apellido, email, password, telefono } = req.body;

    if (
        typeof nombre !== "string" || !nombre.trim() ||
        typeof apellido !== "string" || !apellido.trim() ||
        typeof email !== "string" || !email.trim() ||
        typeof password !== "string" || !password
    ) {
        return next(new AppError("Nombre, apellido, email y contraseña son requeridos", 400));
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
        return next(new AppError("El campo 'email' debe ser un correo electrónico válido", 400));
    }

    if (password.length < 8) {
        return next(new AppError("La contraseña debe tener al menos 8 caracteres", 400));
    }

    if (telefono !== undefined && telefono !== null && typeof telefono !== "string") {
        return next(new AppError("El campo 'telefono' debe ser texto", 400));
    }

    next();
};
