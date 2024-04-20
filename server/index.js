const express = require("express");
const ConnectDb = require("./db/connect");
const userRouter = require("./router/user-router");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentialS: true, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// important
app.use(express.json());
app.use("/todo", userRouter);

app.get("/", (req, res) => {
  res.json({
    message: "welcome to home",
  });
});

const start = async () => {
  try {
    await ConnectDb(
      "mongodb+srv://Amith:HTDxWTIn7Xli3fOe@amithapi.xubmr5w.mongodb.net/Practice?retryWrites=true&w=majority&appName=AmithApi"
    );
    app.listen(8050, () => {
      console.log("started successfully to port 8050");
    });
  } catch (error) {
    console.log(err);
  }
};
start();
