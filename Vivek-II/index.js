const express = require("express");
const app = express();

app.use(express.json());

let users = [];

app.post("/users", (req, res) => {
  users.push(req.body);
  res.json({ message: "User added", users });
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  res.json(user);
});

app.put("/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);
  users[index] = req.body;
  res.json({ message: "User updated", users });
});

app.delete("/users/:id", (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.json({ message: "User deleted", users });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
