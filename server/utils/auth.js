const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
      // function for our authenticated routes
  authMiddleware: function({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token
        .split(' ')
        .pop()
        .trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },
  signToken: function({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
};

// The signToken() function expects a user object and will add that user's username, email, and _id properties to the token. 
// Optionally, tokens can be given an expiration date and a secret to sign the token with. 
//Note that the secret has nothing to do with encoding. 
//The secret merely enables the server to verify whether it recognizes this token.

// This is where the secret becomes important. If the secret on jwt.verify() doesn't match the secret that was used with jwt.sign(), the object won't be decoded. When the JWT verification fails, an error is thrown.