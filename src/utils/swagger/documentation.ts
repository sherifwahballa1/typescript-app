import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export default class SwaggerDoc {

  readonly swaggerDefinition: any = {
    openapi: '3.0.0',
    info: {
      title: 'Express API',
      version: '1.0.0',
      description:
          'This is a REST API application made with Express.',
    },
    servers: [
      {
        url: 'http://localhost',
        description: 'Local server',
      }
    ],
    components: {
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
        },
        badRequest: {
          description: "Bad request",
        },
        serverError: {
          description: "Internal Server Error",
        }
      },
      parameters: {
        authorization: {
          in: "header",
          name: "Authorization",
          schema: {
            type: "string"
          },
          required: true,
          description: "Unique Token"
        },
        page: {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            minimum: 1
          },
          description: "The number of page we want to access. First page is 1"
        },
        limit: {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            minimum: 10,
            maximum: 100
          },
          description: "The size of the collection returned, minimum size 10 and maximum 100"
        }
      }
    }
  };

  constructor() {
  }

  getSwaggerDefinition() {
    return this.swaggerDefinition
  }

  static getSwaggerDocOptions(): any {
    const swagger : SwaggerDoc = new SwaggerDoc();

    const options: any = {
      swaggerDefinition: swagger.getSwaggerDefinition(),
      apis: ["./src/routes/*.ts"]
    };
    return swaggerJSDoc(options);
  }

  static getSwaggerSetup(): any {

    const customCSV = {
      customCss: '.swagger-ui .topbar { display: none }'
    };

    return swaggerUi.setup(this.getSwaggerDocOptions(), customCSV);
  }

}