const addrInput = document.querySelector("#addr");
const prikInput = document.querySelector("#pK");


function storeSettings () {
    browser.storage.local.set({
        carteira : {
            addr: addrInput.value,
            priv: prikInput.value
        }
    });
}

function updateUI(restoredSettings) {
    addrInput.value = restoredSettings.carteira.addr || "";
    prikInput.value = restoredSettings.carteira.priv || "";
}

function onError(e) {
    console.error(e);
}

const gettingStoredSettings = browser.storage.local.get();

gettingStoredSettings.then(updateUI, onError);

addrInput.addEventListener("blur", storeSettings);
prikInput.addEventListener("blur", storeSettings);
    
