from sqlalchemy import MetaData, Table, Column
from sqlalchemy.sql.sqltypes import Integer, String
from config.db import meta, engine

meta = MetaData()

users = Table("users", meta, Column("id", Integer, primary_key=True), Column("username", String(255)), Column("email", String(255)), Column("password", String(255)))

meta.create_all(engine)