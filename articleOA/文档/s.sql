use test2;

create table uInfo (
	uId int primary key auto_increment,  -- id
	uName VARCHAR(20) not null UNIQUE,  -- 账号
	pwd VARCHAR(20) not null,		-- 密码
	`idStatus` int DEFAULT 0,		-- 用户状态
	email VARCHAR(30) , -- 邮箱
	nickName varchar(20) ,  -- 昵称
	avatar VARCHAR(30)			-- 头像
	
);

INSERT into uInfo (uName,pwd) values
("admin","123456")

select * from uInfo;
desc uInfo;

drop table uInfo;




-- 文章表
CREATE table article(

	aId int primary key auto_increment,
	aName VARCHAR(20) UNIQUE not null,  -- 文章名
	aType VARCHAR(20) not null, -- 文章类型
	aTime DATETIME not null, -- 添加时间
	aClick int not null  -- 访问次数
	
);

insert into article values
(default,"唐wo2","奇趣事","2019-04-13",3),
(default,"唐撒3","会生活","2019-04-27",3),
(default,"唐wo4","奇趣事","2019-05-13",3),
(default,"唐撒5","会生活","2019-05-27",3),
(default,"唐wo6","奇趣事","2019-05-13",3),
(default,"唐撒7","会生活","2019-05-27",3),
(default,"唐wo8","奇趣事","2019-05-13",3),
(default,"唐撒9","会生活","2019-05-27",3),
(default,"唐wo12","奇趣事","2019-04-13",3),
(default,"唐撒13","会生活","2019-04-27",3),
(default,"唐wo14","奇趣事","2019-05-13",3),
(default,"唐撒15","会生活","2019-05-27",3),
(default,"唐wo16","奇趣事","2019-05-13",3),
(default,"唐撒17","会生活","2019-05-27",3),
(default,"唐wo18","奇趣事","2019-05-13",3),
(default,"唐撒19","会生活","2019-05-27",3);



SELECT * from article

select * from article WHERE aTime >= "2019-04" and aTime<="2019-05";

-- 获取每个类型的文章，有多少数量
select COUNT(*) 文章数量,aType 文章类型 from article GROUP BY aType

select aType,aTime,aClick from article ;


-- 查询文章总数
select count(*) txtSum from article;

-- 查询该天的文章总数
select count(*) from article where aTime = "2019-04-27";


desc article;

drop table article;




-- 评论表
create table commentInfo(
	cId int primary key auto_increment,  -- id
	cCont VARCHAR(100) not NULL, -- 文章内容
	cTime datetime not NULL  -- 评论时间
);

select * from commentInfo;

-- 评论总数
select count(*) from commentInfo

-- 查询该天的评论总数
select * from commentInfo where cTime >= "2022-04-02 00:00:00"

and cTime < "2022-04-03 00:00:00";


 


