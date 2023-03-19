const express = require("express");

const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("../src/config/index");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const route = require("./routes/index.route");
const mongoDbStore = require("connect-mongodb-session")(session);

// const server = require("http").createServer();
// const { Server } = require("socket.io");
// const io = new Server(server);

const app = express();
//middleWare
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["POST", "PUT", "OPTIONS", "GET", "HEAD"],
    credentials: true,
  })
);

const store = new mongoDbStore({
  uri: "mongodb://127.0.0.1:27017/ecommerceApp",
  collection: "sessions",
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
    store: store,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

//connect DB
db.connect();

//route
route(app);

app.listen(5000);
