

function displayWallet(storedWallet) {
	$.ajax({
		dataType: "json",
		url: "https://api.blockcypher.com/v1/btc/test3/addrs/"+storedWallet.carteira.addr,
		success: function(data) {
			document.querySelector("#saldo").textContent = (data['final_balance']/100000000).toString() + " BTC";
		}
	});
	document.querySelector("#addr").textContent = storedWallet.carteira.addr;
	document.querySelector("#privK").textContent = storedWallet.carteira.priv;
}

function onError(err) {
	console.log(err);
}

var getStoredWallet = browser.storage.local.get();
getStoredWallet.then(displayWallet, onError);
