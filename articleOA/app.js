const express = require("express");

const app = express();

// 登录页面路由，不需要权限访问
const loginRouter = require("./router/loginRouter");

// index首页路由，需要权限访问（按理来说）
const router = require("./router/router");

// 对外开放静态文件
app.use("/api", express.static("./public"));


// 设置解析post请求的urlencoded编码格式
app.use(express.urlencoded({ extended: false }));

// 调用路由
app.use("/my", router);
app.use("/api", loginRouter);


app.listen(3000, () => {
    console.log("服务开启");
});