import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addTodo, fetchTodos } from "./store/todoSlice";
import NewTodoForm from "./components/NewTodoForm";
import TodoList from "./components/TodoList";
import { addTodos } from "./store/todoSlice";

import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAction = () => {
    if (title.trim().length) {
      dispatch(addTodos(title));
      setTitle("");
    }
  };

  return (
    <div className="App">
      <NewTodoForm
        value={title}
        updateText={setTitle}
        handleAction={handleAction}
      />

      {status === "loading" && <h2>Loading...</h2>}
      {error && <h2>{error}</h2>}
      <TodoList />
    </div>
  );
}

export default App;
