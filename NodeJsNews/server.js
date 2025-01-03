require('dotenv').config()

const express = require('express');
const app = express()
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))


app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
  }));
  

const newsRouter = require('./routes/noticias')
app.use('/news', newsRouter)


app.listen(3000, () => console.log('Server is running on port 3000'))

// Documentation
const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Para ejecutar el servidor, ejecuta el siguiente comando en la terminal: npm run devStart