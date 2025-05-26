from uuid import uuid4
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class User(BaseModel):
    id: str
    username: str
    email: str
    password: str


fake_db: dict[int, User] = {
    1: User(
        id=str(uuid4()),
        username="john_doe",
        email="mail1@gmail.com",
        password="password123",
    ),
    2: User(
        id=str(uuid4()),
        username="jane_doe",
        email="prop2@gmail.com",
        password="password456",
    ),
}


@app.get("/users/", response_model=list[User])
def list_users():
    return list(fake_db.values())


@app.get("/users/{user_id}/", response_model=User)
def get_user(user_id: int):
    return fake_db[user_id]


@app.post("/users/", response_model=User)
def create_user(user: User):
    user = fake_db[len(fake_db) + 1] = user
    return user


@app.put("/users/{user_id}/", response_model=User)
def update_user(user_id: int, user: User):
    fake_db[user_id] = user
    return user


@app.delete("/users/{user_id}/")
def delete_user(user_id: int):
    fake_db.pop(user_id, None)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
