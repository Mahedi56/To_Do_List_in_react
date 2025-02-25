import React, { useState } from "react";
import { MdDeleteSweep } from "react-icons/md";

interface ListShowProps {
  list_item: string[];
  deletetodo: (task: string) => void;
}

const List_show: React.FC<ListShowProps> = ({ list_item,deletetodo }) => {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(list_item.length).fill(false));
  
  const handlechange = (index: number) => {
    const newCheckedItems = [...checkedItems]; 
    newCheckedItems[index] = !newCheckedItems[index]; 
    setCheckedItems(newCheckedItems); 
  };
  const handledelete = (it:string) => {
    deletetodo(it);
  };
  return (
    <>
      {list_item.map((list, index) => (
        <li key={index} style={{ display: "flex" }}>
          <input 
            type="checkbox" 
            checked={checkedItems[index]} 
            onChange={() => handlechange(index)} 
          />
          <p style={{ textDecoration: checkedItems[index] ? "line-through" : "none" }}>
            {list}
          </p>
          <MdDeleteSweep onClick={()=>handledelete(list)} style={{ cursor: "pointer" }} className="delete_icon"/>
          </li>
      ))}
    </>
  );
};

export default List_show;
