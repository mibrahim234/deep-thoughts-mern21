// Before we can create any resolvers, we need to first create the type definition

// import the gql tagged template function
// {} are tagged templates--new form of template literal ES6
//  With tagged template functions like this, it's typically from a library that provides explicit details on how it's used in that situation, so we don't have to know too much about it for this application.
const { gql } = require('apollo-server-express');

// create our typeDefs
// All of our type definitions will go into the typeDefs tagged template function.
// To define a query, you use the type Query {}
// All type definitions need to specify what type of data is expected in return, no matter what
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addThought(thoughtText: String!): Thought
    addReaction(thoughtId: ID!, reactionBody: String!): Thought
    addFriend(friendId: ID!): User
  }
`;





// 4 queries defined 2 for thoughts, 2 for users
// the ! indicates that for that query to be carried out, that data must exist

// two mutations one for login, one for addUser
// Both will return a User object: either the user who successfully logged in or the user who was just created on sign-up.

// auth type must return a token and can optionally include any other data



// export the typeDefs
module.exports = typeDefs;