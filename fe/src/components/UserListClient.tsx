import { useEffect, useState } from "react";
import type { User } from "../entities/User";
import { Repository } from "../repositories/backend";
import { useUserStore } from "../store/UserStore";

const isServer = typeof window === "undefined";

const baseURL = isServer ? "http://backend:8000" : "http://localhost:8000";

const userRepo = new Repository<User>("users", baseURL);

interface Props {
  users: User[];
}

export default function UserList({ users: initialUsers }: Props) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const { users, setUsers } = useUserStore();

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers, setUsers]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const fresh = await userRepo.getAll();

        const changed = fresh.filter((newUser) => {
          const existing = users.find((u: User) => u.id === newUser.id);
          return existing && existing.username !== newUser.username;
        });

        if (changed.length > 0) {
          console.log("Username changes detected:", changed);
        }

        setUsers(fresh);
      } catch (err) {
        console.warn("Error refreshing users", err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [users, setUsers]);

  const openModal = (user: User) => {
    setSelectedUser(user);
    setFormData({ username: user.username, password: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setFormData({ username: "", password: "" });
    setModalOpen(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !formData.password.trim()) {
      alert("Password is required.");
      return;
    }

    try {
      const updatedUser = await userRepo.update(selectedUser.id, {
        username: formData.username,
        password: formData.password,
      });

      const newUsers = users.map((u: User) =>
        u.id === updatedUser.id ? updatedUser : u
      );
      setUsers(newUsers);
      closeModal();
    } catch (err: any) {
      alert(err.message ?? "Error updating user");
    }
  };

  return (
    <>
      <ul className="max-w-4xl mx-auto mt-16 bg-white shadow-lg rounded-lg divide-y divide-gray-200">
        {users.map((u: User) => {
          const initial = initialUsers.find((user) => user.id === u.id);
          const usernameChanged = initial && initial.username !== u.username;

          return (
            <li
              key={u.id}
              className="w-full px-6 py-4 flex items-center space-x-8 hover:bg-gray-50 transition"
            >
              <span className="flex-1 text-sm text-gray-400">{u.id}</span>

              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {u.username}
                  {usernameChanged && (
                    <span className="ml-2 text-xs text-red-600">
                      (Previously: {initial?.username})
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">&lt;{u.email}&gt;</p>
              </div>

              <button
                className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                onClick={() => openModal(u)}
              >
                Update
              </button>
            </li>
          );
        })}
      </ul>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Update User</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full border px-3 py-2 rounded"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
