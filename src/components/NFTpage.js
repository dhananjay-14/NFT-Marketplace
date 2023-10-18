import Navbar from "./Navbar";
import { useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { list } from "postcss";

export default function NFTPage (props) {

const [data, updateData] = useState({});
const [dataFetched, updateDataFetched] = useState(false);
const [message, updateMessage] = useState("");
const [currAddress, updateCurrAddress] = useState("0x");
const [sellingprice,updateSellingprice] = useState('');

async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    const tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getNFT(tokenId);
    let meta = await axios.get(tokenURI);
    let showprice = ethers.utils.formatUnits(listedToken.price.toString(), 'ether');
    meta = meta.data;
    console.log(listedToken);

    let item = {
        price: showprice,
        isListed: listedToken.isListed,
        royalty: listedToken.Royalty,
        tokenId: tokenId,
        currentHolder: listedToken.currentHolder,
        creator: listedToken.creator,
        image: meta.image,
        name: meta.name,
        description: meta.description,
    }
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    console.log("address", addr)
    updateCurrAddress(addr);
}

async function buyNFT(tokenId) {
    try {
        const ethers = require("ethers");
       
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        const salePrice = ethers.utils.parseUnits(data.price, 'ether')
        updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
        
        let transaction = await contract.processPurchase(tokenId, {value:salePrice});
        await transaction.wait();

        alert('You successfully bought the NFT!');
        updateMessage("");
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}

async function sellMyNFT(tokenId,sellingPrice) {
    try {
        const ethers = require("ethers");
       
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const salePrice = ethers.utils.parseUnits(sellingPrice, 'ether')
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        updateMessage("Selling your NFT... Please Wait")
        
        let transaction = await contract.sellMyNFT(tokenId,salePrice);
        await transaction.wait();

        alert('You successfully sold and listed the NFT!');
        updateMessage("");
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

    return(
        <div style={{"min-height":"100vh"}}>
            <Navbar></Navbar>
            <div className="flex ml-20 mt-40  w-full">
                <img src={data.image} alt="" className="w-2/5 rounded-lg" />
                <div className="text-xl ml-20 space-y-8 text-black shadow-2xl rounded-lg border-2 p-5">
                    <div>
                        <b>Name:</b> {data.name}
                    </div>
                    <div>
                        <b>Description:</b> {data.description}
                    </div>
                    <div>
                        <b>Price:</b> <span className="">{data.price + " ETH"}</span>
                    </div>
                    <div>
                        <b>Royalty:</b> <span className="">{data.royalty + " %"}</span>
                    </div>
                    <div>
                        <b>Creator:</b> <span className="text-sm">{data.creator}</span>
                    </div>
                    <div>
                        <b>Current Holder:</b> <span className="text-sm">{data.currentHolder}</span>
                    </div>
                    <div>
                    { (currAddress == data.currentHolder)?
                    <> <div className="text-emerald-700">You are the owner of this NFT</div>
                    </>
                        :<button className="enableEthereumButton w-4/5  bg-black hover:bg-green-500 text-white hover:text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>  
                    }
                    {
                        (data.currentHolder != data.creator && currAddress==data.currentHolder && !data.isListed) && (
                            <>
                             <div className="mb-6">
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Enter selling price in ETH" step="0.01" value={sellingprice} onChange={e => updateSellingprice(e.target.value)}></input>
                            </div>
                            <button className="enableEthereumButton w-4/5  bg-black hover:bg-green-500 text-white hover:text-white font-bold py-2 px-4 rounded text-sm" onClick={() => sellMyNFT(tokenId,sellingprice)}>Sell Your NFT</button>  
                            </>
                        )
                    }
                    <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}