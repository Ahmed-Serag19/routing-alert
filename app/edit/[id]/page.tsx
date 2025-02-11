'use client';
import { useState, useEffect, ChangeEvent, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TodoContext } from '../../../context/TodoContext';
import useUnsavedChanges from '../../../utils/useUnsavedChanges';

interface Todo {
  id: number;
  todo: string;
  userId: string;
}

const MAX_TODO_LENGTH = 100;

const EditTodo: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const todoContext = useContext(TodoContext);

  if (!todoContext) {
    throw new Error('EditTodo must be used within a TodoProvider');
  }

  const { todos, updateTodo } = todoContext;
  const [todo, setTodo] = useState<Todo | null>(null);
  const [errors, setErrors] = useState<{
    todo?: string;
    userId?: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useUnsavedChanges(unsavedChanges);

  useEffect(() => {
    const selectedTodo = todos.find((todo) => todo.id === Number(id));
    if (selectedTodo) {
      setTodo(selectedTodo);
      setLoading(false);
    }
  }, [id, todos]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUnsavedChanges(true);
    const { name, value } = e.target;
    setTodo((prevTodo) =>
      prevTodo ? { ...prevTodo, [name]: value } : null
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

    // Max length validation
    if (name === 'todo' && value.length > MAX_TODO_LENGTH) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        todo: `Todo cannot exceed ${MAX_TODO_LENGTH} characters`,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { todo?: string; userId?: string } = {};
    if (!todo?.todo.trim()) {
      newErrors.todo = 'Todo is required';
    }
    if (todo && todo.todo && todo.todo.length > MAX_TODO_LENGTH) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        todo: `Todo cannot exceed ${MAX_TODO_LENGTH} characters`,
      }));
    }
    if (!String(todo?.userId).trim()) {
      newErrors.userId = 'User ID is required';
    }
    return newErrors;
  };

  const handleSave = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0 && todo) {
      updateTodo(todo);
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
            maxLength={MAX_TODO_LENGTH}
            required
          />
          {errors.todo && (
            <p className="text-red-500">{errors.todo}</p>
          )}
        </div>
        <div className="mb-4 text-blac">
          <label htmlFor="userId">User Id</label>
          <input
            type="text"
            name="userId"
            value={todo?.userId || ''}
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

export default EditTodo;
