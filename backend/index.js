const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 5000;

const AuthRouter = require('./routers/auth_router');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());


app.use('/',AuthRouter);

// DB connect
mongoose.connect("mongodb://localhost:27017/Scholarship_Finder")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Start server
app.listen(PORT, () => console.log(`Server Connected To Port: ${PORT}`));
