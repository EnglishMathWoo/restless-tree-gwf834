import { TodoContext, EventContext } from "./App";
import { useContext, useRef, useState, useMemo } from "react";
import "./Body.css";

const isLessThanWeekLeft = (dateString) => {
  const date = new Date(dateString);
  const now = new Date(new Date().toLocaleDateString());

  const diffTime = date.getTime() - now.getTime();
  const diffDay = diffTime / (1000 * 60 * 60 * 24);

  return diffDay <= 7 ? "-week-left" : "";
};

function Body() {
  const { todoList } = useContext(TodoContext);
  const { onCreate, onComplete, onDelete, onReset } = useContext(EventContext);
  const [inputValue, setInputvalue] = useState("");
  const [dateValue, setDateValue] = useState(new Date());
  let completedSet = useRef(new Set());

  const maxId = useMemo(() => {
    return Math.max(todoList.map((item) => item.id)) + 1;
  }, [todoList]);

  const sortedTodoList = useMemo(() => {
    return [...todoList].sort(
      (a, b) => new Date(a.deadLine) - new Date(b.deadLine)
    );
  }, [todoList]);

  const onCheckBoxClick = (id, isChecked) => {
    if (isChecked) {
      completedSet.current.add(id);
    } else {
      completedSet.current.delete(id);
    }
  };

  return (
    <>
      {sortedTodoList.map((item) => (
        <div
          key={item.id}
          className={`todo${isLessThanWeekLeft(item.deadLine)}`}
          style={{
            textDecoration: item.isCompleted ? "line-through" : "none",
          }}
        >
          {!item.isCompleted && (
            <input
              type="checkbox"
              onClick={(e) => {
                onCheckBoxClick(item.id, e.target.checked);
              }}
            />
          )}
          {item.content} / {item.deadLine}
          <button
            onClick={() => {
              onDelete(item.id);
            }}
          >
            삭제
          </button>
        </div>
      ))}
      <div className="input">
        <input
          type="text"
          placeholder="할일 추가"
          value={inputValue}
          onChange={(e) => {
            setInputvalue(e.target.value);
          }}
        />
        <input
          type="date"
          value={dateValue}
          onChange={(e) => {
            setDateValue(e.target.value);
          }}
        />
        <button
          type="submit"
          onClick={() => {
            if (!inputValue || !dateValue) return;

            onCreate({
              id: maxId,
              content: inputValue,
              deadLine: dateValue,
              isCompleted: false,
            });

            setInputvalue("");
            setDateValue(new Date());
          }}
        >
          추가
        </button>
      </div>
      <div className="button">
        <button
          onClick={() => {
            onReset();
          }}
        >
          초기화
        </button>
        <button
          onClick={() => {
            onComplete(new Set(completedSet.current));
            completedSet.current.clear();
          }}
        >
          완료
        </button>
      </div>
    </>
  );
}

export default Body;
