'use client';
import { useState, ChangeEvent, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TodoContext } from '../context/TodoContext';
import useUnsavedChanges from '../utils/useUnsavedChanges';

interface Todo {
  id: number;
  todo: string;
  userId: string;
}

const AddTodo: React.FC = () => {
  const router = useRouter();
  const todoContext = useContext(TodoContext);

  if (!todoContext) {
    throw new Error('AddTodo must be used within a TodoProvider');
  }

  const { addTodo } = todoContext;
  const [todo, setTodo] = useState<Todo>({
    id: 0,
    todo: '',
    userId: '',
  });
  const [errors, setErrors] = useState<{
    todo?: string;
    userId?: string;
  }>({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state to handle saving

  useUnsavedChanges(unsavedChanges);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUnsavedChanges(true);
    const { name, value } = e.target;
    setTodo({ ...todo, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear error on change
  };

  const validateForm = () => {
    const newErrors: { todo?: string; userId?: string } = {};
    if (!todo.todo.trim()) {
      newErrors.todo = 'Todo is required';
    }
    if (!todo.userId.trim()) {
      newErrors.userId = 'User ID is required';
    }
    return newErrors;
  };

  const handleSave = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      const newTodo = { ...todo, id: Date.now() };
      addTodo(newTodo);
      setUnsavedChanges(false);
      setIsSaving(true);
    } else {
      setErrors(formErrors);
    }
  };

  useEffect(() => {
    if (!unsavedChanges && isSaving) {
      router.push('/');
    }
  }, [unsavedChanges, isSaving, router]);

  return (
    <div className="flex bg-black items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl text-black font-bold mb-4 text-center">
          Add Todo
        </h1>
        <div className="mb-4 text-black">
          <label htmlFor="todo">Todo</label>
          <input
            type="text"
            name="todo"
            value={todo.todo}
            onChange={handleInputChange}
            className="w-full p-2 border text-black border-gray-300 rounded mt-1"
            required
          />
          {errors.todo && (
            <p className="text-red-500">{errors.todo}</p>
          )}
        </div>
        <div className="mb-4 text-black">
          <label htmlFor="userId">User Id</label>
          <input
            type="text"
            name="userId"
            value={todo.userId}
            onChange={handleInputChange}
            className="w-full text-black p-2 border border-gray-300 rounded mt-1"
            required
          />
          {errors.userId && (
            <p className="text-red-500">{errors.userId}</p>
          )}
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

export default AddTodo;
