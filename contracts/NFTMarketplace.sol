//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract NFTMarketplace is ERC721URIStorage {
    address payable owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    Counters.Counter private _itemsSold;

    uint256 listingFee = 0.00001 ether ;
    uint256 listedNFTs =0;
    constructor () ERC721("NFTMarket","NFT") {
        owner = payable(msg.sender);
    }
    
    //Structure listedNFT describes the info of all the NFTs listed on Marketplace

    struct listedNFT {
        uint256 _tokenId; 
        address payable creator;
        address payable currentHolder;
        uint256 Royalty;
        uint256 price;
        bool isListed;
    }
    
    mapping (uint256=>listedNFT) private NFTs;
    function updateListingFee(uint256 _newListingFee) public payable {
        require(owner == msg.sender,"Sorry, only owner of the contract can update the listingFee");
        listingFee = _newListingFee;
    }
    
    function getListingFee() public view returns(uint256){
        return listingFee;
    }

    function latestNFTminted () public view returns(listedNFT memory){
        uint256 currentId = _tokenId.current();
        return NFTs[currentId];
    }

    function getNFT(uint256 _TokenId) public view returns(listedNFT memory){
        return NFTs[_TokenId];
    }  

    function getCurrentTokenId () public view returns(uint256){
        return _tokenId.current();
    }
    
    //function to mint and list nft on marketplace
    function createAndListNFT (string memory _tokenURI, uint256 _price,uint256 _royalty) public payable returns(uint256){
        require( msg.value == listingFee,"Please pay the listing fee in order to create and list your NFT");
        require( _price >0 ,"Please enter a positive price ");
        _tokenId.increment();
        uint256 currentTokenId = _tokenId.current();
        _safeMint(msg.sender, currentTokenId );
        _setTokenURI(currentTokenId,_tokenURI);
        createListedNFT(currentTokenId,_price,_royalty);
        //transfer the listing fee to contract owner
        payable(owner).transfer(listingFee);
        return currentTokenId;
    }

    function createListedNFT(uint256 _currentTokenId,uint256 _price,uint256 _royalty) private {
        // create listedNFT object to update details of minted nft
        NFTs[_currentTokenId] = listedNFT(
            _currentTokenId,
            payable(msg.sender),
            payable(msg.sender),
            _royalty,
            _price,
            true
        );
        listedNFTs++;
    }

    //get all the listed nfts
    function getAllNFTs() public view returns(listedNFT[] memory){
        uint256 nftCount = listedNFTs;
        listedNFT[] memory nft = new listedNFT[](nftCount);

        uint256 nftIndex =0;

        for(uint i=0;i<nftCount;i++){
            uint256 currentId = i+1;
            listedNFT storage currentNFT = NFTs[currentId];
            if(currentNFT.isListed==true){
                nft[nftIndex] = currentNFT;
                nftIndex += 1;
            }  
        }
        return nft;
    }  

    //get all the nfts owner by the user
    function getMyNFTs() public view returns(listedNFT[] memory){
        uint256 totalNFTcount = _tokenId.current();
        uint256 nftIndex =0;
        uint256 myTotalNFTs=0;

        //get the count of nfts that i have 
        for(uint i=0;i<totalNFTcount;i++){
           
            if(NFTs[i+1].currentHolder == msg.sender || NFTs[i+1].creator == msg.sender){
                myTotalNFTs +=1;
            }
        }

        //now add all my nfts to the array 
        listedNFT[] memory nft = new listedNFT[](myTotalNFTs);
        for(uint i=0;i<totalNFTcount;i++){
           
           if(NFTs[i+1].currentHolder==msg.sender||NFTs[i+1].creator ==msg.sender){
            uint currentId =i+1;
            listedNFT storage currentNFT = NFTs[currentId];
            nft[nftIndex]=currentNFT;
            nftIndex += 1;
           }
        }
        return nft;
    }

    function processPurchase (uint256 tokenId) public payable {
        uint256 price = NFTs[tokenId].price;
        uint256 royalty = NFTs[tokenId].Royalty;
        require(msg.value==price,"please pay the listed price");

        //get the addresses
        address seller = NFTs[tokenId].currentHolder;
        address nftcreator = NFTs[tokenId].creator;

        //update the ownerships and unlist
        NFTs[tokenId].currentHolder = payable(msg.sender);
        NFTs[tokenId].isListed = false;
        listedNFTs--;
        _itemsSold.increment();

        //first purchase condition
        if(seller==nftcreator){
            payable(nftcreator).transfer(msg.value);
        }
        else{
        uint256 totalamt = msg.value;
        uint256 creatoramt = (totalamt * royalty) / 100;
        uint256 selleramt = totalamt - creatoramt;
        //funds transfer
        payable(seller).transfer(selleramt);
        payable(nftcreator).transfer(creatoramt);
        }
        
    }

    function sellMyNFT(uint256 tokenId, uint256 sellingPrice) public payable {
        address currentowner = NFTs[tokenId].currentHolder;
        require(msg.sender==currentowner,"only current holder of the nft can sell it ");
        require(!NFTs[tokenId].isListed,"this nft is already listed");
        NFTs[tokenId].price = sellingPrice;
        NFTs[tokenId].isListed = true;
        listedNFTs++;
    }
}

