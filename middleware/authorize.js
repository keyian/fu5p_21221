const jwt = require("jsonwebtoken");
require("dotenv").config();

//this middleware will on continue on if the token is inside the local storage

module.exports = function(req, res, next) {
  // Get token from header
  console.log('are we getting any header?', req.header("jwt_token"));
  const token = req.header("jwt_token");
  console.log("token in authorize",token);

  // Check if not token
  if (!token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  // Verify token
  try {
    console.log("trying authorize...");
    //it is going to give use the user id (user:{id: user.id})
    const verify = jwt.verify(token, process.env.jwtSecret);

    req.user = verify.user;
    next();
  } catch (err) {
    console.log("There was an error in authorize...", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};