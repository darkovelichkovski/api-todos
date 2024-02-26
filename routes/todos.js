const express = require("express");
const router = express.Router();

// Sample data (simulating a database)
let todos = {
  data: {
    results: [
      { id: 1, title: "Learn Postman", completed: false },
      { id: 2, title: "Build API", completed: true },
    ],
  },
};

// GET all todos
router.get("/todos", (req, res) => {
  res.json(todos);
});

// GET a specific todo by ID
router.get("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = todos.data.results.find((t) => t.id === todoId);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.json(todo);
});

// POST create a new todo
router.post("/todos", (req, res) => {
  const { title, completed } = req.body;

  // Check if title and completed are provided
  if (!title) {
    return res.status(400).json({ error: "title is a required field" });
  }

  if (typeof title !== "string") {
    return res.status(400).json({ error: "title should be a string" });
  }

  if (completed === undefined || completed === null) {
    return res.status(400).json({ error: "completed is a required field" });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "completed should be a boolean" });
  }

  const newTodo = {
    id: todos.data.results.length + 1,
    title,
    completed,
  };

  todos.data.results.push(newTodo);

  res.status(201).json(newTodo);
});

// PUT update a todo by ID
router.put("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const updatedTodo = req.body;

  // Check if title and completed are provided
  if (
    updatedTodo.title === undefined ||
    updatedTodo.title === null ||
    typeof updatedTodo.title !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "title is required and should be a string" });
  }

  if (updatedTodo.completed === undefined || updatedTodo.completed === null) {
    return res.status(400).json({ error: "completed is a required field" });
  }

  const booleanCompleted =
    typeof updatedTodo.completed === "string"
      ? updatedTodo.completed.toLowerCase() === "true"
      : updatedTodo.completed;

  if (typeof booleanCompleted !== "boolean") {
    return res.status(400).json({ error: "completed should be a boolean" });
  }

  todos.data.results = todos.data.results.map((t) =>
    t.id === todoId ? { ...t, ...updatedTodo, completed: booleanCompleted } : t
  );

  res.json({ message: "Todo updated successfully", updatedTodo });
});

// PATCH update the 'completed' status of a todo by ID
router.patch("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const patchData = req.body;

  // Check if 'completed' is provided
  if (patchData.completed === undefined || patchData.completed === null) {
    return res
      .status(400)
      .json({ error: "completed is required field for patch" });
  }

  const booleanCompleted =
    typeof patchData.completed === "string"
      ? patchData.completed.toLowerCase() === "true"
      : patchData.completed;

  if (typeof booleanCompleted !== "boolean") {
    return res.status(400).json({ error: "completed should be boolean" });
  }

  // Update only the 'completed' status of the todo with the specified ID
  todos.data.results = todos.data.results.map((t) =>
    t.id === todoId ? { ...t, completed: booleanCompleted } : t
  );

  res.json({
    message: "Todo updated successfully",
    updatedTodo: { id: todoId, completed: booleanCompleted },
  });
});

// DELETE a todo by ID
router.delete("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);

  // Check if the todo with the specified ID exists
  const deletedTodo = todos.data.results.find((t) => t.id === todoId);

  if (!deletedTodo) {
    return res
      .status(404)
      .json({ message: "Todo with id " + todoId + " doesn't exist!" });
  }

  // Remove the todo from the array
  todos.data.results = todos.data.results.filter((t) => t.id !== todoId);

  res.json({ message: "Todo deleted successfully", deletedTodo });
});

module.exports = router;
