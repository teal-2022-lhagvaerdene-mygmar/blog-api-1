const express = require("express");
const { v4: uuid } = require("uuid");
const axios = require("axios");
const router = express.Router();
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuid() },
  title: String,
  content: String,
  categoryId: { type: String, ref: "Category" },
  image: {
    path: String,
    width: Number,
    height: Number,
  },
});
const Article = mongoose.model("Article", articleSchema);
router.get("/", async (req, res) => {
  // const { page, size, categoryId } = req.query;

  // let params = [];
  // let countParams = [];
  // let whereQuery = "";
  // if (categoryId) {
  //   whereQuery = "where category_id=?";
  //   params.push(categoryId);
  //   countParams.push(categoryId);
  // }

  // params.push((page - 1) * size + 1);
  // params.push(+size);

  const list = await Article.find({}).populate("categoryId");

  res.json({
    list: list,
    count: 10,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const one = await Article.findById(id);
  res.json(one);
});

router.post("/", async (req, res) => {
  const { title, content, categoryId, image } = req.body;
  await Article.create({
    title,
    content,
    categoryId,
    image,
  });
  res.sendStatus(201);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Article.deleteOne({ _id: id });
  res.json({ deletedId: id });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, categoryId } = req.body;
  await Article.updateOne({ _id: id }, { title, content, categoryId });

  res.json({ updatedId: id });
});

// router.get("/populate", (req, res) => {
//   axios.get("https://dummyjson.com/posts?limit=150").then(function ({ data }) {
//     const { posts } = data;
//     posts.forEach((post) => {
//       const { title, body } = post;
//       const newArticle = {
//         id: uuid(),
//         title,
//         content: body,
//       };
//       connection.query(
//         `insert into article set ?`,
//         newArticle,
//         function (err, results, fields) {
//           console.log(post.id);
//         },
//       );
//     });
//   });

//   res.json(["populate"]);
// });
module.exports = {
  articleRouter: router,
};
