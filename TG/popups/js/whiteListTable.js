browser.storage.local.get(["whitelist", "carteira"], function(data) {
	var listed = data.whitelist;
	console.log(data.whitelist);

	for (w in listed) {
		var url = listed[w].url
		var limit = listed[w].limit;

		var tBody = document.querySelector("#tableBody");
		
		var urlTd = document.createElement("td");
		var limitTd = document.createElement("td");
		
		urlTd.textContent = url;
		limitTd.textContent = limit;

		var tr = document.createElement("tr");

		tr.appendChild(urlTd);
		tr.appendChild(limitTd);
		
		tBody.appendChild(tr);
	}
});