const express = require('express');
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const PORT = 8000;

// app.use(express.urlencoded({ extended: false }));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());




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

  const user = users.find(u => u && u.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
});



app.post("/api/users", (req, res) => {
  const body = req.body;

  // basic validation
  if (!body || !body.first_name || !body.email) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  // generate unique id (safe even after delete)
  const newId =
    users.length > 0
      ? Math.max(...users.filter(u => u).map(u => u.id)) + 1
      : 1;

  const newUser = {
    id: newId,
    first_name: body.first_name.trim(),
    last_name: body.last_name || "",
    email: body.email,
    gender: body.gender || "",
    job_title: body.job_title || ""
  };

  users.push(newUser);

  fs.writeFile(
    "./MOCK_DATA.json",
    JSON.stringify(users, null, 2),
    (err) => {
      if (err) {
        return res.status(500).json({ message: "File write error" });
      }
      return res.status(201).json(newUser);
    }
  );
});


app.put('/api/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const body = req.body;

  const userIndex = users.findIndex(u => u && u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // update only allowed fields
  users[userIndex] = {
    ...users[userIndex],
    ...(body.first_name && { first_name: body.first_name.trim() }),
    ...(body.last_name && { last_name: body.last_name }),
    ...(body.email && { email: body.email }),
    ...(body.gender && { gender: body.gender }),
    ...(body.job_title && { job_title: body.job_title })
  };

  fs.writeFile(
    './MOCK_DATA.json',
    JSON.stringify(users, null, 2),
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'File write error' });
      }
      return res.json(users[userIndex]);
    }
  );
});

app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;

  const userIndex = users.findIndex(u => u && u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...(body.first_name && { first_name: body.first_name.trim() }),
    ...(body.last_name && { last_name: body.last_name }),
    ...(body.email && { email: body.email }),
    ...(body.gender && { gender: body.gender }),
    ...(body.job_title && { job_title: body.job_title })
  };

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), () => {
    res.json(users[userIndex]);
  });
});



// Delete
app.delete('/api/users/:id', (req, res) => {
  const userId = Number(req.params.id);

  const userIndex = users.findIndex(u => u && u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const deletedUser = users.splice(userIndex, 1);

  fs.writeFile(
    './MOCK_DATA.json',
    JSON.stringify(users, null, 2),
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'File write error' });
      }
      res.json(deletedUser);
    }
  );
});


app.listen(PORT, () => {
    return console.log(`server is running on port ${PORT}`);
})
