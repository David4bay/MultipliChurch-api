const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Multipli Church API",
            description: "Multi-Tenant Church API",
            contact: {
                name: "David Bayode"
            }
        },
        servers: [{
            url: "http://localhost:3000/"
        }]
    },
    components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
    apis: ["./app.js"]
}

module.exports = swaggerOptions