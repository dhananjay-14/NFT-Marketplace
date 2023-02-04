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
    constructor () ERC721("NFTMarket","NFT") {
        owner = payable(msg.sender);
    }
    
    //Structure listedNFT describes the info of all the NFTs listed on Marketplace

    struct listedNFT {
        uint256 _tokenId; 
        address payable owner;
        address payable seller;
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
    
    function createAndListNFT (string memory _tokenURI, uint256 _price) public payable returns(uint256){
        require( msg.value == listingFee,"Please pay the listing fee in order to create and list your NFT");
        require( _price >0 ,"Please enter a positive price ");
        _tokenId.increment();
        uint256 currentTokenId = _tokenId.current();
        _safeMint(msg.sender, currentTokenId );
        _setTokenURI(currentTokenId,_tokenURI);

        createListedNFT(currentTokenId,_price);

        return currentTokenId;
    }

    function createListedNFT(uint256 _currentTokenId,uint256 _price) private {
        NFTs[_currentTokenId] = listedNFT(
            _currentTokenId,
            payable(address(this)),
            payable(msg.sender),
            _price,
            true
        );

        _transfer(msg.sender,address(this),_currentTokenId);
    }

    function getAllNFTs() public view returns(listedNFT[] memory){
        uint256 nftCount = _tokenId.current();
        listedNFT[] memory nft = new listedNFT[](nftCount);

        uint256 nftIndex =0;

        for(uint i=0;i<nftCount;i++){
            uint256 currentId = i+1;
            listedNFT storage currentNFT = NFTs[currentId];

            nft[nftIndex] = currentNFT;
            nftIndex += 1;
        }
        return nft;
    }  

    function getMyNFTs() public view returns(listedNFT[] memory){
        uint256 totalNFTcount = _tokenId.current();
        uint256 nftIndex =0;
        uint256 myTotalNFTs=0;

        //get the count of nfts that i have 
        for(uint i=0;i<totalNFTcount;i++){
           
            if(NFTs[i+1].owner == msg.sender || NFTs[i+1].seller == msg.sender){
                myTotalNFTs +=1;
            }
        }

        //now add all my nfts to the array 
        listedNFT[] memory nft = new listedNFT[](myTotalNFTs);
        for(uint i=0;i<totalNFTcount;i++){
           
           if(NFTs[i+1].owner==msg.sender||NFTs[i+1].seller ==msg.sender){
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
        require(msg.value==price,"please pay the listed price");

        address seller = NFTs[tokenId].seller;

        NFTs[tokenId].seller = payable(msg.sender);
        NFTs[tokenId].isListed = true;
        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);
        approve(address(this), tokenId);

        payable(owner).transfer(listingFee);
        payable(seller).transfer(msg.value);
    }
}