import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

function Navbar() {

const [connected, toggleConnect] = useState(false);
const location = useLocation();

const [connectMessage,setConnectMessage]=useState('Connect');
const [currentAccount, setCurrentAccount]=useState('');

  useEffect(()=>{
    getCurrentWalletConnected();
    addWalletListener();
  })
const getCurrentWalletConnected = async()=>{

  if(typeof window!= "undefined" && typeof window.ethereum !="undefined") {
    try{
      
        const accounts = await window.ethereum.request({method: "eth_accounts"});
        if(accounts.length>0){
          setConnectMessage('Connected');
          setCurrentAccount(accounts[0]);
          
          console.log(accounts[0]);
        }
        else{
          alert("please connect your wallet to load NFTs....")
          console.log("connect to metamask");
        }

    }
    catch(err){
        console.log(err);
    }
  }
  else{
    console.log("metamask is not installed!! please install metamask.")
  }
}
const addWalletListener = async()=>{
  if(typeof window!= "undefined" && typeof window.ethereum !="undefined") {
    window.ethereum.on("accountsChanged",(accounts)=>{
      setCurrentAccount(accounts[0]);
      document.location.reload();
      console.log({currentAccount});
    })
  
  }
  else{
    setCurrentAccount("");
 
    console.log("metamask is not installed!! please install metamask.")
  }
}

const ConnectWallet = async()=>{
  if(typeof window!= "undefined" && typeof window.ethereum !="undefined") {
    try{
        const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
        setConnectMessage('Connected'); 
        setCurrentAccount(accounts[0]);
        toggleConnect(true);
        console.log(accounts[0]);
        document.location.reload();
    }
    catch(err){
        console.log(err);
    }
  }
  else{
    console.log("metamask is not installed!! please install metamask.")
  }
  }

    return (
      <div className="">
       
<nav class="bg-black px-2 sm:px-4 py-2.5  fixed w-full z-20 top-0 left-0 border-b border-gray-200">
  <div class="container flex flex-wrap items-center justify-between mx-auto">
  <a href="#" class="flex items-center">
      <img src="https://img.freepik.com/free-vector/nft-non-fungible-token-concept-with-neon-light-effect_1017-41102.jpg" class="h-6 mr-3 sm:h-9" alt="Flowbite Logo"/>
      <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">NFT MarketPlace</span>
  </a>
  <div class="flex md:order-2">
      <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-green-600 dark:hover:bg-yellow-500 dark:focus:ring-blue-800" onClick={ConnectWallet}>{connectMessage}</button>
      <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
    </button>
  </div>
  <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul class="flex flex-col  mt-4 border border-gray-100 rounded-lg bg-gray-10 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white md:dark:bg-black dark:border-gray-500">
      <li  class="block p-4 text-gray-700 rounded-3xl hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700  md:dark:hover:text-white dark:text-white  dark:hover:bg-gray-700 md:dark:hover:text-black md:dark:hover:bg-yellow-200 dark:border-gray-700" >
        <Link to="/">MarketPlace</Link>
      </li>
      <li class="block p-4 text-gray-700 rounded-3xl hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700  md:dark:hover:text-white dark:text-white  dark:hover:bg-gray-700 md:dark:hover:text-black md:dark:hover:bg-yellow-200 dark:border-gray-700">
        <Link to="/sellNFT">List My NFT</Link>
      </li>
      <li class="block p-4 text-gray-700 rounded-3xl hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700  md:dark:hover:text-white dark:text-white dark:hover:bg-gray-700 md:dark:hover:text-black md:dark:hover:bg-yellow-200 dark:border-gray-700">
        <Link to="/profile">Profile</Link>
      </li>
    </ul>
  </div>
  </div>
</nav>
      </div>
    );
  }

  export default Navbar;