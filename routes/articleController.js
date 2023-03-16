const express = require("express");
const { v4: uuid } = require("uuid");
const axios = require("axios");
const { connection } = require("../config/mysql");
const router = express.Router();

router.get("/populate", (req, res) => {
  axios.get("https://dummyjson.com/posts?limit=150").then(function ({ data }) {
    const { posts } = data;
    posts.forEach((post) => {
      const { title, body } = post;
      const newArticle = {
        id: uuid(),
        title,
        content: body,
      };
      connection.query(
        `insert into article set ?`,
        newArticle,
        function (err, results, fields) {
          console.log(post.id);
        },
      );
    });
  });

  res.json(["populate"]);
});

router.get("/", (req, res) => {
  const { page, size, categoryId } = req.query;

  let params = [];
  let countParams = [];
  let whereQuery = "";
  if (categoryId) {
    whereQuery = "where category_id=?";
    params.push(categoryId);
    countParams.push(categoryId);
  }

  params.push((page - 1) * size + 1);
  params.push(+size);

  connection.query(
    `SELECT article.id, title, category.name as categoryName FROM article left join category on article.category_id = category.id ${whereQuery} limit ?,?`,
    params,
    function (err, articleResults, fields) {
      connection.query(
        `SELECT count(*) as count FROM article ${whereQuery}`,
        countParams,
        function (err, countResults, fields) {
          res.json({
            list: articleResults,
            count: countResults[0].count,
          });
        },
      );
    },
  );
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `SELECT * FROM article where id=?`,
    [id],
    function (err, results, fields) {
      res.json(results[0]);
    },
  );
});

router.post("/", (req, res) => {
  const { title, content, categoryId } = req.body;
  const newArticle = {
    id: uuid(),
    title,
    content,
    category_id: categoryId,
  };
  connection.query(
    `insert into article set ?`,
    newArticle,
    function (err, results, fields) {
      res.sendStatus(201);
    },
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `delete from article where id=?`,
    [id],
    function (err, results, fields) {
      res.json({ deletedId: id });
    },
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, content, categoryId } = req.body;
  connection.query(
    `update article set ? where id=?`,
    [{ title, content, category_id: categoryId }, id],
    function (err, results, fields) {
      res.json({ updatedId: id });
    },
  );
});

module.exports = {
  articleRouter: router,
};
