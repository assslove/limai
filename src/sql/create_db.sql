#--数据库脚本
drop table if exists t_info;
create table t_info (
	`id` int auto_increment,
	`type` smallint NOT NULL COMMENT '类型',
	`title` varchar(256) COMMENT '标题', 
	`content` varchar(10240) COMMENT '内容', 
	`pub_time` int unsigned COMMENT '发表时间',
	`author` varchar(64) COMMENT '作者',
	primary key(id)
) Engine=InnoDB, charset=utf8;
insert into t_info values(1, 1,'1','1',1,'1');
insert into t_info values(2, 1,'1','1',1,'1');
insert into t_info values(3, 1,'1','1',1,'1');
insert into t_info values(4, 1,'1','1',1,'1');
insert into t_info values(5, 1,'1','1',1,'1');
