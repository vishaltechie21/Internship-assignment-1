const express = require('express');
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));

// to get list of all users in json formate
app.get('/api/users', (req, res) => {
    return res.json(users);
})

//to get the list of all user in html formate
app.get("/users", (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>`;

    return res.send(html);
})

// to get the user by id
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    return res.json(user);
})


app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json(body);
    });
})

app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...req.body };
       
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            return  res.json(users[userIndex]);
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Delete
app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            return  res.json(deletedUser);
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(PORT, () => {
    return console.log(`server is running on port ${PORT}`);
})