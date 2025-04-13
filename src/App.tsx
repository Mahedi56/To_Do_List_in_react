import { useEffect, useState } from "react";
import TodoInput from "./assets/Component/todo-input";
import List_show from "./assets/Component/List_show";
import { nanoid } from "nanoid";
import SignUp from "./assets/Component/SignUp";

type ToDoListData = {
  [id: string]: {
    isCompleted: boolean;
    item: string; 
  };
};

const baseURL = `http://${window.location.hostname}:5001/`; 

const App = () => {
  const [list, setList] = useState<ToDoListData>({});
  const [user, setUser] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingPage, setSigningPage]=useState<boolean>(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      setUser(savedUserId);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchTodos = async () => {
        try {
          const response = await fetch(`${baseURL}todos`, { // ❌ Removed query param
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(user && { "user-id": user }), // ✅ Added user-id in headers
            },
          });
          const data = await response.json();
          const formattedData: ToDoListData = Object.fromEntries(
            data.map(
              (todo: {
                id: string;
                todo_item: string;
                is_completed: boolean;
              }) => [
                todo.id,
                { item: todo.todo_item, isCompleted: todo.is_completed },
              ]
            )
          );
          setList(formattedData);
        } catch (error) {
          console.error("Error fetching todos:", error);
        }
      };

      fetchTodos();
    }
  }, [user]);


  const handleLogin = async () => {
    try {
      const response = await fetch(`${baseURL}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({ email, pass: password }),
      });
      console.log(response);
      console.log(response.headers);
      console.log(response.body);
      const data = await response.json();
      console.log(data);

      if (data.userId) {
        setUser(data.userId);
        localStorage.setItem("userId", data.userId);
        console.log("data.userId",data.userId);
        
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = () => {
    setEmail("");
    setPassword("");
    setUser(null);
    localStorage.removeItem("userId");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };



const handleTodoSubmit = async (inpt: string) => {
  const id = nanoid();
  const newItem = { id, todo_item: inpt, is_completed: false };

  try {
    const response = await fetch(`${baseURL}itemInsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(user && { "user-id": user }),  // ✅ Conditionally add user-id
      },
      body: JSON.stringify(newItem),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setList((prevList) => ({
      ...prevList,
      [data.id]: {
        item: data.todo_item,
        isCompleted: data.is_completed,
      },
    }));
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};

  const handleDeleteItem = async (itemId: string) => {
    try {
      await fetch(`${baseURL}todos/${itemId}`, {
        method: "DELETE",
        headers: {
          ...(user && { "user-id": user }), // ✅ Moves user-id to headers
        },
      });

      setList((prevList) => {
        const newList = { ...prevList };
        delete newList[itemId];
        return newList;
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
};

const handleCrossoutItem = async (itemId: string) => {
    const updatedStatus = !list[itemId].isCompleted;

    try {
      await fetch(`${baseURL}todos/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(user && { "user-id": user }), 
        },
        body: JSON.stringify({ is_completed: updatedStatus }),
      });

      setList((prevList) => ({
        ...prevList,
        [itemId]: {
          ...prevList[itemId],
          isCompleted: updatedStatus,
        },
      }));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
};

const handleSignUp=(userId:string)=>{
  setUser(userId);
  localStorage.setItem("userId", userId);

}

  // return (

  //   <div>
  //     {!user ? ( {signingPage ?(
  //       <SignUp/>
  //      ):
  //      (<div className="Container_login">
          
  //      <form onSubmit={handleLoginSubmit}>
  //        <input
  //          type="email"
  //          placeholder="Email"
  //          onChange={(e) => setEmail(e.target.value)}
  //          value={email}
  //        />
  //        <input
  //          type="password"
  //          placeholder="Password"
  //          onChange={(e) => setPassword(e.target.value)}
  //          value={password}
  //        />
  //        <button type="submit">Login</button>
  //      </form>
  //    </div>}
  //      )
        
  //     ) : (
  //       <div className="Container">
  //         <h1>To Do List</h1>
  //         <button
  //           id="signout"
  //           style={{ cursor: "pointer" }}
  //           onClick={handleLogout}
  //         >
  //           Sign Out
  //         </button>
  //         <List_show
  //           list_item={list}
  //           deletetodo={handleDeleteItem}
  //           strikeTodo={handleCrossoutItem}
  //         />
  //         <TodoInput onSubmit={handleTodoSubmit} />
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div>
      {!user ? (
        signingPage ? (
          <SignUp baseurl={baseURL} handlesignup={handleSignUp}/>
        ) : (
          <div className="Container_login">
            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button type="submit">Login</button>
            </form>
            <span>Have any account? if not then <button type="submit" onClick={()=>setSigningPage(true)}>Sign Up</button> first</span>
          </div>
        )
      ) : (
        <div className="Container">
          <h1>To Do List</h1>
          <button
            id="signout"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            Sign Out
          </button>
          <List_show
            list_item={list}
            deletetodo={handleDeleteItem}
            strikeTodo={handleCrossoutItem}
          />
          <TodoInput onSubmit={handleTodoSubmit} />
        </div>
      )}
    </div>
  );
  
};

export default App;