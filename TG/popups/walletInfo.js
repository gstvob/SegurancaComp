

function displayWallet(storedWallet) {
	document.querySelector("#addr").textContent = storedWallet.carteira.addr;
	document.querySelector("#privK").textContent = storedWallet.carteira.priv; 
}

function onError(err) {
	console.log(err);
}

var getStoredWallet = browser.storage.local.get();
getStoredWallet.then(displayWallet, onError);
