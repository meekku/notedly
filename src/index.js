// index.js is the main entry point of our application
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
//1.Tuodaan riippuvaisuudet
const express = require('express');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const { connections } = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');

//Tuodaan lokaalit moduulit
const db = require('./db');
const models = require('./models/');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// 2.Luetaan ympäristömuuttujat
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;
 
//3. Luodaan expressin app-olio
const app = express();

db.connect(DB_HOST);

// turvallisuutta parantamaan:
app.use(helmet());
app.use(cors());

const getUser = token => {
    if (token) {
        try {
            // return the user information from the token
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            throw new Error('Session invalid');
        }
    }
};

async function startApolloServer(typeDefs, resolvers) {
    //5. Luodaan uusi apollo serveri
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        validationRules: [depthLimit(5), createComplexityLimitRule(1000)], 
        context: ({ req }) => {
        //get the user token from the headers
        const token = req.headers.authorization;
        //try to retrieve a user with the token
        const user = getUser(token);
        //for now, let's log the user to the console:
        console.log(user);
        //add the db models and the user to the context
        return { models, user }
    }});
    //6. Käynnistetään se
    await server.start();
    //7. Asetetaan GraphQL server middlewareksi, eli matkalla tuotavaksi ohjelma pariksi
    // ja asetetaan graphQL endpointin loppuosaksi /api
    server.applyMiddleware({ app, path: '/api' });

    return server;
}

startApolloServer(typeDefs, resolvers) 
//8. Aletaan kuunnella asiakkaiden pyyntöjä portista
// joka on annettu muuttujassa port
app.listen({ port }, () => {
    console.log(
        `GraphQL Server running at http://localhost:${port}`
    )
});

