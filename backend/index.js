import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import 'morgan'
import morgan from 'morgan';
import Apiroutes from './routes/api.js'

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB connection setup using Mongoose
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
 
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Allow requests from this frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // List of allowed methods
  credentials: true,  // Allow cookies if needed
  allowedHeaders: ['Content-Type', 'Authorization']  // Allow specific headers
}));
app.use(express.json());
app.use(morgan("dev"))
app.use('/api/v1',Apiroutes)

app.get('/', (req, res) => {
  res.send('Hello, world!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
