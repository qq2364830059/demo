const express = require("express");

const path = require("path");

// 导入数据库db
const db = require("../mysql/mysql");


const router = express.Router();

// router.get("/index", (req, res) => {
//     console.log(__dirname);
//     res.sendFile(path.join(__dirname, "../public/html/index.html"));
// });


// 首页直接获取数据接口  图
router.get("/article/index", (req, res) => {
    let reqData = req.query;

    //这里"2019-04"可以换成当前月份。使用new Date()来获取
    let sql = `select * from article WHERE aTime >= "2019-04" and aTime<="2019-05"`;
    db.query(sql, (err, data) => {
        if (err) return console.log(err.message);

        if (data.length <= 0) {
            console.log("没有查询到数据");
            res.send();
            return
        }


        console.log(data);

        let dataResult = {
            status: 0,
            message: "查询成功",
            data
        };

        res.send(dataResult);
    });



});

// 首页直接获取数据接口2  图
router.get("/article/index2", (req, res) => {
    let reqData = req.query;

    // 获取每一种类型有多少文章
    let sql = "select COUNT(*) num,aType type from article GROUP BY aType";

    db.query(sql, (err, data) => {
        if (err) return console.log(err.message);


        if (data.length <= 0) {
            console.log("没有查询到数据");
            res.send();
            return
        }

        console.log(data);

        let dataResult = {
            status: 0,
            message: "查询成功",
            data
        }

        res.send(dataResult);
    });



})


// 首页直接获取数据接口3  图
router.get("/article/index3", (req, res) => {
    let reqData = req.query;

    //获取类型，时间，点击量 
    let sql = "select aType,aTime,aClick from article ;";

    db.query(sql, (err, data) => {
        if (err) return console.log(err.message);

        if (data.length <= 0) {
            return console.log("没有查询到数据");
        }

        console.log(data);

        let dataResult = {
            status: 0,
            message: "查询成功",
            data
        }

        res.send(dataResult);

    });



});



// 首页文章总数
router.get("/article/sum", (req, res) => {
    let reqData = req.query;

    // sql
    let sql = "select count(*) txtSum from article"

    db.query(sql, (err, data) => {
        if (err) return console.log(err.message);

        if (data.length <= 0) {
            res.send();
            return console.log("没有查询到数据");
        }


        console.log(data);

        let dataResult = {
            status: 0,
            message: "文章总数",
            data
        }

        res.send(dataResult);
    });



})

// 获取日新增文章数接口
router.get("/article/daySum", (req, res) => {
    let reqData = req.data;

    let sql = `select count(*) daySum from article where aTime = "2019-04-27";`
    db.query(sql, (err, data) => {
        if (err) return console.log(err.message);

        if (data.length <= 0) {
            res.send("没有查询到新增");
            return console.log("没有查询到新增");
        }

        console.log(data);

        let dataResult = {
            status: 0,
            message: "查询成功",
            data
        }

        res.send(dataResult);

    });

})

// 评论总数接口
router.get("/article/commentSum", (req, res) => {
    let reqData = req.query;

    let sql = "select count(*) commentSum from commentInfo";

    db.query(sql, (err, data) => {
        if (err) return console.log(err.message);

        if (data.length <= 0) {
            console.log("没有查询到数据");
            res.send("没有查询到数据");
            return
        }

        console.log(data);

        let dataResult = {
            status: 0,
            message: "查询成功",
            data
        }

        res.send(dataResult);

    });


})

// 日新增评论数接口
router.get("/article/dayCommentSum", (req, res) => {
    let reqData = req.query;

    let sql = `select count(*) dayCommentSum from commentInfo where cTime >= "2022-04-02 00:00:00" and cTime < "2022-04-03 00:00:00"`;
    db.query(sql, (err, data) => {
        if (err) return console.log(err.message);

        if (data.length <= 0) {
            console.log("没有查询到数据");
            res.send("没有查询到数据");
            return;
        }

        console.log(data);

        let resultData = {
            status: 0,
            message: "查询成功",
            data
        }

        res.send(resultData);

    })
})







module.exports = router;