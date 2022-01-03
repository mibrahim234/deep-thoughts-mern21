// simple object called resolvers with a query nested object that holds a series of methods 
// These methods get the same name of the query or mutation they are resolvers for.
const { User, Thought } = require('../models');

// Here, we pass in the parent as more of a placeholder parameter. It won't be used, but we need something in that first parameter's spot so we can access the username argument from the second parameter. 
// We use a ternary operator to check if username exists. /// If it does, we set params to an object with a username key set to that value. 
// If it doesn't, we simply return an empty object.

// We then pass that object, with or without any data in it, to our .find() method. 
//If there's data, it'll perform a lookup by a specific username. 
// If there's not, it'll simply return every thought. Let's test this out.
const resolvers = {
    Query: {
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
          },
          thought: async (parent, { _id }) => {
            return Thought.findOne({ _id });
          },
          // get all users
users: async () => {
    return User.find()
      .select('-__v -password')
      .populate('friends')
      .populate('thoughts');
  },
  // get a user by username
  user: async (parent, { username }) => {
    return User.findOne({ username })
      .select('-__v -password')
      .populate('friends')
      .populate('thoughts');
  },
    }
  };
  
  module.exports = resolvers;