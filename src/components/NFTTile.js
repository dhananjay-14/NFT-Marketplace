
import {
    BrowserRouter as Router,
    Link,
  } from "react-router-dom";

function NFTTile (data) {
    const newTo = {
        pathname:"/nftPage/"+data.data.tokenId
    }
    return (
        <Link  to={newTo}>
        <div class="w-full max-w-sm ml-5 mb-4 mr-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <img class="rounded-t-lg w-full" src={data.data.image} alt="product image" />
    <div class="px-5 pb-2 pt-1">
    <h5 class="text-xl font-semibold tracking-tight text-gray-900 ">{data.data.name}</h5>
      
      
          <span class="text-2xl text-gray-900 text-white">{data.data.price} ETH</span>
         {/* <a href="#" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</a>  */}
      
  </div>
</div>

        </Link>
    )
}

export default NFTTile;
