import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";

import { useState } from "react";

export default function Marketplace() {
const sampleData = [];
const [data, updateData] = useState([]);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    
    
    const ethers = require("ethers");
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer) 
    
    let transaction = await contract.getAllNFTs();
    
    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {

        const tokenURI = await contract.tokenURI(i._tokenId);
        
        const response= await fetch(tokenURI);
            if(!response.ok){
                throw new Error;
            }
            const meta=await response.json();
            console.log(meta);
        console.log("called")

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i._tokenId.toNumber(),
            currentHolder: i.currentHolder,
            creator: i.creator,
            image: meta.image,
            name: meta.name,
            description: meta.description,
            royalty: i.Royalty
        }
        return item;
    }))
    console.log("called")
    updateData(items);
    updateFetched(true);
   
    console.log("updated items")
}

if(!dataFetched)
    getAllNFTs();

return (
  
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-black">
                Top NFTs
            </div>
            <div className="flex mt-5 flex-wrap text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}