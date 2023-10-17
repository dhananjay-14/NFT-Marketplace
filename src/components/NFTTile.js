
import { hover } from "@testing-library/user-event/dist/hover";
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
         <div className="border-2 ml-12 mt-5 mb-12 bg-grey-700 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
    <img src={data.data.image} alt="product image" className="w-72 h-80 rounded-lg object-cover"  />
    <div class="px-5 pb-2 pt-1 bg-black w-full hover:bg-green-500">
    <h5 class="text-xl font-semibold tracking-tight text-white ">{data.data.name}</h5>
      
      
          <span class="text-2xl text-white">{data.data.price} ETH</span>
         {/* <a href="#" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</a>  */}
      
  </div>
</div>

        </Link>
    )
}

export default NFTTile;
