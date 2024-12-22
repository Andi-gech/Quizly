require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const authRoutes = require('./routes/authRoutes');

const quizRoutes = require('./routes/quizRoutes');
const errorHandler = require('./utils/errorHandler');
const connectDB = require('./utils/db');



const app = express();
connectDB();

app.use(express.json());
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Quiz API',
        version: '1.0.0',
        description: 'API documentation for the Quiz application',
      },
      
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ]
    },
    apis: ['./routes/*.js'], // Path to the API routes
  };
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);

app.use('/api/quizzes', quizRoutes);


app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
