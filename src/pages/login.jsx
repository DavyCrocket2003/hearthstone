import { useState } from "react";
import axios from "axios";

function Login() {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/loginUsername', {username: loginUsername, password: loginPassword}).then(({data}) => {
        alert(data.message)
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)}/>
        </label>
        <label>
          Password:
          <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/>
        </label>
        <button type="submit">Login</button>
      </form>
      
    </div>
  )
}

export default Login;
