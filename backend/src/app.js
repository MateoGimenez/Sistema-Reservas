import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

app.listen(PORT , () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})