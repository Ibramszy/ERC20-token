import { useState, useEffect } from "react";
import { ethers } from "ethers";
import tokenABI from "../artifacts/contracts/IbramizyToken.sol/IbramizyToken.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(0);
  const [totalSupply, setTotalSupply] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = async (account) => {
    if (account.length > 0) {
      console.log("Account connected: ", account[0]);
      setAccount(account[0]);
      checkOwner(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const checkOwner = async (userAccount) => {
    if (token) {
      const owner = await token.owner();
      setIsOwner(owner.toLowerCase() === userAccount.toLowerCase());
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // Once wallet is set, we can get a reference to our deployed contract
    getTokenContract();
  };

  const getTokenContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
      contractAddress,
      tokenABI.abi,
      signer
    );

    setToken(tokenContract);
  };

  const getTokenDetails = async () => {
    if (token) {
      const name = await token.name();
      const symbol = await token.symbol();
      const decimals = await token.decimals();
      const totalSupply = await token.totalSupply();

      setName(name);
      setSymbol(symbol);
      setDecimals(decimals);
      setTotalSupply(ethers.utils.formatUnits(totalSupply, decimals));
    }
  };

  const getBalance = async () => {
    if (token && account) {
      const balance = await token.balanceOf(account);
      setBalance(ethers.utils.formatUnits(balance, decimals));
    }
  };

  const mintTokens = async () => {
    if (token && isOwner) {
      const amount = ethers.utils.parseUnits("10", decimals); // Example amount to mint (10 tokens)
      let tx = await token.mint(account, amount);
      await tx.wait();
      getBalance();
    } else {
      alert("Only the owner can mint tokens");
    }
  };

  const burnTokens = async () => {
    if (token) {
      const amount = ethers.utils.parseUnits("10", decimals); // Example amount to burn (10 tokens)
      let tx = await token.burn(amount);
      await tx.wait();
      getBalance();
    }
  };

  const transferTokens = async (recipient, amount) => {
    if (token) {
      const transferAmount = ethers.utils.parseUnits(amount, decimals);
      let tx = await token.transfer(recipient, transferAmount);
      await tx.wait();
      getBalance();
    }
  };

  const handleTransfer = () => {
    const recipient = prompt("Enter recipient address:");
    const amount = prompt("Enter amount to transfer:");
    if (recipient && amount) {
      transferTokens(recipient, amount);
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this feature.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount} className="btn connect-btn">
          Connect your MetaMask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getTokenDetails();
      getBalance();
    }

    return (
      <div className="token-info">
        <h2>Token Information</h2>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Symbol:</strong> {symbol}
        </p>
        <p>
          <strong>Decimals:</strong> {decimals}
        </p>
        <p>
          <strong>Total Supply:</strong> {totalSupply} {symbol}
        </p>
        <p>
          <strong>Your Balance:</strong> {balance} {symbol}
        </p>
        {isOwner && (
          <button onClick={mintTokens} className="btn mint-btn">
            Mint 10 {symbol}
          </button>
        )}
        <button onClick={handleTransfer} className="btn transfer-btn">
          Transfer Tokens
        </button>
        <button onClick={burnTokens} className="btn burn-btn">
          Burn 10 {symbol}
        </button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Ibramizy Token App!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          padding: 20px;
          background-color: #f5f5f5;
        }

        header h1 {
          color: #333;
        }

        .token-info {
          margin: 20px auto;
          padding: 20px;
          max-width: 600px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .token-info h2 {
          margin-bottom: 15px;
        }

        .token-info p {
          margin: 10px 0;
          font-size: 16px;
          color: #555;
        }

        .btn {
          padding: 10px 20px;
          margin: 10px;
          border: none;
          border-radius: 5px;
          color: #fff;
          cursor: pointer;
          font-size: 16px;
        }

        .connect-btn {
          background-color: #007bff;
        }

        .mint-btn {
          background-color: #28a745;
        }

        .burn-btn {
          background-color: #dc3545;
        }

        .transfer-btn {
          background-color: #17a2b8;
        }
      `}</style>
    </main>
  );
}
