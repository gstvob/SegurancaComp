var listed = [];

const urlInput = document.querySelector("#URL");
const limitInput = document.querySelector("#limit");
const button = document.querySelector("#btnSubmit");

function storeSettings () {
	if (limitInput.value != "" && urlInput.value != "") {
	    listed.push({
	    	url:urlInput.value,
	    	limit:limitInput.value
	    });
    	browser.storage.local.set({whitelist:listed});
		urlInput.value = "";
		limitInput.value = "";
	}

}
function onError(e) {
    console.error(e);
}

 button.addEventListener("click", storeSettings);

//urlInput.addEventListener("beforeSubmit", storeSettings);
//limitInput.addEventListener("beforeSubmit", storeSettings);
    
