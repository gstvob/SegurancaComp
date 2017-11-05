var carteira = {
    addr: "",
    priv: "",
}

var bitcore = require("bitcore-lib");

/*
    FUNÇÃO DE TESTE PARA VERIFICAR SE AS CHAVES PRIVADAS E ENDEREÇO ESTÃO SENDO SALVOS NO NAVEGADOR
*/
function transaction(storedWallet) {
    var privK = bitcore.PrivateKey.fromString(storedWallet.carteira.priv);
    var addr = privK.toAddress("testnet");
    
    console.log(privK.toString());
    console.log(addr.toString());

    carteira['addr'] = addr.toString();
    carteira['priv'] = privK.toString();

    console.log(carteira['addr']);
}


const getStoredWallet = browser.storage.local.get();
/*tem que verificar se a carteira ta guardada*/
getStoredWallet.then(transaction, onError);


browser.webRequest.onHeadersReceived.addListener(function(details) {
    
    if (details.statusLine.indexOf("402") > -1) {
        var cabecalho = details['responseHeaders'];
        var pAddr = "";
        var ammount = 0;

        for (i in cabecalho) {
            if (cabecalho[i]['name'] === "payAddr") {
                pAddr = cabecalho[i]['value'];
                //console.log(pAddr);
            } else if (cabecalho[i]['name'] === "ammount") {
                ammount = cabecalho[i]['value'];
                //console.log(ammount);
            }
        }
        var addr2 = bitcore.Address.fromString(pAddr);
        console.log(addr2.toString());
        /*REALIZAR TRANSAÇÃO COM INSIGHT AQUI*/
        var Insight = require("bitcore-explorers").Insight;
        var insight = new Insight("testnet");
        
        var privK = bitcore.PrivateKey.fromString(carteira['priv']);
        var addr = bitcore.Address.fromString(carteira['addr']);
        console.log(privK);
        console.log(addr);

        insight.getUnspentUtxos(addr, function(err, utxos) {
            if (err) {
                //trata erros
            } else {
                //console.log(utxos.toString());
                var tx = bitcore.Transaction();
                tx.from(utxos);
                tx.to(addr2, ammount);
                /*tx.sign(privK);

                tx.serialize();
                insight.broadcast(tx, function(err, txId) {
                    if (err) {
                        //tratar erros.
                    } else {
                        //transação funcionou corretamente.
                        console.log(txId);
                    }
                });*/
            }
        });
    }
}, {urls: ['<all_urls>']}, ['blocking', 'responseHeaders']);

