import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/db.js'
import cookieparser from 'cookie-parser'
import voyagerRouter from './routes/voyagerRouter.js'
import adminRouter from './routes/adminRouter.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const allowedOrigins = process.env.ORIGIN?.split(',') || []

app.use(express.json())
app.use(cookieparser()) 
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.get("/", (req, res) => {
  res.send("backend is running")
})

app.use('/voyager', voyagerRouter)
app.use('/admin',adminRouter)

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`backend running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to database or starting server:', err);
  });

