import swaggerJsdoc from 'swagger-jsdoc' 

  export const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'User & Post API',
        version: '1.0.0',
        description: 'REST API для управления пользователями и постами',
      },
      servers: [{ url: 'http://localhost:3000' }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/routes/*.ts'],
  }

  export const swaggerSpec = swaggerJsdoc(swaggerOptions)