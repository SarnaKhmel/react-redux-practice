import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async function (_, { rejectWithValue }) {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=20"
      );
      const data = response.json();
      if (!response.ok) throw new Error("Server Error");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodos = createAsyncThunk(
  "todos/deleteTodos",
  async function (id, { rejectWithValue, dispatch }) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Trouble with deleting");
      dispatch(removeTodo({ id }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changeStatus = createAsyncThunk(
  "todos/changeStatus",
  async (id, { rejectWithValue, dispatch, getState }) => {
    const todo = getState().todos.todos.find((todos) => todos.id === id);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            completed: !todo.completed,
          }),
        }
      );
      if (!response.ok) throw new Error("Trouble with changing");
      dispatch(toggleComplete({ id }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTodos = createAsyncThunk(
  "todos/addTodos",
  async (title, { rejectWithValue, dispatch }) => {
    try {
      const todo = {
        title: title,
        userId: 1,
        completed: false,
      };
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(todo),
        }
      );

      const data = await response.json();
      console.log(data);
      console.log(response);
      dispatch(addTodo(data));
      if (!response.ok) throw new Error("Trouble with new item");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const setError = (state, action) => {
  state.status = "rejected";
  state.error = action.payload;
};

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: null,
    error: null,
  },
  reducers: {
    addTodo(state, action) {
      state.todos.push({
        id: new Date().toISOString(),
        title: action.payload.title,
        completed: false,
      });
    },
    toggleComplete(state, action) {
      const toggledTodo = state.todos.find(
        (todo) => todo.id === action.payload.id
      );
      toggledTodo.completed = !toggledTodo.completed;
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
    },
  },
  extraReducers: {
    [fetchTodos.pending]: (state) => {
      state.status = "loading";
      state.error = null;
    },
    [fetchTodos.fulfilled]: (state, action) => {
      state.status = "resolved";
      state.todos = action.payload;
    },
    [fetchTodos.rejected]: setError,
    [deleteTodos.rejected]: setError,
    [changeStatus.rejected]: setError,
    [addTodos.rejected]: setError,
  },
});

export const { addTodo, toggleComplete, removeTodo } = todoSlice.actions;

export default todoSlice.reducer;
