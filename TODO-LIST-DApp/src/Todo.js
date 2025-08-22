import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI } from './abi';

const Todo = ({ user }) => {
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    setWallet(await signer.getAddress());
    setContract(contract);
  };

  const fetchTasks = async () => {
    const total = await contract.getTotalTasks();
    const taskList = [];
    for (let i = 0; i < total; i++) {
      const [desc, done] = await contract.getTask(i);
      taskList.push({ desc, done, index: i });
    }
    setTasks(taskList);
  };

  const addTask = async () => {
    const tx = await contract.addTask(input);
    await tx.wait();
    setInput('');
    fetchTasks();
  };

  const markDone = async (index) => {
    const tx = await contract.markCompleted(index);
    await tx.wait();
    fetchTasks();
  };

  useEffect(() => {
    if (window.ethereum) connectWallet();
  }, []);

  useEffect(() => {
    if (contract) fetchTasks();
  }, [contract]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome, {user} 👋</h2>
      <h3>Wallet: {wallet}</h3>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="New task" />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((t, i) => (
          <li key={i}>
            {t.done ? <s>{t.desc}</s> : t.desc}
            {!t.done && <button onClick={() => markDone(t.index)}>✅</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
