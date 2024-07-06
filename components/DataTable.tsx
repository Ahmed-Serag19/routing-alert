'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import styles from './DataTable.module.css';
import useUnsavedChanges from '../utils/useUnsavedChanges';

interface Todo {
  id: number;
  todo: string;
  userId: string;
}

const DataTable = () => {
  const [data, setData] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Todo>({
    id: 0,
    todo: '',
    userId: '',
  });
  const [loading, setLoading] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useUnsavedChanges(unsavedChanges);

  const fetchData = async () => {
    const result = await axios.get('https://dummyjson.com/todos');
    setData(result.data.todos.slice(0, 6));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    await axios.delete(`https://dummyjson.com/todos/${id}`);
    setData(data.filter((item) => item.id !== id));
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    const todo = data.find((item) => item.id === id);
    if (todo) setEditedData(todo);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUnsavedChanges(true);
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = async () => {
    setData(
      data.map((item) => (item.id === editingId ? editedData : item))
    );
    setEditingId(null);
    setUnsavedChanges(false);
  };

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div>
      <table className={styles.table}>
        <thead className="text-black">
          <tr>
            <th>Todo</th>
            <th>User Id</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>
                {editingId === item.id ? (
                  <input
                    type="text"
                    name="todo"
                    value={editedData.todo}
                    className={`${styles.input} ${styles.textBlack} w-full`}
                    onChange={handleInputChange}
                  />
                ) : (
                  item.todo
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <input
                    type="text"
                    name="userId"
                    className={`${styles.input} ${styles.textBlack} w-12`}
                    value={editedData.userId}
                    onChange={handleInputChange}
                  />
                ) : (
                  item.userId
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <div className="flex ">
                    <button
                      onClick={handleSave}
                      className={styles.button}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className={`${styles.button} ${styles.cancelButton}`}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className={`${styles.flex} ${styles.gap6}`}>
                    <button
                      onClick={() => handleEdit(item.id)}
                      className={styles.button}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={styles.button}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
