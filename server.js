const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000
const session = require("express-session");

let messages = [];
app.use(express.static(path.join(__dirname, "static", "")));
app.use(express.json());
app.use(
  session({
    secret: "japierdole nie chce mi sie juz",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "static", "pages", "index.html"))
);

app.get("/message", (req, res) => {
  messages.push(res);
});

app.post("/newUser", function (req, res) {
  req.session.user = {
    nickname: req.body.nickname,
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  };
  res.sendStatus(200);
});

app.post("/nick", (req, res) => {
  console.log(
    req.body.message.toString().substring(5, req.body.message.toString().length)
  );
  req.session.user.nickname = req.body.message
    .toString()
    .substring(5, req.body.message.toString().length);
  res.sendStatus(200);
});
app.get("/color", (req, res) => {
  req.session.user.color =
    "#" + Math.floor(Math.random() * 16777215).toString(16);
  res.sendStatus(200);
});

app.post("/newMessage", function (req, res) {
  for (let i in messages) {
    messages[i].json({
      messageContent: req.body.message,
      time: new Date().toTimeString().split(" ")[0],
      author: req.session.user.nickname,
      color: req.session.user.color,
    });
  }
  messages = [];
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server is working on PORT: ${PORT}!`));
