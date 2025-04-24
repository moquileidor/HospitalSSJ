import express from 'express';
import cors from 'cors';

//esto era lo que faltaba
import dotenv from 'dotenv';

//esto tambien faltaba
dotenv.config()


const app = express()

app.use(cors())
app.use(express.json())

app.listen(process.env.PORT, () => {
    console.log(`Conectados al puerto: ${process.env.PORT}`)
    
})
