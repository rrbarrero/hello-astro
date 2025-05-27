from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class User(BaseModel):
    id: str
    username: str
    email: str
    password: str


class UpdateUser(BaseModel):
    username: str
    password: str


user1_id = "492280ce-d1ed-442e-a5f8-789fe00553c3"
user2_id = "9ac5f687-a128-40dc-948e-7a554254e54a"


fake_db: dict[str, User] = {
    user1_id: User(
        id=user1_id,
        username="john_doe",
        email="mail1@gmail.com",
        password="password123",
    ),
    user2_id: User(
        id=user2_id,
        username="jane_doe",
        email="prop2@gmail.com",
        password="password456",
    ),
}


@app.get("/users/", response_model=list[User])
def list_users():
    return list(fake_db.values())


@app.get("/users/{user_id}/", response_model=User)
def get_user(user_id: str):
    return fake_db[user_id]


@app.post("/users/", response_model=User)
def create_user(user: User):
    user = fake_db[user.id] = user
    return user


@app.put("/users/{user_id}/", response_model=User)
def update_user(user_id: str, user_data: UpdateUser):
    user = fake_db[user_id]
    user.username = user_data.username
    user.password = user_data.password
    return user


@app.delete("/users/{user_id}/")
def delete_user(user_id: str):
    fake_db.pop(user_id, None)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
