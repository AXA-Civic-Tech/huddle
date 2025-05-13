const axios = require("axios");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
  console.log("req.body:", req.body);

  // Destructure at the very start — BEFORE using any of the values
  const { username, password, email, first_name, last_name, recaptchaToken } = req.body;

  // Check for missing fields
  if (!username || !password) {
    return res.status(400).send({ message: 'Username and password required' });
  }

  if (!recaptchaToken) {
    return res.status(400).send({ message: 'Missing reCAPTCHA token' });
  }

  try {
    // Verify the reCAPTCHA token with Google's API
    const recaptchaRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    const success = recaptchaRes.data;

    if (!success) {
      return res.status(403).send({ message: 'Failed reCAPTCHA verification' });
    }

    // Create the user
    const user = await User.create(username, password, { email, first_name, last_name });

    // Set session cookie and return user
    req.session.userId = user.id;
    res.send(user);

  } catch (err) {
    console.error('Error during user registration:', err);
    res.status(500).send({ message: 'Error verifying reCAPTCHA or creating user' });
  }
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

exports.checkUsernameAvailability = async (req, res) => {
  const { username } = req.params;
  const user = await User.findByUsername(username);
  res.json({ available: !user });
};