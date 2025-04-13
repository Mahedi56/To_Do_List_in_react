import React, { useState } from "react";

const SignUp = ({baseurl,handlesignup}:{baseurl:string,handlesignup:(userId:string)=>void}) => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseurl}signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        console.log(data.message); 
        handlesignup(data.userId);
      } else {
        alert(data.error? data.error: "Something went wrong. Please try again."); 
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div id="signup-container">
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
        </div>

        <div className="input-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={lastName}onChange={(e) => setLastName(e.target.value)} required/>
        </div>

        <div className="input-group">
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
