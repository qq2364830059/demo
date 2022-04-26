
window.onload = () => {

    //解决问题： 引入axios的qs，用来解决axios的post请求传参时，传送参数的形式不是form-data，而是Request Payload
    // 定义qs对象
    var qs = Qs;


    // 获取侧边栏昵称节点
    let uns = document.querySelector(".layui-side .userName");

    // 获取用户信息请求接口
    function getUserInfo(fun) { //成功执行函数
        // 处理cookie，拿到令牌token的属性值。

        // 调用获取对应cookie值的
        let token = cookieFun("token");
        // console.log(token);

        axios({
            method: "get",
            url: "http://www.liulongbin.top:3007/my/userinfo",
            // 设置请求头
            headers: {
                Authorization: token || ""
            }
        }).then(res => {
            // console.log(res);
            fun(res);
        })
    }
    getUserInfo(yanZhen);

    // 首页进入时,发送请求给网上服务器判断是否登录过(是否含有令牌)
    function yanZhen(res) {
        if (res.data.status == 1) {
            // 出现弹窗
            layer.msg(res.data.message);

            // 一秒后跳转
            setTimeout(() => {
                window.location.href = "http://localhost:3000/api/html/login.html";
            }, 1000)
            return;
        }
        // 把首页渲染到页面上
        webBody("http://localhost:3000/api/html/indexContent.html", indexFun);

        if (res.data.data.nickname) { //判断昵称是否存在
            uns.innerText = res.data.data.nickname;
        } else {
            uns.innerText = res.data.data.username;
        }


        // 如果获取到了图片
        if (res.data.data.user_pic) {
            $(".imgArr").each((index, item) => {
                item.src = res.data.data.user_pic;
            })
        }


    }


    // 封装cookie，返回想要的cookie值。
    function cookieFun(name) { //cookie的属性名对应的属性值

        // console.log(document.cookie); //打印当前所有的cookie

        // 把cookie字符串切割成数组
        let cookieArr = document.cookie.split(";");
        // console.log(cookieArr);

        let cookieObj = {};
        cookieArr.forEach((item) => {
            let strIndex = item.indexOf("="); //获取号的下标
            if (strIndex != -1) { //含有等于号的字符串
                let n = item.slice(0, strIndex).trim(); //获取属性名，去除前后空格
                let v = item.slice(strIndex + 1);//获取属性值

                // 添加进对象里
                cookieObj[n] = v;
            }

        });

        // console.log(cookieObj);

        return cookieObj[name];

    }


    // 第一个请求 图
    function getLine() {
        axios({
            method: "get",
            url: "http://localhost:3000/my/article/index",
        }).then(result => {
            // console.log(result);
            // 获取后台的数据
            let resArr = result.data.data;

            let dataArr = [];

            // 把相同的时间的累加，且把对应的时间添加进去。
            for (let i = 0; i < resArr.length; i++) {


                // 累加数
                let count = 1;
                for (let j = i + 1; j < resArr.length; j++) {
                    if (resArr[i].aTime == resArr[j].aTime) {
                        count++;
                    }
                }

                dataArr.push({ count, date: resArr[i].aTime });
            }

            // console.log(dataArr);

            // 获取最大时间戳
            let maxNum = new Date(dataArr[0].date);
            // 获取最大时间日期
            let maxTime = dataArr[0].date;
            // 循环遍历出最大的时间日期
            for (let i = 0; i < dataArr.length; i++) {
                if (maxNum < new Date(dataArr[i].date)) {
                    maxNum = new Date(dataArr[i].date);
                    maxTime = dataArr[i].date;
                }
            }

            for (let i = 0; i < dataArr.length; i++) {
                // 如果里面有跟最大时间日期相同的，则切割掉
                if (dataArr[i].date == maxTime) {
                    dataArr.splice(i + 1);
                }
                dataArr[i].date = dataArr[i].date.slice(0, dataArr[i].date.indexOf("T"));
            }
            lineChart(dataArr)
        })
    }



    // 第一个图函数
    function lineChart(aList_all) {
        // ,使用这个echart要指定容器的大小（宽高）
        var oChart = echarts.init(document.getElementById('middle_box1'));
        // var aList_all = [
        //     { 'count': 36, 'date': '2019-04-13' },
        //     { 'count': 52, 'date': '2019-04-14' },
        //     { 'count': 78, 'date': '2019-04-15' },
        //     { 'count': 85, 'date': '2019-04-16' },
        //     { 'count': 65, 'date': '2019-04-17' },
        //     { 'count': 72, 'date': '2019-04-18' },
        //     { 'count': 88, 'date': '2019-04-19' },
        //     { 'count': 64, 'date': '2019-04-20' },
        //     { 'count': 72, 'date': '2019-04-21' },
        //     { 'count': 90, 'date': '2019-04-22' },
        //     { 'count': 96, 'date': '2019-04-23' },
        //     { 'count': 100, 'date': '2019-04-24' },
        //     { 'count': 102, 'date': '2019-04-25' },
        //     { 'count': 110, 'date': '2019-04-26' },
        //     { 'count': 123, 'date': '2019-04-27' },
        //     { 'count': 100, 'date': '2019-04-28' },
        //     { 'count': 132, 'date': '2019-04-29' },
        //     { 'count': 146, 'date': '2019-04-30' },
        //     { 'count': 200, 'date': '2019-05-01' },
        //     { 'count': 180, 'date': '2019-05-02' },
        //     { 'count': 163, 'date': '2019-05-03' },
        //     { 'count': 110, 'date': '2019-05-04' },
        //     { 'count': 80, 'date': '2019-05-05' },
        //     { 'count': 82, 'date': '2019-05-06' },
        //     { 'count': 70, 'date': '2019-05-07' },
        //     { 'count': 65, 'date': '2019-05-08' },
        //     { 'count': 54, 'date': '2019-05-09' },
        //     { 'count': 40, 'date': '2019-05-10' },
        //     { 'count': 45, 'date': '2019-05-11' },
        //     { 'count': 38, 'date': '2019-05-12' },
        // ];

        let aCount = [];
        let aDate = [];

        for (var i = 0; i < aList_all.length; i++) {
            aCount.push(aList_all[i].count);
            aDate.push(aList_all[i].date);
        }

        var chartopt = {
            // 标题
            title: {
                text: '月新增文章数',
                left: 'center', //居中
                top: '10'
            },
            tooltip: {
                trigger: 'axis'
            },
            // 标题下的东西
            legend: {
                data: ['新增文章'],
                top: '40'
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            // x轴
            xAxis: [
                {
                    name: '日',
                    type: 'category',
                    boundaryGap: false,
                    data: aDate
                }
            ],
            // y轴
            yAxis: [
                {
                    name: '月新增文章数',
                    type: 'value'
                }
            ],
            // 数据
            series: [
                {
                    name: '新增文章',
                    type: 'line',
                    smooth: true,
                    // areaStyle: { type: 'default', opacity: 0.1 }, color: '#f80' 设置占比颜色和透明度
                    // 区域样式  设置当前区域的透明度和颜色
                    areaStyle: {
                        opacity: 0.1,
                        // 设置渐变色
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#f80' },
                                { offset: 0.5, color: '#f80' },
                                { offset: 1, color: '#ffffff' }
                            ]
                        )
                    },
                    // 设置当前折现的颜色，和 标题下的东西的颜色    lineStyle只单独设置折现
                    itemStyle: {
                        normal: {
                            color: '#f80',
                        }
                    },
                    data: aCount  //当前文章数量
                }],
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(255,136,0,0.39)'
                    }, {
                        offset: .34,
                        color: 'rgba(255,180,0,0.25)'
                    }, {
                        offset: 1,
                        color: 'rgba(255,222,0,0.00)'
                    }])

                }
            },
            // 行或列之间的距离
            grid: {
                show: true,
                x: 50,
                x2: 50,
                y: 80,
                height: 220
            }
        };

        oChart.setOption(chartopt);
    }


    // 第二个请求  图
    function getPie() {
        axios({
            method: "get",
            url: "http://localhost:3000/my/article/index2"
        }).then(result => {

            // console.log(result.data.data);

            let resData = result.data.data;

            let nameArr = [];
            let obj = [];

            resData.forEach((item) => {
                nameArr.push(item.type);
                obj.push({ "value": item.num, "name": item.type });
            });

            let dataObj = {
                nameArr,
                obj
            }
            // console.log(dataObj);

            pieFun(dataObj);
        });
    }

    // 第二个图
    function pieFun(dataObj) {
        var oPie = echarts.init(document.getElementById('middle_box2'));
        var oPieopt =
        {
            title: {
                top: 10,
                text: '分类文章数量比',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)" //鼠标移上显示百分比
            },
            color: ['#5885e8', '#13cfd5', '#00ce68', '#ff9565'],
            legend: {
                x: 'center',
                top: 65,
                // data: ['奇趣事', '会生活', '爱旅行', '趣美味']  //文章类型
                data: dataObj.nameArr  //传过来的数据
            },
            toolbox: {
                show: true,
                x: 'center',
                top: 35,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['45%', '60%'],
                    center: ['50%', '65%'],
                    // 数据
                    // data: [
                    //     { value: 300, name: '奇趣事' },
                    //     { value: 100, name: '会生活' },
                    //     { value: 260, name: '爱旅行' },
                    //     { value: 180, name: '趣美味' }
                    // ]
                    data: dataObj.obj  //传过来的数据
                }
            ]
        };
        oPie.setOption(oPieopt);
    }



    // 第三个请求  图
    function getColumn() {
        axios({
            method: "get",
            url: "http://localhost:3000/my/article/index3"
        }).then(res => {
            let resData = res.data.data
            // console.log(resData);

            //保存有几个月份
            let monthArr = [];
            resData.forEach((item) => {
                // 获取当前时间在那个月份。
                let time = new Date(item.aTime).getMonth() + 1;
                // console.log(time)

                //判断数组是否存在该月份,不存在 则添加 
                if (!monthArr.includes(time)) {
                    monthArr.push(time);
                }

            });
            // console.log(monthArr);

            // 保存当前类型
            let typeArr = [];
            resData.forEach((item) => {
                // 判断当前数组是否存在该类型
                if (!typeArr.includes(item.aType)) {
                    typeArr.push(item.aType);
                }

            });
            // console.log(typeArr);

            // 计算每个类型 各月分的访问量
            // 保存每个类型 各月分的访问量
            let clickArr = [];
            typeArr.forEach((item) => {
                // 保存每种类型每个月的访问量
                let arr = [];
                monthArr.forEach((monthItem) => {
                    // 保存每个月的访问量
                    let sum = 0;
                    resData.forEach((resItem) => {
                        // 获取当前时间在那个月份。 
                        let time = new Date(resItem.aTime).getMonth() + 1

                        // 判断当前在哪个类型和是哪个月份
                        if (time == monthItem && resItem.aType == item) {
                            sum += resItem.aClick;
                        }

                    })

                    arr.push(sum);

                });

                clickArr.push(arr);

            });

            // console.log(clickArr);


            // 把月份转化为字符串月份
            monthArr.forEach((item, index) => {
                monthArr[index] = item + "月"
            });
            // console.log(monthArr);



            let dataObj = {
                typeArr, //类型
                monthArr, //月份
                clickArr  //访问量

            }
            // console.log(dataObj);


            columnFUn(dataObj);
        })
    }

    // 第三个图
    function columnFUn(dataObj) {
        var oColumn = this.echarts.init(document.getElementById('bottom_box_mq'));
        var oColumnopt =
        {
            title: {
                text: '文章访问量',
                left: 'center',
                top: '10'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                // data: ['奇趣事', '会生活', '爱旅行', '趣美味'], //文章类型
                data: dataObj.typeArr,
                top: '40'
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    // data: ['1月', '2月', '3月', '4月', '5月'] //月份
                    data: dataObj.monthArr
                }
            ],
            yAxis: [
                {
                    name: '访问量',
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '奇趣事',
                    type: 'bar',
                    barWidth: 20,
                    itemStyle: {
                        normal: { areaStyle: { type: 'default' }, color: '#fd956a' }
                    },
                    // data: [800, 708, 920, 1090, 1200]
                    data: dataObj.clickArr[0]
                },
                {
                    name: '会生活',
                    type: 'bar',
                    barWidth: 20,
                    itemStyle: {
                        normal: { areaStyle: { type: 'default' }, color: '#2bb6db' }
                    },
                    // data: [400, 468, 520, 690, 800]
                    data: dataObj.clickArr[1]
                },
                {
                    name: '爱旅行',
                    type: 'bar',
                    barWidth: 20,
                    itemStyle: {
                        normal: { areaStyle: { type: 'default' }, color: '#13cfd5' }
                    },
                    // data: [500, 668, 520, 790, 900]
                    data: dataObj.clickArr[2]
                },
                {
                    name: '趣美味',
                    type: 'bar',
                    barWidth: 20,
                    itemStyle: {
                        normal: { areaStyle: { type: 'default' }, color: '#00ce68' }
                    },
                    // data: [600, 508, 720, 890, 1000]
                    data: dataObj.clickArr[3]
                }
            ],
            grid: {
                show: true,
                x: 50,
                x2: 30,
                y: 80,
                height: 260
            },
            dataZoom: [//给x轴设置滚动条
                {
                    start: 0,//默认为0
                    end: 100 - 1000 / 31,//默认为100
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    handleSize: 0,//滑动条的 左右2个滑动条的大小
                    height: 8,//组件高度
                    left: 45, //左边的距离
                    right: 50,//右边的距离
                    bottom: 26,//右边的距离
                    handleColor: '#ddd',//h滑动图标的颜色
                    handleStyle: {
                        borderColor: "#cacaca",
                        borderWidth: "1",
                        shadowBlur: 2,
                        background: "#ddd",
                        shadowColor: "#ddd",
                    }
                }]
        };


        oColumn.setOption(oColumnopt);
    }



    // 获取文章总数请求
    function getSum() {
        let color_purple = document.querySelector(".color_purple");
        axios({
            method: "get",
            url: "http://localhost:3000/my/article/sum"
        }).then((res) => {
            // console.log(res);

            let resData = res.data.data;
            // console.log(resData);

            color_purple.innerHTML = resData[0].txtSum;
        })

    }


    // 获取日新增文章数请求
    function getDaySum() {
        let color_blue = document.querySelector(".color_blue");

        axios({
            method: "get",
            url: "http://localhost:3000/my/article/daySum"
        }).then(res => {
            let resData = res.data.data;

            // console.log(resData);

            color_blue.innerText = resData[0].daySum;
        })
    }

    // 获取评论总数请求
    function getCommentSum() {
        let commmentSum = document.querySelector(".commmentSum");

        axios({
            method: "get",
            url: "http://localhost:3000/my/article/commentSum"
        }).then(res => {
            let resData = res.data.data
            // console.log(resData);
            commmentSum.innerText = resData[0].commentSum;
        })

    }


    // 获取日新增评论数请求
    function getdayCommentSum() {
        let dayCommentSum = document.querySelector(".dayCommentSum");

        axios({
            method: "get",
            url: "http://localhost:3000/my/article/dayCommentSum",
        }).then(res => {
            let resData = res.data.data;
            // console.log(resData);
            dayCommentSum.innerText = resData[0].dayCommentSum;
        });


    }


    /**
     * 退出功能
    */
    let exitBtn = document.querySelector(".war_mq .exitBtn");
    exitBtn.onclick = function () {
        // 清除cookie
        document.cookie = `token="";Max-Age=0`;

        // 并跳转道登录页面
        window.location.href = "http://localhost:3000/api/html/login.html";
    }




    // 使用请求获取其他页面的内容 导入进自己的页面
    function webBody(url, webFun) {
        axios({
            method: "get",
            url: url, //选中的html文件路径
            cache: false,  //是否缓存当前页面  不加没影响
            async: true,   //true  是异步    false 否   不加没影响
            dataType: "html", //数据类型  html  text json
        }).then((res) => {
            // console.log(res);

            // 获取主体标签
            let content_box_mq = document.querySelector(".content_box_mq");
            content_box_mq.innerHTML = res.data; //把返回的整个html内容，加载进页面。
        }).catch((err) => {
            layer.msg(err);
        }).then(() => {
            // 等html加载进了页面，就可以获取对应的节点了
            webFun();
        })

    }


    // 首页
    let index_btn = document.querySelector(".index_btn");
    index_btn.onclick = function () {
        webBody("http://localhost:3000/api/html/indexContent.html", indexFun);
    }
    // 首页操作,等把html渲染到了页面再执行
    function indexFun() {
        // 第一个请求 图
        getLine();
        // 第二个请求  图
        getPie();
        // 第三个请求  图
        getColumn()

        // 获取文章总数请求
        getSum()
        // 获取日新增文章数请求
        getDaySum()
        // 获取评论总数请求
        getCommentSum()
        // 获取日新增评论数请求
        getdayCommentSum()

    }



    /**
     *文章管理 
     * 
     */

    // 文章类别
    let articleType = document.querySelector(".articleType");
    articleType.onclick = function () {
        webBody("http://localhost:3000/api/html/articleType.html", articleTypeFun);
    }
    // 文章类别操作，等把html渲染到了页面再执行
    function articleTypeFun() {

        let addBtn = document.querySelector(".addBtn");


        // 调用获取对应cookie值的
        let token = cookieFun("token");

        // 获取数据添加进页面方法
        function getList() {
            axios({
                method: "get",
                url: "http://www.liulongbin.top:3007/my/article/cates",
                // 设置请求头
                headers: {
                    Authorization: token || ""
                }
            }).then(res => {

                // 如果获取列表失败则
                if (res.data.status == 1) {
                    return layer.msg(res.data.message);
                }

                // 把数据渲染进页面
                let dataArr = res.data;
                // 调用模板引擎
                let s = template("table_tem", dataArr);
                $(".t_body").html(s);


                // 等渲染进页面才可以获取到删除，添加按钮节点
                $(".aub").click(audFun);
                $(".removeBtn").click(removeFun);

            })
        }
        getList()

        // 添加按钮
        addBtn.onclick = function () {
            // 模板引擎定义数据
            let data = {
                str: "添加",
                bol: true //用来判断是否需要重置按钮
            }
            let s = template("tem", data);  //得到模板引擎的字符串

            //自定页(自定义弹窗)
            layer.open({
                type: 1,
                title: ["添加文章分类", "background-color:#F8F8F8;height:43px;line-height:43px"],
                skin: 'alter_box layui-form', //样式类名   这里的类名必须是在body下的类，且加在这里的类名，会自动加载最外层的盒子上
                closeBtn: 1, //右上角的关闭按钮 ，默认为1
                shadeClose: false, //是否点击遮罩关闭,默认false
                content: s, //内容使用模板引擎的字符串代替了。
                // 层弹出后的成功回调方法
                success: (layero, index) => { //layero当前层DOM    index当前层索引
                    // console.log(layero, index);
                    // console.log(this); 当前外层的this

                    let form = layero[0].querySelector("form"); //获取当前的表单
                    // 监听表单submit提交
                    form.onsubmit = function (event) {
                        let e = event || window.event;
                        // 阻止表单默认事件
                        e.preventDefault();

                        // 在加载的状态。
                        layer.load();

                        // 判断不能重复添加
                        axios({
                            method: "get",
                            url: "http://www.liulongbin.top:3007/my/article/cates",
                            // 设置请求头
                            headers: {
                                Authorization: token || ""
                            }
                        }).then(result => { //处理是否有重复分类名
                            // 保存当前是否存在的状态
                            let bol = true;

                            console.log(result.data.data);
                            let d = result.data.data;
                            $.each(d, (index, item) => {
                                if (item.name == $(".typeName").val().trim()) {
                                    bol = false;
                                }
                            });

                            return bol;

                        }).then((bol) => { //添加数据
                            console.log(bol);
                            if (bol) {
                                // 发送添加请求
                                axios({
                                    method: "post",
                                    url: "http://www.liulongbin.top:3007/my/article/addcates",
                                    // 设置请求头
                                    headers: {
                                        Authorization: token || "",
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    },
                                    data: qs.stringify({
                                        name: $(".typeName").val(),
                                        alias: $(".typeAlias").val()
                                    })
                                }).then(res => {
                                    console.log(res);
                                    layer.msg(res.data.message);

                                    // 如果失败则退出
                                    if (res.data.status == 1) {
                                        return
                                    }

                                    // 重新渲染数据列表
                                    getList();

                                })
                            } else {
                                layer.msg("不能重复添加");
                            }

                            layer.closeAll("loading")//关闭加载窗口
                            layer.close(index); //手动关闭当前窗口

                        })

                    }

                }
            });

        }

        // 修改按钮方法
        function audFun() {
            // 模板引擎定义数据
            let data = {
                str: "修改",
                bol: false //用来判断是否需要重置按钮
            }
            let s = template("tem", data);  //得到模板引擎的字符串

            //自定页(自定义弹窗)
            layer.open({
                type: 1,
                title: ["修改文章分类", "background-color:#F8F8F8;height:43px;line-height:43px"],
                skin: 'alter_box layui-form', //样式类名   这里的类名必须是在body下的类，且加在这里的类名，会自动加载最外层的盒子上
                content: s, //内容使用模板引擎的字符串代替了。
                // 层弹出后的成功回调方法
                success: (layero, index) => { //layero当前层DOM    index当前层索引
                    // console.log(layero, index);
                    // console.log(this); 当前外层的this

                    let inpAll = layero[0].querySelectorAll("input"); // 获取当前弹窗的所有input
                    let form = layero[0].querySelector("form"); //获取当前的表单
                    let contArr = this.parentNode.parentNode.children; //获取tr的所有子节点td

                    // 为三个表单设置value值
                    inpAll.forEach((item, i) => {
                        item.value = contArr[i].innerText;
                    })

                    // 监听表单submit提交
                    form.onsubmit = function (event) {
                        let e = event || window.event;
                        // 阻止表单默认事件
                        e.preventDefault();

                        axios({
                            method: "post",
                            url: "http://www.liulongbin.top:3007/my/article/updatecate",
                            // 设置请求头
                            headers: {
                                Authorization: token || "",
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data: qs.stringify({
                                Id: $("[name=id]").val(),
                                name: $(".typeName").val(),
                                alias: $(".typeAlias").val()
                            })
                        }).then(res => {
                            layer.msg(res.data.message);

                            if (res.data.status == 1) {
                                return
                            }

                            // 重新渲染数据列表。可以不需要重新渲染 可以改为本地数据修改
                            getList();

                        })

                        layer.close(index); //手动关闭当前窗口
                    }

                }
            });

        }



        // 删除按钮
        function removeFun() {

            //询问框
            layer.confirm('确定删除吗？', {
                btn: ['确定', '取消'],  //按钮
                skin: "txt",
                title: ["提示", "background-color:#F8F8F8;height:43px;line-height:43px"],
                content: `<i class="layui-layer-ico layui-layer-ico3"></i><span class="txt">确定删除吗？</span>`
            }, () => {
                // layer.msg('确定事件', { icon: 1 });

                // console.log(this.parentNode.parentNode.firstElementChild);

                let id = this.parentNode.parentNode.firstElementChild.innerText
                // console.log(id);
                axios({
                    method: "get",
                    url: `http://www.liulongbin.top:3007/my/article/deletecate/${id}`,
                    // 设置请求头
                    headers: {
                        Authorization: token || "",
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(res => {
                    layer.msg(res.data.message);
                    // console.log(res);
                    if (res.data.status == 1) {
                        return
                    }

                    // 重新渲染数据列表。可以不需要重新渲染 可以改为本地数据修改
                    getList();

                })

                layer.closeAll(); //手动关闭当前窗口

            }, function () {
                // layer.msg('取消事件', {
                //     time: 20000, //20s后自动关闭
                //     btn: ['明白了', '知道了']
                // });
            });


        }


    }

    // 文章列表
    let article_list = document.querySelector(".article_list");
    article_list.onclick = function () {
        webBody("http://localhost:3000/api/html/articleList.html", articleList);
    }
    // 文章列表操作，等把html渲染到了页面再执行
    function articleList() {
        //进入的时候左侧栏选中自身项，先清后设
        $(".active_item").removeClass("layui-this");
        $(".article_list_item").addClass("layui-this");

        // 表单元素动态生成的，自动渲染就会失效，使用form.render();更新渲染
        layui.use('form', function () {
            var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功

            //但是，如果你的HTML是动态生成的，自动渲染就会失效
            //因此你需要在相应的地方，执行下述方法来进行渲染
            form.render();
        });

        // 分页区 
        layui.use('laypage', function () {
            var laypage = layui.laypage;

            //执行一个laypage实例
            laypage.render({
                elem: 'page-box' //注意，这里的 page-box 是 ID，不用加 # 号
                , count: 50 //数据总数，从服务端得到
                , limit: 10 //每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
                , layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
                // 当分页被切换时触发
                , jump: function (obj, first) { //obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
                    console.log(obj)
                }
            });
        });





        // 调用获取对应cookie值的
        let token = cookieFun("token");

        // axios({
        //     method: "get",
        //     url: "http://www.liulongbin.top:3007",
        //     // 设置请求头
        //     headers: {
        //         Authorization: token || ""
        //     }
        // }).then(res => {
        //     console.log(res);
        // })


    }


    // 发表文章
    let article_send = document.querySelector(".article_send");
    article_send.onclick = function () {
        webBody("http://localhost:3000/api/html/articleSend.html", articleSend);
    }
    // 发表文章操作，等把html渲染到了页面再执行
    function articleSend() {
        // 表单元素是动态生成的都要重新渲染
        // 表单元素动态生成的，自动渲染就会失效，使用form.render();更新渲染
        layui.use('form', function () {
            var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功

            //但是，如果你的HTML是动态生成的，自动渲染就会失效
            //因此你需要在相应的地方，执行下述方法来进行渲染
            form.render();
        });


        let layedit, index;

        // 文本编辑器
        layui.use('layedit', function () {
            layedit = layui.layedit;
            index = layedit.build('editTxt2'); //建立编辑器

        });


        // 调用获取对应cookie值的
        let token = cookieFun("token");
        axios({
            method: "get",
            url: "http://www.liulongbin.top:3007/my/article/cates",
            // 设置请求头
            headers: {
                Authorization: token || ""
            }
        }).then(res => {
            // console.log(res.data);

            //调用模板字符串 
            let s = template("typeTmp", res.data);
            $(".select_type").html(s);

            // 表单元素是动态生成的都要重新渲染
            // 表单元素动态生成的，自动渲染就会失效，使用form.render();更新渲染
            layui.use('form', function () {
                var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功

                //但是，如果你的HTML是动态生成的，自动渲染就会失效
                //因此你需要在相应的地方，执行下述方法来进行渲染
                form.render();
            });
        })


        // 1. 初始化图片裁剪器
        var $image = $('#image')

        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }

        // 3. 初始化裁剪区域
        $image.cropper(options)

        // 选择文件
        $(".selectBtn").click(() => {
            $(".file").click(); //触发隐藏上传文件的input按钮
        })

        // 监听上传文件发生改变的事件
        $(".file").on("change", (e) => {

            // 判断图片是否选择了
            if (e.target.files.length == 0) {
                layer.msg("请重新上传文件");
                return;
            }

            var file = e.target.files[0];

            var newImgURL = URL.createObjectURL(file);

            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域

        });


        let state = "";

        // 监听表单submit事件
        $(".form_mq").on("submit", ((e) => {
            e.preventDefault();

            // 显示加载弹窗
            layer.load();

            // 拿到文本域的文本内容
            let bodyTxt = layedit.getText(index)


            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // console.log({ title: $("[name=title]").val(), cate_id: $("[name=cate_id]").val(), content: bodyTxt, cover_img: blob, state })

                    let fd = new FormData();
                    fd.append("title", $("[name=title]").val());
                    fd.append("cate_id", $("[name=cate_id]").val());
                    fd.append("content", bodyTxt);
                    fd.append("cover_img", blob); //bold必须用这个
                    fd.append("state", state);

                    // 发布文章请求
                    axios({
                        method: "post",
                        url: "http://www.liulongbin.top:3007/my/article/add",
                        // 设置请求头
                        headers: {
                            Authorization: token || "",
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        // 发送的数据类型
                        contentType: false,
                        // 对 formData 进行解析 
                        processData: false,
                        data: fd
                    }).then(res => {
                        layer.closeAll('loading'); //关闭加载层

                        // console.log(res);
                        layer.msg(res.data.message);

                        //不符合条件return出去 
                        if (res.data.status !== 0) {
                            return
                        }

                        // 渲染文章列表的html
                        webBody("http://localhost:3000/api/html/articleList.html", articleList);


                    })

                })
        }))

        $(".btn_pub").click(function () {
            state = "已发布";
        });
        $(".caogaoBtn").click(() => {
            state = "草稿";
        })



    }




    /**
     * 个人中心
     */

    // 基本资料
    let InfoBtn = document.querySelectorAll(".InfoBtn");
    InfoBtn.forEach((item) => {
        item.onclick = () => {
            webBody("http://localhost:3000/api/html/personInfo.html", personInfo);
        }
    });
    // // 基本资料操作，等把html渲染到了页面再执行
    function personInfo() {
        // 定义数据
        let data = {
            title: "修改用户信息",
            lableStr1: "登录名称",
            lableStr2: "用户昵称",
            lableStr3: "用户邮箱",
            bol: false,
            btn: "提交修改"
        }

        // 调用模板引擎
        let s = template("personTem", data);

        // 渲染进页面
        let content_box_mq = document.querySelector(".content_box_mq");
        content_box_mq.innerHTML = s; //渲染进页面

        // 获取用户基本信息
        getUserInfo((res) => {
            console.log(res);
            var form = layui.form;
            // 表单赋值
            form.val("formUser", res.data.data); //formUser 即 class="layui-form"  所在表单元素属性 lay-filter="" 对应的值，第二个参数是个对象 属性名要跟表单里的input的name属性值一致，才有效。
        });


        // 监听表单submit提交
        let formUser = document.querySelector(".formUser");
        formUser.onsubmit = function (event) {
            let e = event || window.event;

            e.preventDefault();

            // 获取输入框里面的值
            let id = parseInt(document.querySelector("input[name='id']").value);
            let nickname = document.querySelector("input[name='nickname']").value;
            let email = document.querySelector("input[name='email']").value;


            // 调用获取对应cookie值的
            let token = cookieFun("token");
            // 更新用户基本信息接口
            axios({
                method: "post",
                url: "http://www.liulongbin.top:3007/my/userinfo",
                // 设置请求头
                headers: {
                    Authorization: token || "",
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({ id, nickname, email })  // 用qs.stringify()将对象序列化成URL的形式
            }).then((res) => {
                // console.log(res);
                layer.msg(res.data.message);

            })

        }

        // 重置按钮
        let resetBtn = document.querySelector(".resetBtn");
        resetBtn.onclick = function (event) {
            let e = event || window.event;

            e.preventDefault();

            // 获取用户信息，并操作
            getUserInfo((res) => {
                uns.innerText = res.data.data.nickname;
            });

        }


    }


    // 获取更换头像按钮节点
    let updateImgArr = document.querySelectorAll(".updateImg");
    // 点击切换主题内容为头像更新内容
    updateImgArr.forEach((item, index) => {
        item.onclick = function () {
            webBody("http://localhost:3000/api/html/updateHead.html", updataImg);
        }
    });
    // 更换头像(文件上传)，等把html渲染到了页面再执行
    function updataImg() {

        // 1.1 获取裁剪区域的 DOM 元素
        var $image = $('#image')
        // 1.2 配置选项
        const options = {
            // 纵横比
            aspectRatio: 1,
            // 指定预览区域
            preview: '.img-preview'
        }

        // 1.3 创建裁剪区域
        $image.cropper(options)

        // 更新数据,把当前图片更换成获取的图片
        getUserInfo((res) => {
            // 如果获取道图片则更新。
            if (res.data.data.user_pic) {
                $(".layui-card-body img").each((index, item) => {
                    item.src = res.data.data.user_pic;
                })
            }
        })


        // 选择文件
        $(".topBtn").click(() => {
            $(".file").click(); //触发隐藏上传文件的input按钮
        })

        // 监听上传文件发生改变的事件
        $(".file").on("change", (e) => {

            // 判断图片是否选择了
            if (e.target.files.length == 0) {
                layer.msg("请重新上传文件");
                return;
            }

            var file = e.target.files[0];

            var newImgURL = URL.createObjectURL(file);

            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域


        });

        // 确定按钮（上传文件）
        $(".makeBtn").click(() => {
            var dataURL = $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                })
                .toDataURL('image/png');       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

            // console.log(dataURL);

            // 调用获取对应cookie值的
            let token = cookieFun("token");
            // 发送更新头像的请求
            axios({
                method: "post",
                url: "http://www.liulongbin.top:3007/my/update/avatar",
                // 设置请求头
                headers: {
                    Authorization: token || "",
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    avatar: dataURL
                })
            }).then(res => {
                layer.msg(res.data.message);

                if (res.data.status == 0) {
                    // 更新数据
                    getUserInfo((res) => {
                        $(".imgArr").each((index, item) => {
                            item.src = res.data.data.user_pic;
                        })
                    })
                }

            })


        });



    }

    // 重置密码
    let resetPwd = document.querySelectorAll(".resetPwd");
    resetPwd.forEach((item, index) => {
        item.onclick = function () {
            webBody("http://localhost:3000/api/html/personInfo.html", resetPwdFun);
        }
    });
    // 重置密码操作，等把html渲染到了页面再执行
    function resetPwdFun() {
        // 定义数据
        let data = {
            title: "修改密码",
            lableStr1: "原密码",
            lableStr2: "新密码",
            lableStr3: "确认新密码",
            bol: true,
            btn: "修改密码"
        }

        // 调用模板引擎
        let s = template("personTem", data);

        // 渲染进页面
        let content_box_mq = document.querySelector(".content_box_mq");
        content_box_mq.innerHTML = s; //渲染进页面

        // 表单验证
        let form = layui.form;
        form.verify({
            //定义密码验证,数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
            pass: [
                /^[\S]{6,12}$/
                , '密码必须6到12位，且不能出现空格'
            ],
            // 新旧密码是否相同
            newPwd1: function (value, item) { //value 当前使用的input输入框的value值，item，当前DOM元素（当前的input元素）
                // 判断两个密码输入框是否一致
                if (value == $(".personInfo_box .oldPwd").val()) {
                    return "密码一致!"; //弹窗的形式出现在页面上
                }
            },
            // 自定义验证
            newPwd2: function (value, item) { //value 当前使用的input输入框的value值，item，当前DOM元素（当前的input元素）
                // 判断两个密码输入框是否一致
                if (value != $(".personInfo_box .newPwd1").val()) {
                    return "密码不一致!"; //弹窗的形式出现在页面上
                }
            },

        });


        // 监听form表单submit提交
        $(".personInfo_box").on("submit", (event) => {
            let e = event || window.event;
            e.preventDefault();

            // 调用获取对应cookie值的
            let token = cookieFun("token");

            $.ajax({
                method: "post",
                url: "http://www.liulongbin.top:3007/my/updatepwd",
                // 设置请求头
                headers: {
                    Authorization: token || "",
                },
                data: {
                    oldPwd: $(".oldPwd").val(),
                    newPwd: $(".newPwd2").val()
                },
                success: (res) => {
                    console.log(res);
                    layer.msg(res.message);

                    // 如果验证成功，则重新登录
                    if (res.status == 0) {
                        // 清除缓存
                        document.cookie = "token='';Max-Age=0";

                        setTimeout(() => {
                            window.location.href = "http://localhost:3000/api/html/login.html";
                        }, 500);
                    }


                }
            })


        })


    }





























}