const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Get the token from the string (Bearer <token>)
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify the token using your JWT_SECRET from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // 4. Find the user in DB and attach to the request object (excluding password)
      req.user = await User.findById(decoded.id).select("-password");
      next(); // Move to the next function (the controller)
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};

module.exports = { protect };


// When you click "Join Now" in your app, the request travels to the backend. Before it ever reaches your updateJoinedGroups function, it has to pass through the protect middleware.
// Here is the "Security Guard" Checklist:
// Identification Check: The guard looks at the request header for the JWT Token (the "ID card" you got when you logged in).
// Verification: The guard checks if the ID card is real (not faked) and hasn't expired using your JWT_SECRET.
// Background Check: The guard takes the ID from the card, goes to the database, finds your user profile, and says, "Okay, I know exactly who Briha is now."
// The "Next" Command: If everything is perfect, the guard calls next(). This is the signal to let the request move forward into the VIP Room (your Controller) to actually save the data.