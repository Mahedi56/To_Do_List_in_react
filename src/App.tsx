import { useState } from "react";
import Taking_input from "./assets/Component/Taking_input";
import List_show from "./assets/Component/List_show";

const App = () => {
  const [list, setlist] = useState<string[]>([]);
  const getInput = (inpt: string) => {
    setlist([...list, inpt]);
  };

  const handleDeleteItem = (itemToDelete: string) => {
    setlist(list.filter((item) => item !== itemToDelete)); // Update the list state
  };
  return (
    <div className="Container">
      <h1>To Do List </h1>
      <List_show list_item={list} deletetodo={handleDeleteItem}/>
      <ul>
        <Taking_input getInput={getInput}  />
      </ul>
    </div>
  );
};

export default App;