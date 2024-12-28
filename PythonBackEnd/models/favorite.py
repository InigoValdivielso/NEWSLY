from sqlalchemy import ForeignKey, MetaData, Table, Column
from sqlalchemy.sql.sqltypes import Integer, String
from config.db import meta, engine

meta = MetaData()

favorites = Table("favorites", meta, Column("id", Integer, primary_key=True), Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE")), Column("categoria", String(255), nullable=False))

meta.create_all(engine)