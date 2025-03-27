
import { useAddress, useContract, useContractMetadata, useMetamask, Web3Button, ThirdwebProvider } from "@thirdweb-dev/react";
import "./style.css";

const CONTRACT_ADDRESS = "0x00aD629685845FCfbEd45b8946bd7eC77aE2A003";

function MintPage() {
  const address = useAddress();
  const connect = useMetamask();
  const { contract } = useContract(CONTRACT_ADDRESS, "nft-drop");
  const { data: metadata } = useContractMetadata(contract);

  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" style={{ maxWidth: 150, marginBottom: 20 }} />
      <h1>Astro Karts Nigeria UFO Mint</h1>
      <p>Introducing Exclusive, playable Nigeria UFO Karts.<br />
      Play now at <a href="https://astrokarts.io/game/" target="_blank" rel="noreferrer">astrokarts.io/game</a></p>
      
      {metadata?.image && (
        <img src={metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="NFT" style={{ width: 300, borderRadius: 16 }} />
      )}

      {!address ? (
        <button onClick={connect} className="mint-button">Connect Wallet</button>
      ) : (
        <Web3Button
          contractAddress={CONTRACT_ADDRESS}
          action={async (contract) => {
            const owned = await contract.erc721.getOwned(address);
            if (owned.length > 0) {
              alert("You already claimed your UFO!");
              return;
            }
            await contract.erc721.claim(1);
          }}
        >
          Mint Nigeria UFO
        </Web3Button>
      )}
    </div>
  );
}

function App() {
  return (
    <ThirdwebProvider activeChain="sepolia" clientId="9db4f27b3ff418eb08e209f9d863cce7">
      <MintPage />
    </ThirdwebProvider>
  );
}

export default App;
