import Router from "express"
import { getBarbers , NewBarber} from "../controllers/barbersControllers.js"
import { authorizeRoles, authorizeToken } from "../middlewares/authMiddleware.js";  

const router = Router();

router.get("/barberos" ,authorizeToken , authorizeRoles("admin"), getBarbers)

router.post("/barberos" , authorizeToken, authorizeRoles("admin"), NewBarber)