
var carteira = {
    addr: "mzmGke6tuV6tWd2ycqRcL2JRyPwUEkHViG",
    priv: "7da504f07a59f5e00ec21b580968c46f429d14c9b3d1c41f5810bb0cdc01a558"
}

function onError(e) {
    console.log(e);
}

/*
    Guardar carteira padrão quando o plugin inicia.
*/

function checkStoredSettings(storedSettings) {
  if (!storedSettings.carteira) {
    browser.storage.local.set({carteira}); 
  }
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);
