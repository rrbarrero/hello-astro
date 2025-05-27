import json
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


def load_db() -> dict[str, User]:
    with open("be/users.json", "r") as f:
        data = json.load(f)
        return {user["id"]: User(**user) for user in data}


@app.get("/users/", response_model=list[User])
def list_users():
    return list(load_db().values())


@app.get("/users/{user_id}/", response_model=User)
def get_user(user_id: str):
    return load_db()[user_id]


@app.post("/users/", response_model=User)
def create_user(user: User):
    user = load_db()[user.id] = user
    return user


@app.put("/users/{user_id}/", response_model=User)
def update_user(user_id: str, user_data: UpdateUser):
    user = load_db()[user_id]
    user.username = user_data.username
    user.password = user_data.password
    return user


@app.delete("/users/{user_id}/")
def delete_user(user_id: str):
    load_db().pop(user_id, None)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
