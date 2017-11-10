


browser.storage.local.get(["historico", "carteira"], function(data) {
	var history = data.historico;

	for (h in history) {
		var to = history[h].to;
		var desc = history[h].desc;
		var price = history[h].preco;
		var data = history[h].data;

		var tBody = document.querySelector("#tableBody");
		
		var toTd = document.createElement("td");
		var priceTd = document.createElement("td");
		var descTd = document.createElement("td");
		var dataTd = document.createElement("td");

		toTd.textContent = to;
		priceTd.textContent = price;
		descTd.textContent = desc;
		dataTd.textContent = data;

		var tr = document.createElement("tr");

		tr.appendChild(toTd);
		tr.appendChild(descTd);
		tr.appendChild(priceTd);
		tr.appendChild(dataTd);
		
		tBody.appendChild(tr);
	}
});