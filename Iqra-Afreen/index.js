const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const Port = 3000;

const dataFilePath = path.join(__dirname, "data.json");

//function to read data.json
function readData() {
    const rawData = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(rawData);
}

//function to write data in data.json
function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}


app.use(express.json());

//To get all users
app.get("/users", (req, res) => {
    const data = readData();
    res.json(data.users);
})

//To get user by ID
app.get("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const data = readData();
    const user = data.users.find((u) => u.id === userId);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: "User not found" });
    }
})

//create a new user
app.post("/users", (req, res) => {
    const { name, age } = req.body;

    if (!name || !age) {
        return res.status(400).json({ error: "Name and age are required" });
    }

    const data = readData();
    const newId = data.users.length > 0 ? data.users[data.users.length - 1].id + 1 : 1;

    const newUser = { id: newId, name, age };
    data.users.push(newUser);

    writeData(data);
    res.status(201).json(newUser);
})

//update user by ID 
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, age } = req.body;

  const data = readData();
  const user = data.users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (name) user.name = name;
  if (age) user.age = age;

  writeData(data);
  res.json(user);
});

//delete user by ID
app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const data = readData();

  const index = data.users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  data.users.splice(index, 1);
  writeData(data);

  res.json({ message: "User deleted successfully" });
});

//start the server
app.listen(Port, () => {
    console.log(`App is listening on port ${Port}`);
})