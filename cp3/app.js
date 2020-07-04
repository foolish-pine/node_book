"use strict";

const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");
const qs = require("querystring"); // 普通のテキストをパース処理するためのもの

const index_page = fs.readFileSync("./index.ejs", "utf8");
const other_page = fs.readFileSync("./other.ejs", "utf8");
const style_css = fs.readFileSync("./style.css", "utf8");

let msg = "";
let data = {
  msg: "no message...",
};

// Cookieの値を設定
const setCookie = (key, value, response) => {
  const cookie = escape(value);
  response.setHeader("Set-Cookie", [key + "=" + cookie]);
};

const getCookie = (key, request) => {
  const cookie_data =
    request.headers.cookie != undefined ? request.headers.cookie : "";
  const data = cookie_data.split(";");
  for (let i in data) {
    if (data[i].trim().startsWith(key + "=")) {
      const result = data[i].trim().substring(key.length + 1);
      return unescape(result);
    }
  }
  return "";
};

const write_index = (request, response) => {
  msg = "伝言を表示します";
  const cookie_data = getCookie("msg", request);
  const content = ejs.render(index_page, {
    title: "Index",
    content: msg,
    data: data,
    cookie_data: cookie_data,
  });
  response.writeHead(200, { "Content-Type": "text/html" });
  response.write(content);
  response.end();
};

const response_index = (request, response) => {
  if (request.method === "POST") {
    let body = "";

    request.on("data", (data) => {
      // data = クライアントからデータを受け取ると発生するイベント
      body += data;
    });

    request.on("end", () => {
      // end = データの受取が完了すると発生するイベント
      data = qs.parse(body);
      // Cookieの保存
      setCookie("msg", data.msg, response);
      write_index(request, response);
    });
  } else {
    write_index(request, response);
  }
};

const response_other = (request, response) => {
  msg = "これはotherページです。";

  if (request.method === "POST") {
    let body = "";

    request.on("data", (data) => {
      body += data;
    });

    request.on("end", () => {
      let post_data = qs.parse(body);
      msg += `あなたは${post_data.msg}と書きました。`;
      const other_content = ejs.render(other_page, {
        title: "Other",
        content: msg,
      });
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(other_content);
      response.end();
    });
  } else {
    msg = "ページがありません。";
    const other_content = ejs.render(other_page, {
      title: "Other",
      content: msg,
    });
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(other_content);
    response.end();
  }
};

const getFromClient = (request, response) => {
  const url_parts = url.parse(request.url, true); // 第2引数trueでクエリパラメーターもparseする
  switch (url_parts.pathname) {
    case "/":
      response_index(request, response);
      break;

    case "/other":
      response_other(request, response);
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
