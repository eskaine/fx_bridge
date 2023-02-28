const { getBalance, getProvider, getContract } = require("./helpers");

const run = async() => {
    const tokenAddressIndex = 0;
    const tokenAcronymIndex = 2;
    const tokenUnits = 3;
    const provider = getProvider();
    const contract = await getContract(provider);
    const tokensList = await contract.getBridgeTokenList();

    let results = await Promise.all(
        tokensList.map(async(token) => {
            const blockNumber = await provider.getBlockNumber();
            const { timestamp } = await provider.getBlock(blockNumber);
            const coinContract = await getContract(provider, token[tokenAddressIndex]);

            if(coinContract) {
                const balance = await getBalance(coinContract, token[tokenUnits]);
                
                return {
                    blockHeight: blockNumber,
                    balance,
                    timestamp,
                    token: token[tokenAcronymIndex]
                }
            }

            return false;   
        })
    );

    // remove unavailable results (non-ERC20 or failed data retrieval)
    results = results.filter((result) => result);

    console.log(results);
}

run();

