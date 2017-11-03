var carteira = {
    addr: "",
    priv: "",
}


function transaction(storedWallet) {
    var bitcoin = require("bitcore-lib");
    var privK = bitcoin.PrivateKey.fromString(storedWallet.carteira.priv);
    var addr = privK.toAddress("testnet");
    
    console.log(privK.toString());
    console.log(addr.toString());
}


const getStoredWallet = browser.storage.local.get();
/*tem que verificar se a carteira ta guardada*/
getStoredWallet.then(transaction, onError);


browser.webRequest.onHeadersReceived.addListener(function(details) {
    
    if (details.statusLine.indexOf("402") > -1) {
        console.log(details['responseHeaders'][2]);
    }
}, {urls: ['<all_urls>']}, ['blocking', 'responseHeaders']);

