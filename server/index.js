///////////////////////////////
// Imports
///////////////////////////////

require("dotenv").config();
const path = require("path");
const express = require("express");

// middleware imports
const handleCookieSessions = require("./middleware/handleCookieSessions");
const checkAuthentication = require("./middleware/checkAuthentication");
const logRoutes = require("./middleware/logRoutes");
const logErrors = require("./middleware/logErrors");
const geocodeEvent = require("./middleware/geocodeEvent");

// controller imports
const authControllers = require("./controllers/authControllers");
const userControllers = require("./controllers/userControllers");
const postControllers = require("./controllers/postControllers");
const commentControllers = require("./controllers/commentControllers");
const upvoteControllers = require("./controllers/upvoteControllers");

// create express app
const app = express();

// middleware
app.use(handleCookieSessions); // adds a session property to each request representing the cookie
app.use(logRoutes); // print information about each incoming request
app.use(express.json()); // parse incoming request bodies as JSON
app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Serve static assets from the dist folder of the frontend

///////////////////////////////
// Post Routes
///////////////////////////////

app.get("/api/posts", postControllers.listPosts);
app.post("/api/posts", checkAuthentication, geocodeEvent, postControllers.createPost);
app.patch("/api/posts/:id", checkAuthentication, postControllers.updatePost);
app.delete("/api/posts/:id", checkAuthentication, postControllers.deletePost);

///////////////////////////////
// Auth Routes
///////////////////////////////

app.post("/api/auth/register", authControllers.registerUser);
app.post("/api/auth/login", authControllers.loginUser);
app.get("/api/auth/me", authControllers.showMe);
app.get("/api/auth/check-username/:username", authControllers.checkUsernameAvailability);
app.delete("/api/auth/logout", authControllers.logoutUser);

///////////////////////////////
// User Routes
///////////////////////////////

// These actions require users to be logged in (authentication)
// Express lets us pass a piece of middleware to run for a specific endpoint
app.get("/api/users", checkAuthentication, userControllers.listUsers);
app.get("/api/users/:id", userControllers.showUser);
app.patch("/api/users/:id", checkAuthentication, userControllers.updateUser);

///////////////////////////////
// Comment Routes
///////////////////////////////

app.post("/api/comments", commentControllers.createComment);
app.get("/api/events/:eventId/comments", commentControllers.getCommentsByEvent);
app.delete("/api/comments/:id", checkAuthentication ,commentControllers.deleteComment);

///////////////////////////////
// Upvote Routes
///////////////////////////////

app.post("/api/events/:eventId/upvote", checkAuthentication, upvoteControllers.upvoteEvent);
app.delete("/api/events/:eventId/upvote", checkAuthentication, upvoteControllers.removeUpvote);
app.get("/api/events/:eventId/upvotes", upvoteControllers.getUpvotesForEvent);
app.get("/api/upvotes/users/:id", checkAuthentication, upvoteControllers.getUpvotesByUser);

///////////////////////////////
// Fallback Routes
///////////////////////////////

// Requests meant for the API will be sent along to the router.
// For all other requests, send back the index.html file in the dist folder.
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.use(logErrors);

///////////////////////////////
// Start Listening
///////////////////////////////

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
