const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const axios = require("axios");

const port = 4321;
const app = express();

app.use(cors());
app.use(express.json());

function readCategories() {
  const content = fs.readFileSync("categories.json");
  const categories = JSON.parse(content);
  return categories;
}
function readArticles() {
  const content = fs.readFileSync("articles.json");
  const articles = JSON.parse(content);
  return articles;
}

app.get("/categories", (req, res) => {
  const { q } = req.query;
  const categories = readCategories();
  console.log(q);
  if (q) {
    const filteredList = categories.filter((category) =>
      category.name.toLowerCase().includes(q.toLowerCase()),
    );

    res.json(filteredList);
  } else {
    res.json(categories);
    console.log(categories);
  }
});

app.get("/categories/:id", (req, res) => {
  const { id } = req.params;
  const categories = readCategories();
  const one = categories.find((category) => category.id === id);
  if (one) {
    res.json(one);
  } else {
    res.sendStatus(404);
  }
});

app.post("/categories", (req, res) => {
  const { name } = req.body;
  const newCategory = { id: uuid(), name: name };

  const categories = readCategories();

  categories.unshift(newCategory);
  fs.writeFileSync("categories.json", JSON.stringify(categories));

  res.sendStatus(201);
});

app.delete("/categories/:id", (req, res) => {
  const { id } = req.params;
  const categories = readCategories();
  const one = categories.find((category) => category.id === id);
  if (one) {
    const newList = categories.filter((category) => category.id !== id);
    fs.writeFileSync("categories.json", JSON.stringify(newList));
    res.json({ deletedId: id });
  } else {
    res.sendStatus(404);
  }
});

app.put("/categories/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const categories = readCategories();
  const index = categories.findIndex((category) => category.id === id);
  if (index > -1) {
    categories[index].name = name;
    fs.writeFileSync("categories.json", JSON.stringify(categories));
    res.json({ updatedId: id });
  } else {
    res.sendStatus(404);
  }
});

app.get("/users/save", (req, res) => {
  const newUser = [
    {
      name: "Sarnai",
      id: 1,
    },
  ];
  fs.writeFileSync("data.json", JSON.stringify(newUser));
  res.json(["success"]);
});

app.get("/users/read", (req, res) => {
  const content = fs.readFileSync("data.json");
  res.json(JSON.parse(content));
});

app.get("/users/update", (req, res) => {
  const content = fs.readFileSync("data.json");
  const users = JSON.parse(content);
  users.push({ id: 2, name: "Bold" });
  fs.writeFileSync("data.json", JSON.stringify(users));
  res.json({});
});

app.get("/articles", (req, res) => {
  const { q, page, categoryId } = req.query;

  // req.query; // ?page=10&q=name
  // req.params; // blog/:id
  // req.body; // post request data
  const articles = readArticles();

  let finalResult = articles;
  if (categoryId) {
    finalResult = articles.filter(
      (article) => article.categoryId === categoryId,
    );
  }
  if (q) {
    finalResult = finalResult.filter((article) =>
      article.title.toLowerCase().includes(q.toLowerCase()),
    );
  }
  const pagedList = finalResult.slice((page - 1) * 10, page * 10);

  const categories = readCategories();

  pagedList.forEach((oneArticle) => {
    const category = categories.find(
      (category) => category.id === oneArticle.categoryId,
    );
    oneArticle.category = category;
  });

  res.json({
    list: pagedList,
    count: finalResult.length,
  });
});

app.post("/articles", (req, res) => {
  const { title, categoryId, text } = req.body;
  const newArticle = { id: uuid(), title, categoryId, text };

  const articles = readArticles();

  articles.unshift(newArticle);
  fs.writeFileSync("articles.json", JSON.stringify(articles));

  res.sendStatus(201);
});

app.get("/articles/insertSampleData", (req, res) => {
  axios("https://dummyjson.com/posts?limit=100").then(({ data }) => {
    const articles = readArticles();

    data.posts.forEach((post) => {
      const newArticle = {
        id: uuid(),
        title: post.title,
        tags: post.tags,
        text: post.body,
      };
      articles.unshift(newArticle);
    });

    fs.writeFileSync("articles.json", JSON.stringify(articles));

    res.json(["success"]);
  });
});
app.get("/articles/updateAllCategory", (req, res) => {
  const articles = readArticles();
  const categories = readCategories();
  articles.forEach((article, index) => {
    const categoryIndex = index % categories.length;
    article.categoryId = categories[categoryIndex].id;
  });

  fs.writeFileSync("articles.json", JSON.stringify(articles));
  res.json(["success"]);
});

app.get("/articles/:id", (req, res) => {
  const { id } = req.params;
  const articles = readArticles();
  const one = articles.find((item) => item.id === id);

  const categories = readCategories();
  const category = categories.find(
    (category) => category.id === one.categoryId,
  );

  // console.log({ category });

  one.category = category;
  if (one) {
    res.json(one);
  } else {
    res.sendStatus(404);
  }
});

app.get("/admin", (req, res) => {
  const newUser = {
    email: "lhagvae0312@gmail.com",
    password: "12345678",
  };
  fs.writeFileSync("admin.json", JSON.stringify(newUser));
  res.json(newUser);
});

app.listen(port, () => {
  console.log("App is listering at port", port);
});
