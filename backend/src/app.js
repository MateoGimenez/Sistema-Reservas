import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import LoginRoutes from "./routes/authRoutes.js"
import { errorHandler } from "./middlewares/errorMiddleware.js"

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", LoginRoutes)

app.use(errorHandler)

app.listen(PORT , () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})