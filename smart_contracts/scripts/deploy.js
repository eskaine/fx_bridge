const { BigNumber } = require("ethers");

async function main() {
  const esk20 = await ethers.getContractFactory("ESK20");
  const esk20Token = await esk20.deploy();
  await esk20Token.deployed();
  console.log("Contract deployed to:", esk20Token.address);

  const esk721 = await ethers.getContractFactory("ESK721");
  const esk721NFT = await esk721.deploy();
  await esk721NFT.deployed();
  console.log("Contract deployed to:", esk721NFT.address);

  const nft1 = await esk721NFT.mintNFT().then(tx => tx.wait());
  const [nft1Event] = nft1.events.filter((e) => e.event == "NFTMinted");
  await esk721NFT.burnNFT(nft1Event.args['id']);

  const nft2 = await esk721NFT.mintNFT().then(tx => tx.wait());
  const [nft2Event] = nft2.events.filter((e) => e.event == "NFTMinted");
  const nft2Owner = await esk721NFT.ownerOf(nft2Event.args['id']);

  await esk721NFT.setPaused(true);
  await esk721NFT.transferNFT(nft2Owner, esk721NFT.address, nft2Event.args['id']);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
