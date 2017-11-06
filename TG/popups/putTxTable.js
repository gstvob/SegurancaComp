


browser.storage.local.get(["historico", "carteira"], function(data) {
	var history = data.historico;

	for (h in history) {
		var to = history[h].to;
		var desc = history[h].desc;
		var price = history[h].preco;

		var tBody = document.querySelector("#tableBody");
		
		var toTd = document.createElement("td");
		var priceTd = document.createElement("td");
		var descTd = document.createElement("td");
		
		toTd.textContent = to;
		priceTd.textContent = price;
		descTd.textContent = desc;

		var tr = document.createElement("tr");

		tr.appendChild(toTd);
		tr.appendChild(descTd);
		tr.appendChild(priceTd);

		tBody.appendChild(tr);
	}
});