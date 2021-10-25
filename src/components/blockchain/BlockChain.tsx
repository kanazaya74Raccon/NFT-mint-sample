import React, { useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider';
import { formatEther } from '@ethersproject/units'
import { useEthers, useEtherBalance, getChainName, isTestChain } from "@usedapp/core";

export default function BlockChain() {

    const [provider, setProvider] = useState(null);
    const { chainId, activateBrowserWallet, deactivate, account } = useEthers();
    let etherBalance: any = useEtherBalance(account)

    const isMetaMaskInstalled = () => {
        //Have to check the ethereum binding on the window object to see if it's installed
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    };

    // const isMetaMaskInstalled = async () => {
    //     const provider: any = await detectEthereumProvider();

    //     if (provider) {
    //         setProvider(provider)
    //         return true
    //     } else {
    //         return false
    //     }
    // };
    // const startApp = (provider: any) => {
    //     // If the provider returned by detectEthereumProvider is not the same as
    //     // window.ethereum, something is overwriting it, perhaps another wallet.
    //     if (provider !== window.ethereum) {
    //         console.error('Do you have multiple wallets installed?');
    //     }
    //     // Access the decentralized web!
    //     startTransaction()
    // }

    const startTransaction = async () => {
        // connect metamask
        if(isMetaMaskInstalled()){
            await activateBrowserWallet()
        }else{
            alert('please install metamask');
        }
    }

    const connectMetamask = () => {
        // isMetaMaskInstalled()
        // .then(resp => {
        //     if(resp){
        //         startApp(provider)
        //     }else{
        //         console.log("Please install metamask")
        //     }
        // })
    }

    return (
        <div>
            {/* <button onClick={ startTransaction }>Buy Now</button>
            <div>
                {
                    `Account is: ${account}`
                }
            </div>
            <div>
                
                {
                    chainId && `ChainID is: ${ getChainName(chainId)} testnet?: ${isTestChain(chainId)}`
                }
            </div>
            <div>
                
                {
                    etherBalance && `Balance is: ${formatEther(etherBalance)}`
                }
            </div> */}
        </div>
    );
}
