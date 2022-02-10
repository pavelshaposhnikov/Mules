import ABI from "./abi.js";

const config = {
    mainChainId: "1337",
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
};

const mintBtn = document.getElementById("mintBtn");
const connectWalletBtn = document.getElementById("connectWalletBtn");
const counter = document.getElementById("number");
const mintedCounter = document.getElementById("mintCounter");

const prettyNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const detectMetaMask = (ethereum) => {
    if (ethereum?.providers) {
        const isMetaMask = ethereum.providers.find((provider) => provider.isMetaMask);

        if (isMetaMask) {
            return isMetaMask;
        } else {
            return false;
        }
    } else {
        if (ethereum?.isMetaMask) {
            return ethereum;
        } else {
            return false;
        }
    }
};

const checkIsWalletConnected = async () => {
    try {
        if (!provider) {
            alert("Please install metamask extension!")
            return;
        }

        if (provider.networkVersion !== config.mainChainId) {
            await changeNetwork();
            return;
        }

        const accounts = await provider.request({method: "eth_accounts"});

        if (accounts.length !== 0) {
            account = accounts[0];
            connectWalletBtn.disabled = true;
            connectWalletBtn.textContent = "CONNECTED";
        }
    } catch (error) {
        alert(error);
    }
};

const connectWallet = async () => {
    try {
        if (!provider) {
            alert("Please install metamask extension!");
            return;
        }

        if (provider.networkVersion !== config.mainChainId) {
            await changeNetwork();
            return;
        }

        const accounts = await provider.request({method: "eth_requestAccounts"});

        account = accounts[0];
        connectWalletBtn.disabled = true;
        connectWalletBtn.textContent = "CONNECTED";
    } catch (error) {
        alert(error);
    }
};

const changeNetwork = async () => {
    await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{
            chainId: `0x${config.mainChainId.toString(16)}`
        }]
    });
};

const mint = async () => {
    try {
        if (!provider || !account) {
            return;
        }

        if (provider.networkVersion !== config.mainChainId) {
            await changeNetwork();
            return;
        }

        const counterNFT = counter.value;

        const currentProvider = new ethers.providers.Web3Provider(provider);
        const signer = currentProvider.getSigner();
        const nftContract = new ethers.Contract(config.contractAddress, ABI, signer);

        const price = await nftContract.getPrice(counterNFT);

        const overrides = {
            value: price  // ether in this case MUST be a string
        };

        mintBtn.disabled = true;
        mintBtn.textContent = "Minting...";

        try {
            const trx = await nftContract.buy(counterNFT, overrides);
            await trx.wait();
            mintBtn.disabled = false;
            mintBtn.textContent = "Mint";
        } catch (error) {
            mintBtn.disabled = false;
            mintBtn.textContent = "Mint";
            alert(error.data.message);
        }
    } catch (error) {
        alert(error);
    }
};

const {ethereum} = window;
const provider = detectMetaMask(ethereum);
let account;

if (provider) {
    const currentProvider = new ethers.providers.Web3Provider(provider);
    const signer = currentProvider.getSigner();
    const nftContract = new ethers.Contract(config.contractAddress, ABI, signer);
    let debounce;

    nftContract.on("Transfer", () => {
        clearTimeout(debounce);
        debounce = setTimeout(async () => {
            const counter = await nftContract.totalSupply();
            mintedCounter.textContent = prettyNumber(counter.toString());
        }, 500);
    });

    provider.on("chainChanged", () => {
        window.location.reload();
    });

    provider.on("accountsChanged", () => {
        window.location.reload();
    });
}

window.addEventListener("load", () => {
    checkIsWalletConnected();
})

connectWalletBtn.addEventListener("click", (e) => {
    e.preventDefault();
    connectWallet();
});

mintBtn.addEventListener("click", (e) => {
    mint();
});