import ABI from "./abi.js";

const config = {
    mainChainId: 4,
    contractAddress: "0xA7f98789bd7585aB8879ae43417f647de17BFBa6",
};

const mintBtn = document.querySelector("#mintBtn");
const connectWalletBtn = document.querySelector("#connectWalletBtn");
const amountToMintEl = document.querySelector("#number");

const ethereum = window.ethereum;
let contractInstance;
let currentNetwork;
let signer;
let provider;

async function switchNetwork() {
    try {
        await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${config.mainChainId.toString(16)}` }],
        });
    } catch (err) {
        alert(err);
    }
}

async function checkConnection() {
    if (!contractInstance) {
        await connect();
    }
    if (ethereum.networkVersion !== config.mainChainId) {
        await switchNetwork();
    }

    return true;
}

async function connect() {
    try {
        if (ethereum) {
            currentNetwork = ethereum.networkVersion;
            if (currentNetwork !== config.mainChainId) {
                await switchNetwork();
            }
            // connecting to Metamask
            // accounts[0] - userWallet
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            provider = new ethers.providers.Web3Provider(ethereum);
            signer = provider.getSigner();
            contractInstance = new ethers.Contract(config.contractAddress, ABI, signer);

            if (contractInstance) {
                connectWalletBtn.disabled = true;
                connectWalletBtn.textContent = "CONNECTED";
            }
        } else alert("Install Metamask!");
    } catch (err) {
        alert(err);
    }
}

async function mint() {
    await checkConnection();
    const amountToMint = +amountToMintEl.value;
    try {
        const price = await contractInstance.PRICE();

        await contractInstance.mintPublic(amountToMint, {
            value: price.mul(amountToMint),
        });
    } catch (err) {
        alert(err);
    }
}

connectWalletBtn.addEventListener("click", async ({ target }) => {
    await connect();
});

mintBtn.addEventListener("click", () => {
    mint();
});
