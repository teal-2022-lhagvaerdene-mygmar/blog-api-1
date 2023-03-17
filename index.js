const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { categoryRouter } = require("./routes/categoryController");
const { articleRouter } = require("./routes/articleController");
const multer = require("multer");
const { v4: uuid } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const extentsion = file.originalname.split(".").pop();
    cb(null, `${uuid()}.${extentsion}`);
  },
});

const upload = multer({
  storage: storage,
});

mongoose
  .connect(
    "mongodb+srv://erdene:wkMBhHNhGoqKYc1p@cluster0.sj4jsfd.mongodb.net/blog",
  )
  .then(() => console.log("Connected!"));

const port = 4321;
const app = express();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  createdAt: Date,
  // birthDate: String
});

const User = mongoose.model("User", userSchema, "categories");
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post("/upload-image", upload.single("image"), function (req, res, next) {
  res.json(["success"]);
});
app.use("/categories", categoryRouter);
app.use("/articles", articleRouter);
app.get("/test-mongoose", (req, res) => {
  User.create({
    name: "Baldan",
    email: "baldan@horl.mn",
    age: 18,
    createdAt: new Date(),
  });

  res.json({});
});

app.listen(port, () => {
  console.log("App is listering at port", port);
});
