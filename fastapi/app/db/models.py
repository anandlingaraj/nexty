from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    name = Column(String)
    chats = relationship("Chat", back_populates="user")

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    messages = relationship("Message", back_populates="chat")
    user = relationship("User", back_populates="chats")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    content = Column(String)
    role = Column(String)  # 'user' or 'assistant'
    created_at = Column(DateTime, server_default=func.now())
    chat = relationship("Chat", back_populates="messages")