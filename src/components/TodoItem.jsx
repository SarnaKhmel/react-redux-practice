import { useDispatch } from "react-redux";
// import { toggleComplete, removeTodo } from "../store/todoSlice";
import { toggleComplete } from "../store/todoSlice";
import { changeStatus, deleteTodos } from "../store/todoSlice";
const TodoItem = ({ id, title, completed }) => {
  const dispatch = useDispatch();

  return (
    <li>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => dispatch(changeStatus(id))}
      />
      <span>{title}</span>
      <span onClick={() => dispatch(deleteTodos(id))}>&times;</span>
    </li>
  );
};

export default TodoItem;
