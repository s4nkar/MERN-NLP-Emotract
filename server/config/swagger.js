// /config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Emotract-beta',
      version: '1.0.0',
      description: 'A simple Express API for chatting',
    },
  },
  apis: ['./routes/v1/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('API documentation available at /api-docs');
};

export default swaggerDocs; 
