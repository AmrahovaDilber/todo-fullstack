const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const todoRoutes = require('./routes/todoRoutes');
const swaggerDocument = require('./config/swagger');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/todos', todoRoutes);

module.exports = app;