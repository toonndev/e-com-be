import swaggerJsdoc from 'swagger-jsdoc'

const PORT = process.env.PORT || 5001

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Com API',
      version: '1.0.0',
      description: 'E-commerce backend API documentation'
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
