import express from "express"
import cors from "cors"
import "dotenv/config.js"
import LoginRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { errorHandler } from "./middlewares/errorMiddleware.js"

const PORT = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", LoginRoutes)
app.use("/api/admin", userRoutes)

app.use(errorHandler)

app.listen(PORT , () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})