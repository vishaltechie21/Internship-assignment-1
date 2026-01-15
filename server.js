const express = require("express");
const app = express();

app.use(express.json());

let users = [
  { id: 1, name: "Abhishek", age: 22 }
];

// CREATE
app.post("/users", (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.send("User added");
});

// READ (all)
app.get("/users", (req, res) => {
  res.json(users);
});

// READ (by id)
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  res.json(user);
});

// UPDATE
app.put("/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);
  users[index] = req.body;
  res.send("User updated");
});

// DELETE
app.delete("/users/:id", (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.send("User deleted");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});