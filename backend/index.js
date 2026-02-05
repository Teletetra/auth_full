import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import mongoSanitize from 'express-mongo-sanitize'
import routes from "./Routes/validRoute.js"
dotenv.config({ path: "./config/.env" });


connectDB()

const app= express()
const PORT=process.env.PORT ||5000

app.use(cors());
app.use(express.json())
// app.use(
//   mongoSanitize({
//     sanitizeQuery: false
//   })
// );


app.get('/status',(req,res)=>{
  res.json({message:'server is running'})
})



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});


app.use("/",routes)
app.listen(PORT,()=>{
  console.log(`server is running at http://localhost:${PORT}`)
})

