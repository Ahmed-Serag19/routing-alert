'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import useUnsavedChanges from '../../../utils/useUnsavedChanges';

interface Todo {
  id: number;
  todo: string;
  userId: string;
}

const EditTodo = () => {
  const router = useRouter();
  const { id } = useParams();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useUnsavedChanges(unsavedChanges);

  useEffect(() => {
    const fetchTodo = async () => {
      if (id) {
        const result = await axios.get(
          `https://dummyjson.com/todos/${id}`
        );
        setTodo(result.data);
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUnsavedChanges(true);
    const { name, value } = e.target;
    setTodo({ ...todo, [name]: value } as Todo);
  };

  const handleSave = async () => {
    if (todo) {
      await axios.put(`https://dummyjson.com/todos/${todo.id}`, todo);
      setUnsavedChanges(false);
      router.push('/');
    }
  };

  return loading ? (
    <p className="text-center mt-10">Loading...</p>
  ) : (
    <div className="flex bg-black items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl text-black font-bold mb-4 text-center">
          Edit Todo
        </h1>
        <div className="mb-4 text-black">
          <label htmlFor="todo">Todo</label>
          <input
            type="text"
            name="todo"
            value={todo?.todo || ''}
            onChange={handleInputChange}
            className="w-full p-2 border text-black border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="userId"
            value={todo?.userId || ''}
            onChange={handleInputChange}
            className="w-full text-black p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditTodo;
