import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'

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
        url: '/api'
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
  apis: [path.join(__dirname, '../routes/*.ts'), path.join(__dirname, '../routes/*.js')]
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
