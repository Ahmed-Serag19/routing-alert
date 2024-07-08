'use client';
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from 'react';

interface Todo {
  id: number;
  todo: string;
  userId: string;
}

interface TodoContextProps {
  todos: Todo[];
  loading: boolean;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  updateTodo: (updatedTodo: Todo) => void;
  deleteTodo: (id: number) => void;
  addTodo: (newTodo: Todo) => void;
}

export const TodoContext = createContext<
  TodoContextProps | undefined
>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    const result = await fetch('https://dummyjson.com/todos').then(
      (res) => res.json()
    );
    setTodos(result.todos.slice(0, 6));
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const getNextId = () => {
    const maxId =
      todos.length > 0
        ? Math.max(...todos.map((todo) => todo.id))
        : 0;
    return maxId + 1;
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.filter((todo) => todo.id !== id)
    );
  };

  const addTodo = (newTodo: Todo) => {
    newTodo.id = getNextId(); // Assign a unique ID
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        setTodos,
        updateTodo,
        deleteTodo,
        addTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
