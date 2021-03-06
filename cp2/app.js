"use strict";

const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");

const index_page = fs.readFileSync("./index.ejs", "utf8");
const other_page = fs.readFileSync("./other.ejs", "utf8");
const style_css = fs.readFileSync("./style.css", "utf8");

const getFromClient = (request, response) => {
  const url_parts = url.parse(request.url);
  switch (url_parts.pathname) {
    case "/":
      const content = ejs.render(index_page, {
        title: "Index",
        content: "テンプレートエンジンから生成されました",
      });
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(content);
      response.end();
      break;

    case "/other":
      const other_content = ejs.render(other_page, {
        title: "Other",
        content: "新しく用意したページです",
      });
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(other_content);
      response.end();
      break;

    case "/style.css":
      response.writeHead(200, { "Content-Type": "text/css" });
      response.write(style_css);
      response.end();
      break;

    default:
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("no page...");
      break;
  }
};

const server = http.createServer(getFromClient);

server.listen(3000);
console.log("Server Start");
