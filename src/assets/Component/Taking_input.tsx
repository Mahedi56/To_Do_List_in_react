import React, { useState } from 'react';

interface TakingInputProps {
    getInput: (inpt: string) => void;
  }
  
  const Taking_input: React.FC<TakingInputProps> = ({ getInput }) => {
      const [val, setval] = useState<string>(""); // Initialize state as an empty string
  
      const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setval(e.target.value);
      };
  
      const handlesubmit = (e: React.FormEvent) => {
          e.preventDefault(); // Prevents the form from reloading the page
          if (val.trim() !== "") {
              getInput(val); // Send the input value to the parent component
              setval(""); // Clear input after submission
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
  
  export default Taking_input;
  