import { useState } from "react";
import axios from "axios";

function Register() {
  const [registrationUsername, setRegistrationUsername] = useState("");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [registrationPassword, setRegistrationPassword] = useState("");
  const [registrationPasswordCheck, setRegistrationPasswordCheck] = useState("");


  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    // Check if the passwords match
    if (registrationPassword!==registrationPasswordCheck) {    // Can add other validation here
        alert('The passwords do not match');
        return null;
    }

    // Send Post request for registration
    const registerData = {
        username: registrationUsername,
        email: registrationEmail,
        password: registrationPassword
    }
    await axios.post('/register', registerData).then((res) => {
        if (!res.success) {
            alert(res.message)
        } else {
            alert('Registration successful. You may now login to your account.')
            // Navigate to '/'
        }
    })

  }




  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={registrationUsername} onChange={(e) => setRegistrationUsername(e.target.value)}/>
        </label>
        <label>
          Email:
          <input type="email" value={registrationEmail} onChange={(e) => setRegistrationEmail(e.target.value)}/>
        </label>
        <label>
          Password:
          <input type="password" value={registrationPassword} onChange={(e) => setRegistrationPassword(e.target.value)}/>
        </label>
        <label>
          Confirm Password:
          <input type="password" value={registrationPasswordCheck} onChange={(e) => setRegistrationPasswordCheck(e.target.value)}/> 
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}


export default Register