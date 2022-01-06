import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// BrowserRouter and Route are components that the React Router library provides. 
// We renamed BrowserRouter to Router to make it easier to work with.
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

//r etrieve the token from localStorage and include it with each request to the API
import { setContext } from '@apollo/client/link/context';
// With this function, setContext, we can create essentially a middleware function that will retrieve the token for us and combine it with the existing httpLink


import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';




const httpLink = createHttpLink({
  // establish a new link to the graphql server
  // URI stands for "Uniform Resource Identifier."
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
// With authLink, we use the setContext() function to retrieve the token from localStorage and set the HTTP request headers of every request to include the token, whether the request needs it or not.
// if request doesn't need it, server-side won't look for it

const client = new ApolloClient({
  // combine the authLink and httpLink objects so that every request retrieves the token and sets the request headers before making the request to the API
  link: authLink.concat(httpLink),
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