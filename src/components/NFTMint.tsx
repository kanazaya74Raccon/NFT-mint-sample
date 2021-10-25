import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import { useToasts } from 'react-toast-notifications'
import detectEthereumProvider from '@metamask/detect-provider';
import { formatEther } from '@ethersproject/units'
import { useEthers, useEtherBalance, getChainName, isTestChain, useContractFunction } from "@usedapp/core";
import { useContractMethod } from "../hooks";
import { utils } from 'ethers'
// import { managerAccount } from '../contracts';

export default function NFTMint() {

    const { addToast } = useToasts()
    const [total_price, setTotal] = useState(0)
    const [item_num, setItems] = useState(0)

    const { send: setTreasury } = useContractMethod("setTreasury");
    const { send: mintTokens } = useContractMethod("mintTokens");

    const connectMetamask = () => {
        startTransaction()        
    }

    const { chainId, activateBrowserWallet, deactivate, account } = useEthers();
    const etherBalance: any = useEtherBalance(account)
    
    const isMetaMaskInstalled = () => {
        //Have to check the ethereum binding on the window object to see if it's installed
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    };

    const startTransaction = async () => {
        // connect metamask
        if(isMetaMaskInstalled()){
            await activateBrowserWallet()
        }else{
            addToast("Please install MetaMask extension", {
                appearance: 'error',
                autoDismiss: true,
            })
        }
    }

    const onChange = (e:any) => {
        const re = /^[0-9\b]+$/;
        if ((e.target.value === '' || re.test(e.target.value) && (e.target.value <= 10) && (e.target.value >= 1))) {
            setItems(e.target.value)
            let items = e.target.value === '' ? 0 : e.target.value;
            setTotal(items * 0.03)
        }
    }

    const mint = () => {
        fetch("/mint", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                count: item_num
            })
        })
        .then((response) => response.json())
        .then(async (data) => {
            console.log("data: ", data);
            var splitedData = data.data.splice(0, data.data.length - 1);
            console.log("data splite: ",  splitedData);
           
            if(splitedData.length > 1){
                await mintTokens(splitedData.length, 
                    splitedData,
                    {
                        gasLimit: 3000000,
                        value: utils.parseEther(total_price.toString())
                    }
                );
            }
        })
        .catch((err) => console.log(err));
        // mintTokens(2, 
        //     ["https://gateway.pinata.cloud/ipfs/QmYFmJgQGH4uPHRYN15Xdv4aLd9o4Aq63y1e4GgN6kj5aK/2",
        //     "https://gateway.pinata.cloud/ipfs/QmYFmJgQGH4uPHRYN15Xdv4aLd9o4Aq63y1e4GgN6kj5aK/2"],
        //     {
        //         gasLimit: 3000000,
        //         value: utils.parseEther(total_price.toString())
        //     }
        // );
    }
    // data.data.splice(-1)
    return (
        <div className='flex justify-center'>
            <div className={`${(chainId != undefined) && "bg-black bg-opacity-70 px-10 py-8 w-1/3 rounded-25"}`} >
                {!account &&
                <Button variant="contained" className="h-12 text-lg px-10 bg-yellow-300 text-white font-bold" onClick={ connectMetamask }>
                    Buy Now
                </Button>
                }
                <div className={`${ chainId == 4  && "hidden"}`}>
                    <div className='capitalize py-2'>
                        SALE NOT STARTED
                    </div>
                    <div>
                        please change to Main Network
                    </div>
                </div>
                <div className={`${ (chainId == 4) ? "block" : "hidden"} py-2`}>
                    {
                        parseFloat(formatEther(etherBalance ? etherBalance : 0)) >= 0.03 ? 
                        (
                            <div>
                                <div className='pt-1'>
                                    <div className='flex justify-center items-center'>
                                        <label htmlFor="items" className="block text-sm font-medium text-white">Items(MAX: 10), 0.03ETH Per Item</label>
                                    </div>
                                    <div className='flex justify-center items-center pt-1'>
                                        <div className="relative rounded-md shadow-sm w-2/3 ml-4">
                                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">
                                                    Count:
                                                </span>
                                            </div>
                                            <input type="number" name="price" id="price" value={item_num} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-14 pr-2 sm:text-sm border-gray-300 rounded-md text-black h-8" placeholder="0" min='0' max='10' required onChange={(e) => { onChange(e) }} />
                                        </div>
                                    </div>
                                    
                                </div>
                                <div>
                                    <div>
                                        <span>Balance: </span><span>{ Math.round(parseFloat(formatEther(etherBalance ? etherBalance : 0)) * 10000) / 10000 } ETH</span>
                                    </div>
                                    <div>
                                        <span>Price:</span><span>{ total_price } ETH</span>
                                    </div>
                                </div>
                                <div className='pt-2'>
                                    {
                                        (parseFloat(formatEther(etherBalance ? etherBalance : 0)) >= total_price && parseFloat(formatEther(etherBalance ? etherBalance : 0)) >= 0.03) && (item_num >= 1 && item_num <= 10) && (
                                            <Button variant="contained" className="text-md px-8 bg-green-600 text-white font-bold" onClick={ mint }>Mint</Button>
                                        )
                                    }
                                    
                                </div>
                                {
                                    parseFloat(formatEther(etherBalance ? etherBalance : 0)) <= total_price && (
                                        <div>
                                            Insufficient Ether. It must be more than 0.03ETH
                                        </div>
                                    )
                                }
                                
                            </div>

                        )
                        :                        
                        (
                            <div>
                                Insufficient Ether. It must be more than 0.03ETH
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}