import React, { useState } from 'react';

const Login = ({ setUser }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const stored = localStorage.getItem(name);
    if (stored) {
      if (stored === password) {
        setUser(name);
      } else {
        alert('Wrong password');
      }
    } else {
      localStorage.setItem(name, password);
      setUser(name);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login / Register</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br /><br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br /><br />
      <button onClick={handleLogin}>Submit</button>
    </div>
  );
};

export default Login;
