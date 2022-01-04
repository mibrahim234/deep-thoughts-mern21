const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const path = require('path');


// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();


const startServer = async () => {
  // create a new Apollo server and pass in our schema data
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: authMiddleware
    //This ensures that every request performs an authentication check, and the updated request object will be passed to the resolvers as the context
  });

  // Start the Apollo server
  await server.start();

  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};
 //^^ log where we can go to test our GQL API
  

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// we run our server, we listen for that connection to be made with db.open(). 
// Upon a successful connection, we start the server.
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
