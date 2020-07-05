const express = require("express");
const ejs = require("ejs");
const app = express();

app.engine("ejs", ejs.renderFile);
app.use(express.static("public"));

const bodyParser = require("body-parser");
// extended: false = querystringでエンコードする
app.use(bodyParser.urlencoded({ extended: false }));

// トップページ
app.get("/", (req, res) => {
  const msg = "This is Index Page! これはトップページです。";
  const url = "/other?name=taro&pass=yamada";
  res.render("index.ejs", {
    title: "Index",
    content: msg,
    link: { href: url, text: "別のページに移動" },
  });
});

// otherページ
app.get("/other", (req, res) => {
  const name = req.query.name;
  const pass = req.query.pass;
  const msg = `あなたの名前は${name}、パスワードは${pass}です。`;
  res.render("index.ejs", {
    title: "Index",
    content: msg,
    link: { href: "/", text: "トップページに戻る" },
  });
});

// POST送信の処理
app.post("/", (req, res) => {
  const msg = `This is Posted Page! あなたは${req.body.message}と送信しました。`;
  res.render("index.ejs", {
    title: "Posted",
    content: msg,
  });
});

app.listen(3000, () => {
  console.log("Start Server port:3000");
});
