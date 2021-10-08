const CustomSelect = (function () {
	function Controller() {
		let myModel = null;
		let myView = null;
		let ui = null;

		this.init = (select, model, view) => {
			myModel = model;
			myView = view;

			const uniqueId = myModel.init();
			const data = myView.init(select, uniqueId);
			ui = data.ui;
			myModel.setOptions(data.options);
			myView.setOptions(myModel.getOptions());
			myView.setInputValue(myModel.getValueForInput());

			ui.customSelect.addEventListener("click", (e) =>
				myView.setOpen(e.target)
			);

			ui.arrowBack.addEventListener("click", (e) => {
				e.stopPropagation();
				myView.setClose(myModel.getOptions());
				myView.setInputValue(myModel.getValueForInput());
			});

			ui.optionsList.addEventListener("click", (e) => {
				const count = myView.setChecked(e.target);
				myView.setCounters(count);
			});

			ui.saveBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				myModel.setOptions(myView.saveData());
				const options = myModel.getOptions();
				myView.setClose(options);
				myView.setInputValue(myModel.getValueForInput());
				myView.setValuesToOriginalSelect(options.selected);
			});

			ui.clearBtn.addEventListener("click", (e) => {
				myView.clearAll();
				myView.setCounters(0);
			});

			ui.searchInput.addEventListener("input", () => {
				const query = myView.getSearchQuery();
				myView.setOptions(myModel.getSearchedOptions(query));
			});
		};
	}

	function Model() {
		let myOptions = null;
		let selectedOptions = null;

		this.init = () => this.makeUniqueId();

		this.setOptions = (options) => {
			myOptions = options;
			selectedOptions = options.filter((obj) => obj.isSelected);
		};

		this.getOptions = () => ({ selected: selectedOptions, options: myOptions });

		this.getSearchedOptions = (query) => {
			if (query) {
				const searchedOptions = myOptions.map((obj) => {
					const highlighted = obj.content.split(query).join(`<b>${query}</b>`);
					return obj.content.includes(query)
						? {
								...obj,
								content: highlighted,
						  }
						: obj;
				});
				return { options: searchedOptions, selected: selectedOptions };
			} else {
				return this.getOptions();
			}
		};

		this.getValueForInput = () =>
			selectedOptions.map((obj) => obj.content).join(", ");

		this.makeUniqueId = (idLength = 15) => {
			const possible =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			let uniqueId = "";
			for (let i = 0; i < idLength; i++)
				uniqueId += possible.charAt(
					Math.floor(Math.random() * possible.length)
				);
			return uniqueId;
		};
	}

	function View() {
		let ui = null;

		this.init = (select, uniqueId) => {
			select.style.display = "none";
			select.setAttribute("multiple", "multiple");
			select.insertAdjacentHTML(
				"afterend",
				this.getCustomSelectHTML(uniqueId, select.getAttribute("data-title"))
			);
			ui = { original: select, originalOptions: [...select.options] };
			return {
				ui: this.getUI(uniqueId),
				options: this.getValuesFromOriginalSelect(),
			};
		};

		this.getUI = (uniqueId) => {
			ui.customSelect = document.getElementById(uniqueId);
			ui.arrowBack = ui.customSelect.querySelector(".arrowBack");
			ui.searchInput = ui.customSelect.querySelector("input");
			ui.selectedCount = ui.customSelect.querySelector(".selectedNumber span");
			ui.showSelected = ui.customSelect.querySelector(".showSelected");
			ui.showSelectedCount =
				ui.customSelect.querySelector(".showSelected span");
			ui.optionsList = ui.customSelect.querySelector("ul");
			ui.optionsItems = ui.optionsList.childNodes;
			ui.saveBtn = ui.customSelect.querySelector("button:nth-child(1)");
			ui.clearBtn = ui.customSelect.querySelector("button:nth-child(2)");
			return ui;
		};

		this.getValuesFromOriginalSelect = () =>
			ui.originalOptions.map((option) =>
				this.makeDataObject(
					option.value,
					option.textContent,
					option.getAttribute("selected") !== null ? true : false
				)
			);

		this.makeDataObject = (value, content, isSelected) => ({
			value,
			content,
			isSelected,
		});

		this.setOptions = (options) => {
			let items = "";
			options.options.forEach(
				(o) => (items += this.getListItemHTML(o.value, o.content, o.isSelected))
			);
			ui.optionsList.innerHTML = items;
			this.setCounters(options.selected.length);
		};

		this.setCounters = (count) => {
			ui.selectedCount.textContent = count;
			if (count) {
				ui.showSelected.classList.add("active");
				ui.showSelectedCount.textContent = count;
			} else {
				ui.showSelected.classList.remove("active");
			}
		};

		this.getCustomSelectHTML = (id, title) => {
			return `<div class="ozitagCustomSelect" id="${id}">
						<header>
							<div class="empty">
								<span class="arrowBack"></span>
								<h1>${title ?? "Выбор элементов"}</h1>
								<a class="selectedNumber">Выбрано (<span></span>)</a>
								<a class="showSelected">Показать выбранное (<span></span>)</a>
							</div>
							<input type="text" placeholder="Поиск...">
						</header>
						<section class="main">
							<ul></ul>
						</section>
						<footer>
							<button>Применить</button>
							<button>Очистить</button>
						</footer>
					</div>`;
		};

		this.getListItemHTML = (value, content, isChecked) => {
			return `<li 
					 ${isChecked ? 'class="checked"' : ""} 
					 data-value="${value}"
				  >
					 <span class="checkbox"></span>
					 <span class="content">${content}</span>
				  </li>`;
		};

		this.getSearchQuery = () => ui.searchInput.value;

		this.setInputValue = (value) => {
			ui.searchInput.value = value;
			ui.searchInput.className = value ? "filled" : "";
		};

		this.setOpen = (target) => {
			if (
				!ui.customSelect.classList.contains("open") &&
				(target.tagName === "A" || target.tagName === "INPUT")
			) {
				ui.customSelect.classList.add("open");
				this.setInputValue("");
			}
		};

		this.setClose = (options) => {
			ui.customSelect.classList.remove("open");
			this.setOptions(options);
		};

		this.setChecked = (target) => {
			const item = target.closest("li");
			if (!item) return;
			item.classList.toggle("checked");
			return [...ui.optionsItems].filter((item) =>
				item.classList.contains("checked")
			).length;
		};

		this.saveData = () =>
			[...ui.optionsItems].map((option) =>
				this.makeDataObject(
					option.getAttribute("data-value"),
					option.textContent.trim(),
					option.classList.contains("checked") ? true : false
				)
			);

		this.clearAll = () => {
			ui.optionsItems.forEach((e) => e.classList.remove("checked"));
		};

		this.setValuesToOriginalSelect = (values) => {
			ui.originalOptions.forEach((o) =>
				values.find((obj) => obj.value === o.value)
					? o.setAttribute("selected", "selected")
					: o.removeAttribute("selected")
			);
			ui.original.dispatchEvent(new Event("change"));
		};
	}

	return {
		init: function (...target) {
			(target.length ? target : document.querySelectorAll(".ozitag")).forEach(
				(select) => {
					const moduleView = new View();
					const moduleModel = new Model();
					const moduleController = new Controller();
					moduleController.init(select, moduleModel, moduleView);
				}
			);
		},
	};
})();
