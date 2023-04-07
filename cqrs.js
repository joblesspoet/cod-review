// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const app = express();

// Middleware
app.use(bodyParser.json());

// Command handler
const handleCommand = (command) => {
  console.log(`Handling command: ${JSON.stringify(command)}`);
  switch (command.type) {
    case "createTodo":
      const todo = {
        id: uuidv4(),
        text: command.text,
        completed: false,
      };
      todos.push(todo);
      return { todo };
    case "updateTodo":
      const index = todos.findIndex((t) => t.id === command.id);
      if (index < 0) throw new Error(`Todo not found: ${command.id}`);
      const updatedTodo = { ...todos[index], ...command.changes };
      todos[index] = updatedTodo;
      return { todo: updatedTodo };
    case "deleteTodo":
      const deletedTodo = todos.find((t) => t.id === command.id);
      if (!deletedTodo) throw new Error(`Todo not found: ${command.id}`);
      todos = todos.filter((t) => t.id !== command.id);
      return { todo: deletedTodo };
    default:
      throw new Error(`Unknown command type: ${command.type}`);
  }
};

// Query handler
const handleQuery = (query) => {
  console.log(`Handling query: ${JSON.stringify(query)}`);
  switch (query.type) {
    case "getTodos":
      return todos.filter((t) => !t.completed);
    case "getCompletedTodos":
      return todos.filter((t) => t.completed);
    case "getTodoById":
      const todo = todos.find((t) => t.id === query.id);
      if (!todo) throw new Error(`Todo not found: ${query.id}`);
      return todo;
    default:
      throw new Error(`Unknown query type: ${query.type}`);
  }
};

// Routes
app.post("/commands", (req, res) => {
  try {
    const result = handleCommand(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/queries", (req, res) => {
  try {
    const result = handleQuery(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
