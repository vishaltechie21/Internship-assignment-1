const express = require('express');
const users = require("./MOCK_DATA.json");
const fs= require("fs");

const app = express();
const PORT = 8000;

app.use(express.urlencoded({extended:false}));

// to get list of all users in json formate
app.get('/api/users', (req,res)=>{
    return res.json(users);
})

//to get the list of all user in html formate
app.get("/users", (req,res)=>{
    const html = `
    <ul>
        ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>`;
    
    return res.send(html);
})

// to get the user by id
app.get("/api/users/:id", (req,res)=>{
    const id = Number(req.params.id);
    const user = users.find(user =>user.id === id);
    return res.json(user);
})


app.post("/api/users", (req,res)=>{
    const body = req.body;
    users.push({...body, id:users.length +1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data)=>{
        return res.json({id:users.length});
    });
})

app.patch("/api/users/:id",(req,res)=>{
    const body = req.body;
    const id= Number(req.params.id);
    const index= users.findIndex(user =>user.id === id);
    users[index] = {
        ...users[index],
        ...body
    };
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data)=>{
        return res.json({id:users.length});
    });
})

app.delete("/api/users/:id",(req,res)=>{
    const id=Number(req.params.id);
    const indx= users.findIndex(user=>user.id === id);
    delete users[indx];
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data)=>{
        return res.json({id:users.length});
    });
})

app.listen(PORT, ()=>{
    return console.log(`server is running on port ${PORT}`);
})