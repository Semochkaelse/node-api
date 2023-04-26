require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')

const { PORT, MONGO_LINK } = process.env;

const indexRouter = require('./routes/index')
const errorMiddleware = require('./middlewares/error-middleware')

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true
}

app.use(cookieParser());
app.use(cors(corsOptions))
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/api', indexRouter)

app.use(errorMiddleware);

async function start() {
  try {
    await mongoose.connect(MONGO_LINK, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    app.listen(PORT, () => console.log(`Server is up. http://localhost:${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

start();