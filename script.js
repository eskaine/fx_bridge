const { Console } = require("console");
const fs = require("fs");
const { getInfo, getProvider, getContract } = require("./helpers");

const run = async() => {
    console.log("Running script...");
    const intervalTime = 5000;
    const timeout = 60000;
    const file = "./fx-bridge token supply.csv";
    const headerLine = "Batch, Block Height, Timestamp, Balance, Token\n";

    try {
        console.log("Fetching tokens list...");
        const provider = getProvider();
        const contract = await getContract(provider);
        const tokensList = await contract.getBridgeTokenList();
        fs.truncateSync(file,  0);
        fs.appendFileSync(file,  headerLine);

        let batchCount = 0;
    
        const interval = setInterval(async() => {
            batchCount++;
            const tokensInfo = await getInfo(provider, tokensList);
            let line = "";
    
            console.log(`\nGenerating batch ${batchCount}...`)
            for (let i = 0; i < tokensInfo.length; i++) {
                const {blockHeight, timestamp, balance, token} = tokensInfo[i];
                line += `${batchCount},${timestamp},${blockHeight},${token},${balance}\n`;

                const date = new Date(timestamp);
                console.log(`${date.toLocaleString()} - Block ${blockHeight}, ${token} ${balance}`)
            }

            fs.appendFileSync(file, line);

            if(intervalTime * batchCount >= timeout) {
                console.log("\nDone!")
                return clearInterval(interval);
            }
        }, intervalTime);
    } catch (error) {
        console.error(error);
    }
}

run();
