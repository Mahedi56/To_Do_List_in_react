import React, { useState } from "react";

interface TodoInputProps {
  onSubmit: (inpt: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onSubmit }) => {
  const [val, setval] = useState<string>(""); // Initialize state as an empty string

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setval(e.target.value);
  };

  const handlesubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim() !== "") {
      onSubmit(val);
      setval("");
    }
  };

  return (
    <form className="inpttk" onSubmit={handlesubmit}>
      <input
        type="text"
        placeholder="Enter list Items...."
        value={val}
        onChange={handlechange}
      />
    </form>
  );
};

export default TodoInput;
