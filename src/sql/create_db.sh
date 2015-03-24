#!/bin/bash

# 管理数据库信息配置
# ============================================

DB_IP='127.0.0.1'         # 数据库IP
DB_PORT=3306                # 数据库端口
DB_USER=root          # 数据库用户名
DB_PSWD=8459328              # 数据库用户密码
DB_NAME=limai          # 数据库名

create_db_sql="create database if not exists ${DB_NAME}"
mysql -h${DB_IP} -P${DB_PORT} -u${DB_USER} -p${DB_PSWD} -e "$create_db_sql"

mysql -h${DB_IP} -P${DB_PORT} -u${DB_USER} -p${DB_PSWD} ${DB_NAME} < create_db.sql
