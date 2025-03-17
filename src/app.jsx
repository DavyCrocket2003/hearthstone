import {useEffect, useState} from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/register.jsx';
import Login from './pages/login.jsx';
import Collection from './pages/collection.jsx';
import Play from './pages/play.jsx';
import Profile from './pages/profile.jsx';


function App() {
  const [message, setMessage] = useState("Loading...");
  const [socketStatus, setSocketStatus] = useState("Disconnected");

  useEffect(() => {
    axios.get("/api/test")
      .then(({ data }) => setMessage(data.message))
      .catch((err) => setMessage("API error: " + err.message));
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL);
    socket.on("connect", () => setSocketStatus(`Connected (ID: ${socket.id})`));
    socket.on("disconnect", () => setSocketStatus("Disconnected"));
    return () => socket.disconnect();
  }, []);

  const homeElement = (
    <div>
      <h1>Welcome to Hearthstone!</h1>
      <p>API says: {message}</p>
      <p>Socket status: {socketStatus}</p>
    </div>
  );
  

  return (
    <Router>
      <div>
        <Link to="/play">Play</Link>
        <Link to="/collection">Collection</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <Routes>
          <Route path='/' element={homeElement} />
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/play' element={<Play/>} />
          <Route path='/collection' element={<Collection/>} />
          <Route path='/profile' element={<Profile/>} />
      </Routes>
    </Router>
  );
}

export default App;