const express = require("express");
const cors = require("cors");
const socket = require("socket.io");

const { get_Current_User, user_Disconnect, join_User } = require("./socketUser");

const app = express();
app.use(cors());
const { MongoClient } = require("mongodb");
// const uri =
//   "mongodb+srv://yzhang4:123456abc@cluster0.rspyf.mongodb.net/My_test_project?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const uri =
  "mongodb+srv://balli2:balli2@frosty.wq0ip.mongodb.net/frosty?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.use(express());

const port = 8000;

const server = app.listen(port, console.log(`Server is running on port: ${port} `));

const io = socket(server);

//listener#1: initialise socket io connection
io.on("connection", (socket) => {
  //for a new user joining the room
  socket.on("joinRoom", ({ username, title }) => {
    //* create user
    const p_user = join_User(socket.id, username, title);
    console.log(socket.id, "=id");
    socket.join(p_user.title);

    // // fetching chat history of this room
    // fetchHistory(p_user.title)
    //   .then((data) => console.log(data, "!!"))
    //   .catch(console.dir);

    // console.log("fetching history step");

    //display a welcome message to the user who have joined a room
    // socket.emit("message", {
    //   userId: p_user.id,
    //   username: p_user.username,
    //   messageBody: `Welcome ${p_user.username}`,
    // });

    // //displays a joined room message to all other room users except that particular user
    // socket.broadcast.to(p_user.title).emit("message", {
    //   userId: p_user.id,
    //   username: p_user.username,
    //   messageBody: `${p_user.username} has joined the chat`,
    // });
  });

  //listener#2: user sending message
  socket.on("chat", (messageBody) => {
    //gets the room user and the message sent
    const p_user = get_Current_User(socket.id);
    console.log(p_user.username, p_user.title, "<<<<<<<<");

    // insert sent message into database
    async function insertIntoDB() {
      try {
        await client.connect();
        const database = client.db("frosty");
        const history = database.collection("chats");
        // create a document to insert
        const doc = {
          username: `${p_user.username}`,
          title: `${p_user.title}`,
          messageBody: `${messageBody}`,
          dateCreated: new Date(),
        };
        const result = await history.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
      } finally {
        await client.close();
      }
    }
    insertIntoDB().catch(console.dir);

    //emit sent messages using sockitIO
    io.to(p_user.title).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      messageBody: messageBody,
    });
  });

  //listener#3: when the user exits the room
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.title).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        messageBody: `${p_user.username} has left the chat`,
      });
    }
  });
});

// app.get(`/history/:room`, (req, res) => {
//   const { room } = req.params;
//   fetchHistory(room)
//     .then((data) => {
//       return data;
//     })
//     .then((history) => {
//       res.send({ history });
//     });
// });
