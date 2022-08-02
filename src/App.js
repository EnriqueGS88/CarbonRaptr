import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
// ** rename abi
// ** get abi of Toucan Protocol
import offsetHelper from './utils/offsetHelper.json';

// Constants
// Contract for Toucan Offset 
const CONTRACT_ADDRESS = "0xFAFcCd01C395e4542BEed819De61f02f5562fAEa";
// ** delete bldspc

const MY_HANDLE = 'EnriqueGzs'
const TWITTER_ROOT = `https://twitter.com/`;
// ** Delete buildspace, OS and Rarible

const MY_TWITTER = `${TWITTER_ROOT}${MY_HANDLE}`;



// ** rename const
const TOTAL_MINT_COUNT = 100566;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");



  // next must be async fnc
  const checkIfWalletIsConnected = async () => {




    // check if we have access to window.ethereum
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {

      console.log("We have the ethereum object", ethereum);
      // TESTING THIS PART
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, offsetHelper.abi, signer);

      // ** why mintedTokens refers to .name() method
      // ** fix this part with the new contract from Toucan
      let mintedTokens = await connectedContract.contractRegistryAddress();
      console.log(`There has been ${mintedTokens} tokens minted`)


    }


    // check if user is in the right network
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain ", chainId);

    const rinkebyChainId = "0x4";
    if (chainId !== 'rinkebyChainId') {
      alert("In Metamask you need to change your network to Rinkeby");
    }

    // check if we are authorized to access the wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // if user has multiple accts, grab the first one
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("found an authorized account:", account);
      setCurrentAccount(account)

      // Setup listener - for the case where user already had connected their wallet
      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }


  // method to connect wallet to site
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("You need to install Metamask first");
        return;
      }


      // Method to request access to account
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      // Next prints out public address, upon getting authorization
      console.log("Connected ", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! For the user that connects wallet for first time
      setupEventListener();

    } catch (error) {
      console.log(error)
    }
  }

  // Setup Event Listener
  const setupEventListener = async () => {
    // Similar to function askContractToMintNft
    const CONTRACT_ADDRESS = "0xAfa865EEFF351a34950BBC4975222208355640DB";
    try {
      const { ethereum } = window;

      if (ethereum) {
        // same content again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, offsetHelper.abi, signer);

        // here begins the listener, the special part
        // This captures the event when the Contracts throws it
        // similar to webhooks
        // ** update with the new Event in the Toucan contract
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(`NFT minted and sent to your wallet. You can view it also on this link <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`);
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object was not found");
      }


    } catch (error) {
      console.log(error);
    }
  }

  const mintedTokens = async () => {
    const CONTRACT_ADDRESS = "0xAfa865EEFF351a34950BBC4975222208355640DB";


    try {
      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, offsetHelper.abi, signer);
        // ** why are we calling the .name() method again ?
        let mintedTokensAmount = await connectedContract.contractRegistryAddress();
        console.log(`Now there are ${mintedTokensAmount} tokens minted`)

        return mintedTokensAmount;

      } else {
        console.log("ethereum object not found");
      }

    } catch (error) {
      console.log(error);
    }

  }


  // ** update contract address
  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0xAfa865EEFF351a34950BBC4975222208355640DB";
    try {
      const { ethereum } = window;

      if (ethereum) {
        // These gets the signers to send tx
        // More info here https://docs.ethers.io/v5/api/signer/#signers
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        // This interfaces the frontend with the contract
        // only 3 parameters are needed
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, offsetHelper.abi, signer);
        console.log("going to pop wallet now to pay gas...");

        // Polygon contract
        let poolTokenAddress = '0xd838290e877e0188a4a44700463419ed96c16107';
        // Amount of TCO2 to offset
        let amountToOffset = 1;

        let nftTxn = await connectedContract.autoOffsetUsingETH( poolTokenAddress, amountToOffset );

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined at https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("ethereum object does not exist");
      }

    } catch (error) {
      console.log(error);
    }
  }

  // this runs the function when the page loads

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Offset Carbon
    </button>
  )

  return (
    <div className="App">
      <section>
        <header className="layout-header">
          <div className="banner">
            <div className="top-logo">Carbon Raptr</div>
            <div className="sub-banner"></div>
          </div>
        </header>
      </section>
      <section>
        <aside>
          <div class="side-panel">
            <div class="navigation-menu">
              <div>
                <div class="div-icons">
                  <span class="menu-icons">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffb300" class="bi bi-house-door-fill" viewBox="0 0 16 16">
                      <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/></svg>
                  </span>
                </div>
                <div class="menu-option selected-menu-text">Home</div>
              </div>
              <div>
                <div class="div-icons">
                  <span class="menu-icons">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-robot" viewBox="0 0 16 16">
                    <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z"/>
                    <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866ZM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5Z"/></svg>
                  </span>
                </div>
                <div class="menu-option">Automation</div>
              </div>

              
              <div>
                <div class="div-icons">
                  <span class="menu-icons">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-plugin" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a7 7 0 1 1 2.898 5.673c-.167-.121-.216-.406-.002-.62l1.8-1.8a3.5 3.5 0 0 0 4.572-.328l1.414-1.415a.5.5 0 0 0 0-.707l-.707-.707 1.559-1.563a.5.5 0 1 0-.708-.706l-1.559 1.562-1.414-1.414 1.56-1.562a.5.5 0 1 0-.707-.706l-1.56 1.56-.707-.706a.5.5 0 0 0-.707 0L5.318 5.975a3.5 3.5 0 0 0-.328 4.571l-1.8 1.8c-.58.58-.62 1.6.121 2.137A8 8 0 1 0 0 8a.5.5 0 0 0 1 0Z"/></svg>
                  </span>
                </div>
                <div class="menu-option">Connectors</div>
              </div>
              

              
              <div>
                <div class="div-icons">
                  <span class="menu-icons">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-wallet" viewBox="0 0 16 16">
                    <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z"/></svg>
                  </span>
                </div>
                <div class="menu-option">Wallet</div>
              </div>

              
            </div>
          </div>
        </aside>
      </section>
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Carbon Raptr</p>
          <p className="sub-text">Offset your carbon emissions real-time</p>

          {currentAccount === "" ? (
            <button onClick={connectWallet} className="cta-button connect-wallet-button">Connect Wallet</button>
          ) : (
              <button onClick={askContractToMintNft} className="cta-button mint-button">
                Offset Carbon
            </button>
            )}
        </div>
        <p className="sub-text">
          CO2 Emissions Offset YTD:  {mintedTokens}/{TOTAL_MINT_COUNT} Tons
        </p>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={MY_TWITTER}
            target="_blank"
            rel="noreferrer"
          >{`built b`}</a>
          <a
            className="footer-text"
            href={MY_TWITTER}
            target="_blank"
            rel="noreferrer"
          >{`y @${MY_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );

};

export default App;
