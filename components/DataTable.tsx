'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from './DataTable.module.css';

interface Todo {
  id: number;
  todo: string;
  userId: string;
}

const DataTable = () => {
  const [data, setData] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    const result = await axios.get('https://dummyjson.com/todos');
    setData(result.data.todos.slice(0, 6));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`https://dummyjson.com/todos/${id}`);
    setData(data.filter((item) => item.id !== id));
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
              <td>{item.todo}</td>
              <td>{item.userId}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
