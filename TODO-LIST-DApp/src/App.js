import React, { useEffect, useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { contractABI } from './abi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        console.log("Environment contract address:", contractAddress);
        
        if (!contractAddress) {
  toast.error("Contract address is missing.");
  return;
}

 
        const contract = new Contract(contractAddress, contractABI, signer);

        console.log("Loaded contract address:", contractAddress); // Debugging

      

        setWalletAddress(address);
        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        toast.success("Wallet connected!");

        fetchTasks(contract);
      } catch (err) {
        toast.error("Connection failed.");
        console.error(err);
      }
    } else {
      toast.error("Please install MetaMask.");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setTasks([]);
    toast.info("Wallet disconnected.");
  };

  const fetchTasks = async (contractRef = contract) => {
    try {
      const total = await contractRef.getTotalTasks();
      const allTasks = [];
      for (let i = 0; i < total; i++) {
        const [desc, completed] = await contractRef.getTask(i);
        allTasks.push({ desc, completed, index: i });
      }
      setTasks(allTasks);
    } catch (err) {
      toast.error("Failed to fetch tasks.");
      console.error(err);
    }
  };

  const addTask = async () => {
    if (!newTask) return;
    try {
      setLoading(true);
      const tx = await contract.addTask(newTask);
      toast.info("Adding task...");
      await tx.wait();
      setNewTask('');
      fetchTasks();
      toast.success("Task added.");
    } catch (err) {
      toast.error("Failed to add task.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (index) => {
    try {
      const tx = await contract.markCompleted(index);
      toast.info("Marking task complete...");
      await tx.wait();
      fetchTasks();
      toast.success("Task completed.");
    } catch (err) {
      toast.error("Failed to complete task.");
      console.error(err);
    }
  };

  /*return (
    <div style={{
      backgroundColor: '#001f3f',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial',
      padding: '40px'
    }}>
      <div style={{
        backgroundColor: '#111',
        color: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <ToastContainer />
        <h1>📝 To-Do DApp</h1>

        {!walletAddress ? (
          <button onClick={connectWallet}>Connect MetaMask Wallet</button>
        ) : (
          <>
            <p><strong>Connected:</strong> {walletAddress}</p>
            <button onClick={disconnectWallet} style={{ marginBottom: '20px' }}>
              Disconnect Wallet
            </button>

            <input
              type="text"
              placeholder="Add a task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              style={{ padding: '5px', width: '70%' }}
            />
            <button onClick={addTask} disabled={loading} style={{ marginLeft: '10px' }}>
              {loading ? <FaSpinner className="spin" /> : 'Add'}
            </button>

           <ul style={{ textAlign: 'left', marginTop: '20px' }}>
  {tasks.map((task, idx) => (
    <li key={idx} style={{
      marginBottom: '15px',
      backgroundColor: '#222',
      padding: '10px',
      borderRadius: '6px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        {task.completed ? (
          <>
            <s>{task.desc}</s>
            <span style={{
              marginLeft: '10px',
              padding: '2px 8px',
              backgroundColor: '#2ecc71',
              color: 'white',
              borderRadius: '5px',
              fontSize: '12px'
            }}>Completed</span>
          </>
        ) : (
          <>
            {task.desc}
            <span style={{
              marginLeft: '10px',
              padding: '2px 8px',
              backgroundColor: '#e67e22',
              color: 'white',
              borderRadius: '5px',
              fontSize: '12px'
            }}>Pending</span>
          </>
        )}
      </div>

      {!task.completed && (
        <select
          onChange={(e) => {
            if (e.target.value === 'yes') completeTask(task.index);
          }}
          defaultValue=""
          style={{
            padding: '5px',
            borderRadius: '5px',
            backgroundColor: '#333',
            color: 'white',
            border: '1px solid #555',
            marginLeft: '10px'
          }}
        >
          <option value="" disabled>
            Mark Completed?
          </option>
          <option value="yes">Yes</option>
        </select>
      )}
    </li>
  ))}
</ul>

          </>
        )}

        <style>{`
          .spin {
            animation: spin 1s linear infinite;
            display: inline-block;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );  */


  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Poppins', sans-serif",
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(13, 17, 28, 0.9)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 1px 3px rgba(255,255,255,0.1) inset',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <ToastContainer />
        <div style={{
          marginBottom: '30px',
          position: 'relative'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <span style={{fontSize: '2.8rem'}}>✓</span> To-Do DApp
          </h1>
          <p style={{
            color: '#a0a0c0',
            fontSize: '1rem',
            margin: '0'
          }}>Manage your tasks on the blockchain</p>
        </div>

        {!walletAddress ? (
          <button 
            onClick={connectWallet}
            style={{
              background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)',
              border: 'none',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 15px rgba(106, 17, 203, 0.4)',
              width: '100%',
              maxWidth: '300px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(106, 17, 203, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 15px rgba(106, 17, 203, 0.4)';
            }}
          >
            Connect MetaMask Wallet
          </button>
        ) : (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              padding: '15px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '12px'
            }}>
              <p style={{margin: '0', fontSize: '0.9rem'}}>
                <strong style={{color: '#4ecdc4'}}>Connected:</strong> 
                <span style={{color: '#a0a0c0', wordBreak: 'break-all'}}> 
                  {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                </span>
              </p>
              <button 
                onClick={disconnectWallet}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ff6b6b',
                  padding: '8px 15px',
                  borderRadius: '50px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255,107,107,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }}
              >
                Disconnect
              </button>
            </div>

            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '30px'
            }}>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                style={{
                  padding: '15px 20px',
                  flex: '1',
                  borderRadius: '50px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.07)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.12)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(78, 205, 196, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.07)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button 
                onClick={addTask} 
                disabled={loading}
                style={{
                  background: loading ? 'rgba(78, 205, 196, 0.5)' : 'linear-gradient(45deg, #4ecdc4 0%, #44a08d 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '15px 25px',
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '110px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 15px rgba(78, 205, 196, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? <><FaSpinner className="spin" /> Adding...</> : 'Add Task'}
              </button>
            </div>

            <ul style={{
              textAlign: 'left',
              marginTop: '20px',
              padding: '0',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {tasks.map((task, idx) => (
                <li key={idx} style={{
                  marginBottom: '15px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: '18px 20px',
                  borderRadius: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255,255,255,0.03)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flex: '1'
                  }}>
                    {task.completed ? (
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #4ecdc4 0%, #44a08d 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: '0'
                      }}>
                        <span style={{color: 'white', fontSize: '14px'}}>✓</span>
                      </div>
                    ) : (
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.3)',
                        flexShrink: '0'
                      }}></div>
                    )}
                    
                    <span style={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'rgba(255,255,255,0.5)' : 'white',
                      flex: '1'
                    }}>
                      {task.desc}
                    </span>
                    
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginLeft: '10px',
                      background: task.completed 
                        ? 'rgba(78, 205, 196, 0.2)' 
                        : 'rgba(255, 107, 107, 0.2)',
                      color: task.completed ? '#4ecdc4' : '#ff6b6b',
                      border: `1px solid ${task.completed ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`
                    }}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>

                  {!task.completed && (
                    <select
                      onChange={(e) => {
                        if (e.target.value === 'yes') completeTask(task.index);
                      }}
                      defaultValue=""
                      style={{
                        padding: '8px 12px',
                        paddingRight: '30px',
                        borderRadius: '50px',
                        background: 'rgba(255,255,255,0.07) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E") no-repeat right 10px center',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)',
                        marginLeft: '15px',
                        appearance: 'none',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.12) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E") no-repeat right 10px center';
                        e.target.style.boxShadow = '0 0 0 2px rgba(78, 205, 196, 0.3)';
                      }}
                      onBlur={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.07) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E") no-repeat right 10px center';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="" disabled>Mark as done?</option>
                      <option value="yes">Yes, complete it</option>
                    </select>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          
          .spin {
            animation: spin 1s linear infinite;
            display: inline-block;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          /* Custom scrollbar */
          ul::-webkit-scrollbar {
            width: 6px;
          }
          
          ul::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
          }
          
          ul::-webkit-scrollbar-thumb {
            background: rgba(78, 205, 196, 0.5);
            border-radius: 10px;
          }
          
          ul::-webkit-scrollbar-thumb:hover {
            background: rgba(78, 205, 196, 0.7);
          }
        `}</style>
      </div>
    </div>
  );
}

export default App;
