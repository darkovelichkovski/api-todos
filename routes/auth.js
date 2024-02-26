const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const secretKey = "your-secret-key"; // Make sure this line is present

const emails = ["example@email.com"];

// Simple Authorization Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (password === undefined || email === undefined) {
    return res.status(400).json({ error: "You are doing something wrong" });
  }

  if (password.length < 6 || password.length > 10) {
    return res
      .status(401)
      .json({ error: "Password shoould be between 6 and 10 chars" });
  }

  if (typeof password != "string") {
    res.status(401).json({ error: "Password shoould be random string" });
  }

  if (!emails.includes(email)) {
    emails.push(email);
    const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });

    res.json({ token });
  } else {
    res.status(401).json({ error: "Email alredy register" });
  }
});

// Get all registered users
router.get("/users", (reg, res) => {
  res.json(emails);
});

// Middleware to verify token before processing requests
router.use((req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Forbidden - Invalid token" });
  }
});

module.exports = router;
