#!/bin/bash

for i in `seq 0 300`
do
	mysql -uroot -p8459328 limai -e "insert into t_info(type, title, content, pub_time, author, from_type) values(201,'测试1', '测试内容', 11231313231, 'test', 0)";
done
