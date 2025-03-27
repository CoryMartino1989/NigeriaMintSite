
import { useEffect, useState } from "react";
import {
  createThirdwebClient,
  defineChain,
  getContract,
  getContractMetadata,
  createWallet,
  connectWallet,
  getOwnedNFTs,
  claimTo
} from "thirdweb";
import "./style.css";

const client = createThirdwebClient({
  clientId: "9db4f27b3ff418eb08e209f9d863cce7",
});

const chain = defineChain("sepolia");
const contractAddress = "0x00aD629685845FCfbEd45b8946bd7eC77aE2A003";

function App() {
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [owned, setOwned] = useState([]);
  const [minting, setMinting] = useState(false);

  useEffect(() => {
    async function loadContract() {
      const c = await getContract({ client, chain, address: contractAddress });
      const m = await getContractMetadata({ contract: c });
      setContract(c);
      setMetadata(m);
    }
    loadContract();
  }, []);

  async function connect() {
    const w = createWallet("io.metamask");
    await connectWallet({ client, wallet: w, chain });
    setWallet(w);

    const ownedNFTs = await getOwnedNFTs({ contract, wallet: w });
    setOwned(ownedNFTs);
  }

  async function mint() {
    if (!contract || !wallet) return;
    if (owned.length > 0) {
      alert("You already minted a Nigeria UFO!");
      return;
    }

    setMinting(true);
    try {
      await claimTo({ contract, quantity: 1, to: wallet.address });
      alert("✅ Minted!");
    } catch (e) {
      alert("Mint failed.");
      console.error(e);
    }
    setMinting(false);
  }

  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" style={{ maxWidth: 150, marginBottom: 20 }} />
      <h1>Astro Karts Nigeria UFO Mint</h1>
      <p>
        Introducing Exclusive, playable Nigeria UFO Karts.<br />
        <a href="https://astrokarts.io/game/" target="_blank" rel="noreferrer">Play Now</a>
      </p>

      {metadata?.image && (
        <img
          src={metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
          alt="NFT"
          style={{ width: 300, borderRadius: 16 }}
        />
      )}

      {!wallet ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <button onClick={mint} disabled={minting}>
          {minting ? "Minting..." : "Mint Nigeria UFO"}
        </button>
      )}
    </div>
  );
}

export default App;
