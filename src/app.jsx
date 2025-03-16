import {useEffect, useState} from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/register.jsx';


function App() {
  const [message, setMessage] = useState("Loading...");
  const [socketStatus, setSocketStatus] = useState("Disconnected");

  useEffect(() => {
    axios.get("/api/test")
      .then(({ data }) => setMessage(data.message))
      .catch((err) => setMessage("API error: " + err.message));
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => setSocketStatus(`Connected (ID: ${socket.id})`));
    socket.on("disconnect", () => setSocketStatus("Disconnected"));
    return () => socket.disconnect();
  }, []);

  return (
    <Router>
      <h1>Welcome to Hearthstone!</h1>
      <p>API says: {message}</p>
      <p>Socket status: {socketStatus}</p>
      <Routes>
          <Route path='/' element={<p>Hi!</p>} />
          <Route path='/register' element={<Register/>} />
          {/* <Route path=''/> */}
      </Routes>
    </Router>
  );
}

export default App;