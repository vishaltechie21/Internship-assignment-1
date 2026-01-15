const express = require("express");
const app = express();

app.use(express.json());

let users = [];
let idCounter = 1;


app.get("/", (req, res) => {
  res.send("CRUD API is running");
});


app.get("/users", (req, res) => {
  res.json(users);
});


app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});


app.post("/users", (req, res) => {
  const { name, age } = req.body;
  const newUser = { id: idCounter++, name, age };
  users.push(newUser);
  res.json(newUser);
});


app.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name;
  user.age = req.body.age;
  res.json(user);
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.json({ message: "User deleted" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
