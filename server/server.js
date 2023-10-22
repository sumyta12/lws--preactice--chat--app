const auth = require("json-server-auth");
const jsonServer = require("json-server");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

global.io = io;

const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 9000;

// response middleware

router.render = (req, res) => {
  // console.log(req.method) GET;
  // console.log(req.path) /conversation;
  const method = req.method;
  const path = req.path;

  //conversation ee add bah conversation upadate hoi
  if (
    (path.includes("/conversation") && method === "POST") ||
    method === "PATCH"
  ) {
    io.emit("conversation", {
      body: res.locals.data,
    });
  } else if (path.includes("/messages") && method === "POST")
   {
    console.log('messages server')
    io.emit("messages", {
      body: res.locals.data,
    });
  }

  //eita hocche sob data te ui show hocche ta eita na
  //takle kono data ee pass hbena
  res.json(res.locals.data);
};

// Bind the router db to the app
app.db = router.db;

app.use(middlewares);

const rules = auth.rewriter({
  users: 640,
  conversations: 660,
  messages: 660,
});

app.use(rules);
app.use(auth);
app.use(router);

server.listen(port);
