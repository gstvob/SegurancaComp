var carteira = {
    addr: "",
    priv: "",
}


var listed = [];
var registros = [];
var inited = false;
var bitcore = require("bitcore-lib");



function init() {
    inited = true;
    return inited;
}

/*
    função que guarda na variável carteira os valores de endereço e chave privada guardados no navegador.
    @param storedWallet é a constante que ta com tudo que foi guardado no navegador.
*/
function transaction(storedWallet) {
    var privK = bitcore.PrivateKey.fromString(storedWallet.carteira.priv);
    var addr = privK.toAddress("testnet");
    
    console.log(privK.toString());
    console.log(addr.toString());

    carteira['addr'] = addr.toString();
    carteira['priv'] = privK.toString();

   // console.log(carteira['addr']);
}


function onError(err) {
    console.log(err);
}

/*
    constante que carrega tudo que tá guardado no navegador e chama a função "transaction"
*/
const getStoredWallet = browser.storage.local.get();
getStoredWallet.then(transaction, onError);

/*
    Listener para tratar o pagamento quando recebe uma resposta HTTP status 402 = "Payment Required"
*/
browser.webRequest.onHeadersReceived.addListener(function(details) {
    
    if (details.statusLine.indexOf("402") > -1) {

        /*
            Pega o cabeçalho da resposta 402, nele constam informações como o endereço de destino, o preço do que está sendo comprado
            e uma descrição/nome do que está sendo comprado.        
        */
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
        
        var addr2 = bitcore.Address.fromString(pAddr);
        var Insight = require("bitcore-explorers").Insight;
        var insight = new Insight("testnet");
    
        var privK = bitcore.PrivateKey.fromString(carteira['priv']);
        var addr = bitcore.Address.fromString(carteira['addr']);

        var confirmPay =  { 
            confirm : function () {
                insight.getUnspentUtxos(addr, function(err, utxos) {
                    if (err) {
                        //trata erros
                    } else {
                        //console.log(utxos.toString());
                        //console.log(parseInt(ammount));
                        var tx = bitcore.Transaction();
                        tx.from(utxos);
                        tx.to(addr2, parseInt(ammount));
                        tx.change(addr);
                        tx.sign(privK);

                        tx.serialize();
                        insight.broadcast(tx, function(err, txId) {
                            if (err) {
                                //tratar erros.
                            } else {
                                //transação funcionou corretamente
                                var date = new Date();
                                var dateTime = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
                                registros.push({
                                    from: addr.toString(),
                                    to: addr2.toString(),
                                    desc: about,
                                    preco: ammount.toString(),
                                    data: dateTime
                                });
                                console.log(txId);
                                browser.storage.local.set({historico:registros});
                            }
                        });
                    }
                });
            }
        };
        var whitelisted = false;
        browser.storage.local.get(["whitelist"], function(data) {
            listed = data.whitelist;
            for (i in listed) {
                var url = "";
                browser.tabs.query({currentWindow:true, active:true}, function(tabs) {url = tabs[0].url});
                if (listed[i].url.indexOf(url) > -1 && listed[i].limit >= ammount) {
                    whitelisted = true;
                    break;
                }
            }
            if (!whitelisted) {
                browser.notifications.create("confirm", {
                    "type": "basic",
                    "iconUrl": browser.extension.getURL("icon.png"),
                    "title": "Pagamento requisitado",
                    "message": "A página requisitou um pagamento de "+ammount+" satoshis, com a descrição \""+about+"\", PARA CONFIRMAR CLIQUE NESSA NOTIFICAÇÃO, CASO CONTRÁRIO FECHE-A OU IGNORE-A"
                });            
            } else {
                confirmPay.confirm();
            }

            if (!inited && !whitelisted) {
                browser.notifications.onClicked.addListener(confirmPay.confirm);
                init();            
            }
        });
    }
}, {urls: ['<all_urls>']}, ['blocking', 'responseHeaders']);

