import React from "react";
import { MdDeleteSweep } from "react-icons/md";

interface ListShowProps {
  list_item: {
    [id: string]: {
      isCompleted: boolean;
      item: string;
    };
  };
  deletetodo: (task: string) => void;
  strikeTodo: (task: string) => void;
}

const ListShow: React.FC<ListShowProps> = ({
  list_item,
  deletetodo,
  strikeTodo,
}) => {
  const handledelete = (it: string) => {
    deletetodo(it);
  };
  const handlestrikeTodo = (it: string) => {
    strikeTodo(it);
  };
  return (
    <>
      {Object.keys(list_item).map((keyitem) => (
        <li key={keyitem} style={{ display: "flex" }}>
          <input
            type="checkbox"
            checked={list_item[keyitem].isCompleted}
            onChange={() => handlestrikeTodo(keyitem)}
          />
          <span
            style={{
              textDecoration: list_item[keyitem].isCompleted
                ? "line-through"
                : "none",
            }}
          >
            {list_item[keyitem].item}
          </span>
          <MdDeleteSweep
            onClick={() => handledelete(keyitem)}
            style={{ cursor: "pointer" }}
            className="delete_icon"
          />
        </li>
      ))}
    </>
  );
};

export default ListShow;
