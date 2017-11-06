var carteira = {
    addr: "",
    priv: "",
}

var registros = [];

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


function onError(err) {
    console.log(err);
}

const getStoredWallet = browser.storage.local.get();
/*tem que verificar se a carteira ta guardada*/
getStoredWallet.then(transaction, onError);


browser.webRequest.onHeadersReceived.addListener(function(details) {
    
    if (details.statusLine.indexOf("402") > -1) {
        

        var cabecalho = details['responseHeaders'];
        var pAddr = "";
        var ammount = 0;
        var about = "";

        for (i in cabecalho) {
            if (cabecalho[i]['name'] === "payAddr") {
                pAddr = cabecalho[i]['value'];
                //console.log(pAddr);
            } else if (cabecalho[i]['name'] === "ammount") {
                ammount = cabecalho[i]['value'];
                //console.log(ammount);
            } else if (cabecalho[i]['name'] === "memo") {
                about = cabecalho[i]['value'];
            }
        }

        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL("icon.png"),
            "title": "Pagamento requisitado",
            "message": "A página requisitou um pagamento de "+ammount+" satoshis, com a descrição \""+about+"\", para confirmar apenas clique nessa notificação, caso contrário apenas feche-a ou ignore"
        });

        function confirmPay() {
            var addr2 = bitcore.Address.fromString(pAddr);

            /*REALIZAR TRANSAÇÃO COM INSIGHT AQUI*/
            var Insight = require("bitcore-explorers").Insight;
            var insight = new Insight("testnet");
            
            var privK = bitcore.PrivateKey.fromString(carteira['priv']);
            var addr = bitcore.Address.fromString(carteira['addr']);

            insight.getUnspentUtxos(addr, function(err, utxos) {
                if (err) {
                    //trata erros
                } else {
                    //console.log(utxos.toString());
                    //console.log(parseInt(ammount));
                    var tx = bitcore.Transaction();
                    tx.from(utxos);
                    tx.to(addr2, parseInt(ammount));
                    tx.sign(privK);

                    tx.serialize();
                    insight.broadcast(tx, function(err, txId) {
                        if (err) {
                            //tratar erros.
                        } else {
                            //transação funcionou corretamente.
                            registros.push({
                                from: addr.toString(),
                                to: addr2.toString(),
                                desc: about,
                                preco: ammount.toString()
                            });
                            console.log(txId);
                            browser.storage.local.set({historico:registros});
                        }
                    });
                }
            });
        }
        browser.notifications.onClicked.addListener(confirmPay);
    }
}, {urls: ['<all_urls>']}, ['blocking', 'responseHeaders']);

