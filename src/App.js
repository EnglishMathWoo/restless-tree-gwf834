import "./styles.css";
import Header from "./Header.jsx";
import Body from "./Body.jsx";
import { useEffect, useState, createContext, useReducer } from "react";

let mockData = [
  {
    id: 1,
    content: "주간회의 자료",
    deadLine: new Date().toLocaleDateString(),
    isCompleted: false,
  },
  {
    id: 2,
    content: "고도화 회의용 PC 수령",
    deadLine: new Date("2025-04-09").toLocaleDateString(),
    isCompleted: false,
  },
  {
    id: 3,
    content: "카카오페이 테스트",
    deadLine: new Date("2025-04-19").toLocaleDateString(),
    isCompleted: false,
  },
];

const reducer = (item, action) => {
  switch (action.type) {
    case "create":
      return [...item, { ...action.newTodo }];
    case "complete":
      return item.map((val) =>
        action.completedSet.has(val.id)
          ? { ...val, isCompleted: true }
          : { ...val }
      );
    case "delete":
      return item.filter((val) => val.id != action.id);
    case "reset":
      return mockData;
    default:
      return [...item];
  }
};

export const TodoContext = createContext();
export const EventContext = createContext();

function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [todoList, dispatch] = useReducer(reducer, mockData);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onCreate = (newTodo) => {
    dispatch({
      type: "create",
      newTodo: newTodo,
    });
  };

  const onComplete = (completedSet) => {
    dispatch({
      type: "complete",
      completedSet: completedSet,
    });
  };

  const onDelete = (id) => {
    dispatch({
      type: "delete",
      id: id,
    });
  };

  const onReset = () => {
    dispatch({
      type: "reset",
    });
  };

  return (
    <>
      <TodoContext.Provider value={{ todoList: todoList }}>
        <EventContext.Provider
          value={{
            onCreate: onCreate,
            onComplete: onComplete,
            onDelete: onDelete,
            onReset: onReset,
          }}
        >
          <Header title={"TODO"} time={time} />
          <Body />
        </EventContext.Provider>
      </TodoContext.Provider>
    </>
  );
}

export default App;
