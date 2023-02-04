import logo from '../logo_3.png';
import fullLogo from '../full_logo.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

function Navbar() {

const [connected, toggleConnect] = useState(false);
const location = useLocation();
//const [currAddress, updateAddress] = useState('0x');
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
          // dispatch(chainActions.setConnectMessage('Connected'));
          // dispatch(chainActions.setCurrentAccount(accounts[0]));
          console.log(accounts[0]);
        }
        else{
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
     // dispatch(chainActions.setCurrentAccount(accounts[0]));
      console.log({currentAccount});
    })
  
  }
  else{
    setCurrentAccount("");
    //dispatch(chainActions.setCurrentAccount(""));
    console.log("metamask is not installed!! please install metamask.")
  }
}

const ConnectWallet = async()=>{
  if(typeof window!= "undefined" && typeof window.ethereum !="undefined") {
    try{
        //metamask is already installed!
        const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
        //dispatch(chainActions.setConnectMessage('Connected'));
        setConnectMessage('Connected');
        //dispatch(chainActions.setCurrentAccount(accounts[0]));
        setCurrentAccount(accounts[0]);
        console.log(accounts[0]);
       
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
        <nav className="w-screen">
          <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
          <li className='flex items-end ml-5 pb-2'>
            <Link to="/">
            <img src={fullLogo} alt="" width={120} height={120} className="inline-block -mt-2"/>
            <div className='inline-block font-bold text-xl ml-2'>
              NFT Marketplace
            </div>
            </Link>
          </li>
          <li className='w-2/6'>
            <ul className='lg:flex justify-between font-bold mr-10 text-lg'>
              {location.pathname === "/" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/">Marketplace</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/">Marketplace</Link>
              </li>              
              }
              {location.pathname === "/sellNFT" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/sellNFT">List My NFT</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/sellNFT">List My NFT</Link>
              </li>              
              }              
              {location.pathname === "/profile" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/profile">Profile</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/profile">Profile</Link>
              </li>              
              }  
              <li>
                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={ConnectWallet}>{connectMessage}</button>
              </li>
            </ul>
          </li>
          </ul>
        </nav>
        {/* <div className='text-white text-bold text-right mr-10 text-sm'>
          {connectMessage}
        </div> */}
      </div>
    );
  }

  export default Navbar;