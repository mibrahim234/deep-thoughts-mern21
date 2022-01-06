import React from 'react';
import {
  ApolloClient,
 // is a constructor function that will help initialize the connection to the GraphQL API server.
  InMemoryCache,
  // enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
  ApolloProvider,
  // is a special type of React component that we'll use to provide data to all of the other components.
  createHttpLink,
 // allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.
} from '@apollo/client';

import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// BrowserRouter and Route are components that the React Router library provides. 
// We renamed BrowserRouter to Router to make it easier to work with.


import Home from './pages/Home';

const httpLink = createHttpLink({
  // establish a new link to the graphql server
  // URI stands for "Uniform Resource Identifier."
  uri: '/graphql',
});

const client = new ApolloClient({
  //instantiate the Apollo Client instance and create the connection to the API endpoint
  link: httpLink,
  cache: new InMemoryCache(),
  //instantiate a new cache object using newmemorycache
});

// Because we're passing the client variable in as the value for the client prop in the provider, 
// everything between the JSX tags will eventually have access to the server's API data through the client we set up.
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/signup" component={Signup} />
    <Route exact path="/profile/:username?" component={Profile} />
   <Route exact path="/thought/:id" component={SingleThought} />


    <Route component={NoMatch} />
  </Switch>
</div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
