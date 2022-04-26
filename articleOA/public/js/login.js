$(function () {

    // 登录表单隐藏，注册表单显示
    $(".login_mq .txt_box>.txt").click(() => {
        $(".login_mq").hide();
        $(".login_mq2").show();

        // 清空登录表单
        $(".login_mq .uName").val("");
        $(".login_mq .pwd1").val("");


    });
    // 注册表单隐藏，登录表单显示
    $(".login_mq2 .txt_box>.txt").click(() => {
        $(".login_mq").show();
        $(".login_mq2").hide();

        // 清空注册表单
        $(".login_mq2 .uName").val("");
        $(".login_mq2 .pwd2").val("");
        $(".login_mq2 .pwd1").val("");

    });


    let form = layui.form;
    form.verify({
        //定义密码验证,数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 自定义验证
        resPass: function (value, item) { //value 当前使用的input输入框的value值，item，当前DOM元素（当前的input元素）
            // 判断两个密码输入框是否一致
            if (value != $(".login_mq2 .pwd1").val()) {
                return "密码不一致!"; //弹窗的形式出现在页面上
            }
        }
    });

    // 监听注册表单的submit事件，（监听表单提交）
    $(".login_mq2").on("submit", (event) => {
        let e = event || window.event;

        // 清除表单的默认事件
        e.preventDefault();

        let username = $(".login_mq2 .uName").val();
        let password = $(".login_mq2 .pwd2").val();

        // console.log(username, password);

        $.ajax({
            method: "post",
            url: "http://www.liulongbin.top:3007/api/reguser",
            data: {
                username,
                password
            },
            beforeSend: function () { //当一个Ajax请求开始时触发
                layer.load(); //打开layui加载效果，弹窗
            },
            success: (result) => {

                layer.closeAll(); //关闭所有弹层

                // 信息弹窗
                layer.msg(result.message); //使用layer.msg()方法，把注册失败或成功的信息，返回给用户（出现在页面上）

                //注册成功后清空表单，并去登录
                if (result.status == 0) {
                    $(".login_mq2 .uName").val("");
                    $(".login_mq2 .pwd2").val("");
                    $(".login_mq2 .pwd1").val("");

                    // 注册表单隐藏，登录表单显示
                    $(".login_mq").show();
                    $(".login_mq2").hide();

                }

            },
            error: (err) => {
                layer.closeAll(); //关闭所有弹层
                console.log(err);
            }
        });


    })


    // 监听登录表单提交事件
    $(".login_mq").on("submit", (event) => {
        let e = event || window.event;
        // 阻止表单默认事件
        e.preventDefault();


        let username = $(".login_mq .uName").val();
        let password = $(".login_mq .pwd1").val();

        $.ajax({
            method: "post",
            url: "http://www.liulongbin.top:3007/api/login",
            data: {
                username,
                password
            },
            beforeSend: function () { //当一个Ajax请求开始时触发
                layer.load(); //打开layui加载效果
            },
            success: (resData) => {

                layer.closeAll(); //关闭所有弹层

                console.log(resData);
                layer.msg(resData.message); //提示信息弹窗
                // layer.alert(resData.message); //另一种弹窗，不友好的

                // 无论登录成功或失败都清空密码
                $(".login_mq .pwd1").val("");

                // 密码正确，跳转到首页
                if (resData.status == 0) {
                    // 把令牌存储在cookie中，并设置7天过期时间
                    document.cookie = `token=${resData.token};Max-Age=604800`;
                    window.location.href = "http://localhost:3000/api/html/index.html";
                }

            },
            error: (err) => {
                layer.closeAll(); //关闭所有弹层
                console.log(err);
            }
        })


    })




})