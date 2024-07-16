'use client';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import axios from 'axios';
import styles from './DataTable.module.css';

const DataTable: React.FC = () => {
  const todoContext = useContext(TodoContext);

  if (!todoContext) {
    throw new Error('DataTable must be used within a TodoProvider');
  }

  const { todos, loading, deleteTodo } = todoContext;
  const router = useRouter();

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      if (id < 7) {
   
        await axios.delete(`https://dummyjson.com/todos/${id}`);
      }
      deleteTodo(id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleAdd = () => {
    router.push('/add');
  };

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div>
      <button
        onClick={handleAdd}
        className="bg-green-500 text-white p-2 rounded mb-4"
      >
        Add Todo
      </button>
      <table className={styles.table}>
        <thead className="text-black">
          <tr>
            <th>Todo</th>
            <th>User Id</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((item) => (
            <tr key={item.id}>
              <td className="todo-text">{item.todo}</td>
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
