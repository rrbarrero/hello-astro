import { useEffect, useState } from "react";
import type { User } from "../entities/User";
import { Repository } from "../repositories/backend";

const userRepo = new Repository<User>("users", "http://localhost:8000/");

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ username: "", password: "" });

  useEffect(() => {
    userRepo
      .getAll()
      .then(setUsers)
      .catch((err) => {
        setErrorMsg(
          err.message ?? "Unknown error occurred while fetching users."
        );
      });
  }, []);

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
    if (!selectedUser) return;

    try {
      const updatedUser = await userRepo.update(selectedUser.id, {
        username: formData.username,
        password: formData.password || undefined,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      closeModal();
    } catch (err: any) {
      alert(err.message ?? "Error updating user");
    }
  };

  if (errorMsg) {
    return (
      <div className="mt-16 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {errorMsg}
      </div>
    );
  }

  return (
    <>
      <ul className="max-w-4xl mx-auto mt-16 bg-white shadow-lg rounded-lg divide-y divide-gray-200">
        {users.map((u) => (
          <li
            key={u.id}
            className="w-full px-6 py-4 flex items-center space-x-8 hover:bg-gray-50 transition"
          >
            <span className="flex-1 text-sm text-gray-400">{u.id}</span>

            <div className="flex-1">
              <p className="font-semibold text-gray-900">{u.username}</p>
              <p className="text-sm text-gray-500">&lt;{u.email}&gt;</p>
            </div>

            <button
              className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
              onClick={() => openModal(u)}
            >
              Update
            </button>
          </li>
        ))}
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
