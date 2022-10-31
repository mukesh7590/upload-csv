const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/mongoose");
const bodyParser = require("body-parser");

// =============== dotEnv configuration and dataBase connection call ====================
dotenv.config();
connectDB();

// urlEncoded
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./assets"));

// ======= EJS ========
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Load Router
app.use("/", require("./routes/index"));

app.listen(process.env.PORT, (error) => {
   if (error) {
      console.log("error in the port");
   }
   console.log(
      `\n\n\n\t\t\t\t\tHEY! SERVER IS RUNNING on Link :  http://localhost:${process.env.PORT}`
   );
});
