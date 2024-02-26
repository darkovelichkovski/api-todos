const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const jwt = require("jsonwebtoken");
const todosRoute = require("./routes/todos");
const authRoute = require("./routes/auth");
const secretKey = "your-secret-key";

const app = express();
const PORT = 3001;

// Serve Swagger UI
const swaggerDocument = YAML.load("swagger.yaml"); // Replace with the path to your Swagger file
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/requirements", express.static("requirements.html"));

// Middleware to parse JSON in the request body
app.use(bodyParser.json());
// Use route files

app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (req.path === "/auth/login") {
    return next();
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({ error: "Forbidden - Invalid token" });
  }
});

app.use("/auth", authRoute);
app.use("/api/v1", todosRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
