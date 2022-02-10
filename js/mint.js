import ABI from "./abi.js";
import config from "./config.js";

const mintBtn = document.getElementById("mintBtn");
const connectWalletBtn = document.getElementById("connectWalletBtn");
const counter = document.getElementById("number");
const popup = document.getElementById("popup");
const popupBtnClose = document.getElementById("popupBtnClose");
const mintedCounter = document.getElementById("mintCounter");

const prettyNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const alertError = (show, text) => {
    const desc = popup.querySelector(".popup__desc");
    const status = show ? "add" : "remove";
    popup.classList[status]("popup--open");
    desc.textContent = text;
}

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
            return;
        }

        const accounts = await provider.request({method: "eth_accounts"});

        if (accounts.length !== 0) {
            account = accounts[0];
            connectWalletBtn.disabled = true;
            connectWalletBtn.textContent = "CONNECTED";
        }
    } catch (error) {
        alertError(true, error?.data?.originalError?.message || error.message);
    }
};

const connectWallet = async () => {
    try {
        if (!provider) {
            alertError(true, "Please install metamask extension!");
            return;
        }

        if (provider.networkVersion !== config.mainChainId) {
            alertError(true, "Please change network to Ethereum!");
            await changeNetwork();
            return;
        }

        const accounts = await provider.request({method: "eth_requestAccounts"});
        account = accounts[0];
        connectWalletBtn.disabled = true;
        connectWalletBtn.textContent = "CONNECTED";
        window.location.reload();
    } catch (error) {
        alertError(true, error?.data?.originalError?.message || error.message);
    }
};

const changeNetwork = async () => {
    await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{
            chainId: `0x${config.mainChainId.toString(16)}`
        }]
    });
    window.location.reload();
};

const mint = async () => {
    try {
        if (!provider) {
            alertError(true, "Please install metamask extension!");
            return;
        }

        if (!account) {
            alertError(true, "Please connect your wallet.");
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

        const balance = +(await currentProvider.getBalance(account)).toString();

        if (balance === 0) {
            alertError(true, "Insufficient Funds. Please fund your account.");
            return;
        }

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
            alertError(true, error.error.message || error?.data?.originalError?.message || error?.data?.message || error.message);
        }
    } catch (error) {
        alertError(true, error?.data?.originalError?.message || error.message);
    }
};

const {ethereum} = window;
const provider = detectMetaMask(ethereum);
let account;

window.addEventListener("load", async () => {
    await checkIsWalletConnected();

    if (provider && account) {
        const currentProvider = new ethers.providers.Web3Provider(provider);
        const signer = currentProvider.getSigner();
        const nftContract = new ethers.Contract(config.contractAddress, ABI, signer);

        const setMintedCounter = async () => {
            const counter = await nftContract.totalSupply();
            mintedCounter.textContent = prettyNumber(counter.toString());
        };

        await setMintedCounter();

        setTimeout(async () => {
            await setMintedCounter()
        }, 5000);
    }
})

connectWalletBtn.addEventListener("click", async () => {
    await connectWallet();
});

popupBtnClose.addEventListener("click", (e) => {
    e.preventDefault();
    alertError(false, "");
})

mintBtn.addEventListener("click", async () => {
    await mint();
});