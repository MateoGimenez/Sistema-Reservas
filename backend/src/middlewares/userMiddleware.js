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

export const ValidationUserUpdate = (req, res, next) => {
    const { nombre, apellido, email, password, telefono, rol_id, activo } = req.body;

    const tieneCampos = [nombre, apellido, email, password, telefono, rol_id, activo]
        .some((campo) => campo !== undefined);

    if (!tieneCampos) {
        return next(new AppError("No hay campos para actualizar", 400));
    }

    if (email !== undefined && !/^\S+@\S+\.\S+$/.test(email)) {
        return next(new AppError("El campo 'email' debe ser un correo electrónico válido", 400));
    }

    if (password !== undefined && password !== null && password !== "" && password.length < 8) {
        return next(new AppError("La contraseña debe tener al menos 8 caracteres", 400));
    }

    if (rol_id !== undefined && (!Number.isInteger(rol_id) || rol_id <= 0)) {
        return next(new AppError("El campo 'rol_id' debe ser un número entero positivo", 400));
    }

    if (telefono !== undefined && telefono !== null && typeof telefono !== "string") {
        return next(new AppError("El campo 'telefono' debe ser texto", 400));
    }

    next();
};
