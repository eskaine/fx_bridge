const axios = require("axios");
const { ethers } = require("ethers");
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');

const pundiAddress = "0x6f1d09fed11115d65e1071cd2109edb300d80a27";
const apiKey = "ZVQB3HEYFP2971ZVQ82FXFHYUXRXFYRD5I";
const etherscanUrl = "https://api.etherscan.io/api?module=contract&action=getabi";
const providerUrl = "https://eth-mainnet.g.alchemy.com/v2/JS0ioe45h_lAM9G2oH77LSpxs9kWhnnT";

const getProvider = () => {
    return new ethers.JsonRpcProvider(providerUrl);
}

const getBalance = async(contract, units) => {
    const balance = await contract.balanceOf(pundiAddress);
    return ethers.formatUnits(balance, units);
}

const getAbi = async(apiKey, contractAddress) => {
    const url = `${etherscanUrl}&address=${contractAddress}&apikey=${apiKey}`;
    const res = await axios.get(url);

    if(+res.data.status) {
        return JSON.parse(res.data.result);
    }

    return false;
}

const getContract = async(provider, address = pundiAddress) => {
    let parsedAddress = address;

    try {
        parsedAddress = await getImplementationAddress(provider, address);
    } finally {
        const abi = await getAbi(apiKey, parsedAddress);
        
        if(abi) {
            return new ethers.Contract(address, abi, provider);
        }

        return false;
    }
}

const getInfo = async(provider, tokensList) => {
    const tokenAddressIndex = 0;
    const tokenAcronymIndex = 2;
    const tokenUnits = 3;

    let results = await Promise.all(
        tokensList.map(async(token) => {
            const blockNumber = await provider.getBlockNumber();
            const { timestamp } = await provider.getBlock(blockNumber);
            const coinContract = await getContract(provider, token[tokenAddressIndex]);

            if(coinContract) {
                const balance = await getBalance(coinContract, token[tokenUnits]);
                
                return {
                    blockHeight: blockNumber,
                    timestamp,
                    balance,
                    token: token[tokenAcronymIndex]
                }
            }

            return false;   
        })
    );

    // remove unavailable results (non-ERC20 or failed data retrieval)
    return results.filter((result) => result);
}

module.exports = {
    getProvider,
    getContract,
    getInfo
}
