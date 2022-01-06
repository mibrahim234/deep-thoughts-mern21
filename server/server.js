const express = require('express');
const {ApolloServer} = require('apollo-server-express');
// import ApolloServer
const path = require('path');

// import our typeDefs and resolvers
const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

  // create a new Apollo server and pass in our schema data
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
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

// set these up later when deployed to heroku 
// Serve up static assets
// come into effect when we go into production
if (process.env.NODE_ENV === 'production') {
  // check is node environment is in production
  app.use(express.static(path.join(__dirname, '../client/build')));
  // If it is, we instruct the Express.js server to serve any files in the React application's build directory in the client folder.
}

// if we make a GET request to any location on the server that doesn't have an explicit route defined, respond with the production-ready React front-end code
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// we run our server, we listen for that connection to be made with db.open(). 
// Upon a successful connection, we start the server.
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
