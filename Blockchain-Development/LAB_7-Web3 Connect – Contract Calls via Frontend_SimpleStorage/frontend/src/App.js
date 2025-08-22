import React, { useEffect, useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { SimpleStorageABI } from './abi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [storedValue, setStoredValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const network = await provider.getNetwork();
        console.log("Connected to network:", network);


        if (!contractAddress) {
          toast.error("Contract address is missing.");
          return;
        }

        const contract = new Contract(contractAddress, SimpleStorageABI, signer);

        setWalletAddress(address);
        setProvider(provider);
        setSigner(signer);
        setContract(contract);

        toast.success("Wallet connected!");
        fetchStoredValue(contract);
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
    setStoredValue(null);
    toast.info("Wallet disconnected.");
  };

  const fetchStoredValue = async (contractRef = contract) => {
    try {
      if (!contractRef) {
        console.error("Contract is not initialized!");
        toast.error("Contract is not initialized.");
        return;
      }

      console.log("Calling contract.get()...");
      const value = await contractRef.get();
      console.log("Value from contract:", value.toString());

      setStoredValue(value.toString());
    } catch (err) {
      toast.error("Failed to fetch data from contract.");
      console.error("Detailed fetch error:", err);
    }
  };


  const handleSet = async () => {
    if (contract && inputValue) {
      try {
        setLoading(true);
        const tx = await contract.set(inputValue);
        toast.info("Transaction submitted...");
        await tx.wait(); // wait for confirmation
        setInputValue('');
        toast.success("Value updated successfully!");
        fetchStoredValue();
      } catch (err) {
        toast.error("Transaction failed.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      backgroundColor: '#001f3f',  // Dark blue background
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial',
      padding: '40px'
    }}>
      <div style={{
        backgroundColor: '#111',  // Black/dark body
        color: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <ToastContainer />
        <h1>🔐 Simple Storage DApp</h1>

        {!walletAddress ? (
          <button onClick={connectWallet}>Connect MetaMask Wallet</button>
        ) : (
          <>
            <p><strong>Connected:</strong> {walletAddress}</p>
            <button onClick={disconnectWallet} style={{ marginBottom: '20px' }}>
              Disconnect Wallet
            </button>
            <p><strong>Stored Value:</strong> {storedValue}</p>
            <input
              type="number"
              placeholder="Enter new value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ padding: '5px', width: '70%' }}
            />
            <button onClick={handleSet} disabled={loading} style={{ marginLeft: '10px' }}>
              {loading ? <FaSpinner className="spin" /> : 'Update'}
            </button>
            <br /><br />
            <button onClick={() => fetchStoredValue()}>
              🔄 Retrieve Latest Data
            </button>
          </>
        )}

        {/* Spinner animation style */}
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

  );
}

export default App;