const User = require('../models/User');

exports.registerUser = async (req, res) => {
  // Request needs a body
  if (!req.body) {
    return res.status(400).send({ message: 'Username and password required' });
  }

  // Body needs a username and password
  const { username, password, email, first_name, last_name } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: 'Username and password required' });
  }

  // User.create will handle hashing the password and storing in the database
  const user = await User.create(username, password, { email, first_name, last_name });

  // Add the user id to the cookie and send the user data back
  req.session.userId = user.id;
  res.send(user);
};

exports.loginUser = async (req, res) => {
  console.log('Login attempt with body:', JSON.stringify(req.body, null, 2));
  console.log('Request headers:', req.headers);
  
  // Request needs a body
  if (!req.body) {
    console.log('No request body found');
    return res.status(400).send({ message: 'Username and password required' });
  }

  // Body needs a username and password
  const { username, password } = req.body;
  console.log('Extracted credentials:', { username, password: password ? '***' : 'missing' });
  
  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).send({ message: 'Username and password required' });
  }

  try {
    // Username must be valid
    console.log('Attempting to find user with username:', username);
    const user = await User.findByUsername(username);
    console.log('User lookup result:', user ? 'User found' : 'User not found');
    
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // Password must match
    const isPasswordValid = await user.isValidPassword(password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid credentials.' });
    }

    // Add the user id to the cookie and send the user data back
    req.session.userId = user.id;
    console.log('Login successful, setting session userId:', user.id);
    res.send(user);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ message: 'Internal server error during login' });
  }
};


exports.showMe = async (req, res) => {
  // no cookie with an id => Not authenticated.
  if (!req.session.userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  // cookie with an id => here's your user info!
  const user = await User.find(req.session.userId);
  res.send(user);
};

exports.logoutUser = (req, res) => {
  req.session = null; // "erase" the cookie
  res.status(204).send({ message: "User logged out." });
};