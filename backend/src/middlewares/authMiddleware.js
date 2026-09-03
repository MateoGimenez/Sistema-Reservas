import AppError from "../errors/AppError.js";
import jwt from "jsonwebtoken";
export const authorizeToken = (req , res , next) =>{

    const authHeader = req.headers.authorization;

   if(!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("No autorizado", 401));
   }

   const token = authHeader.split(" ")[1];

   try{
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    req.user = {
        id: decoded.id,
        role: decoded.rol
    }
    next();
   }catch(err){
    next(new AppError("Token invalido", 401))
   }
    
}

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("No autenticado", 401));
    }

    const userRole = req.user.role?.trim().toUpperCase();

    const allowedRoles = roles.map((role) =>
      role.trim().toUpperCase()
    );

    console.log("Rol del usuario:", userRole);

    if (!allowedRoles.includes(userRole)) {
      return next(new AppError("Sin permisos necesarios", 403));
    }

    next();
  };
};