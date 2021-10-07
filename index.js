new CustomSelect.init();

/*
	The code below is given to demonstrate the possibility of binding an event listener "change" to a select
*/

const selects = document.querySelectorAll(".ozitag");
selects.forEach((select) => {
	select.addEventListener("change", () => {
		let result = [];
		[...select.options].forEach((o) => {
			if (o.getAttribute("selected")) result.push(o.value);
		});
		if (result) alert("Выбранные опции: " + result.join(", "));
	});
});
