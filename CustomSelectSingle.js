var optionList, optionItem;

function CustomSelectSingle(){
	var custom, i, j, ll, selElmnt, selectedItem;

	/* Look for any elements with the class "custom-select": */
	custom = document.getElementsByClassName("custom-select__single");

	for (i = 0; i < custom.length; i++) {
	  selElmnt = custom[i].getElementsByTagName("select")[0];
	  ll = selElmnt.length;

	  /* For each element, create a new DIV that will act as the selected item: */
	  selectedItem = document.createElement("DIV");
	  selectedItem.setAttribute("class", "select-selected");
	  selectedItem.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
	  custom[i].appendChild(selectedItem);
	  selectedItem.setAttribute("tabIndex", 0);

	  /* For each element, create a new DIV that will contain the option list: */
	  optionList = document.createElement("DIV");
	  optionList.setAttribute("class", "select-items select-hide");

	  /* Create search bar */
	  function addSearch(){
		  const search = document.createElement("div");
		  const form = document.createElement("input");
		  const label = document.createElement("label");

		  search.classList.add("custom-search");
		  form.type = "text";
		  form.id = `searchItems-${i}`;
		  form.placeholder = "Search";
		  label.for = `searchItems-${i}`;
		  label.innerText = "Search";

		  search.appendChild(label);
		  search.appendChild(form);
		  optionList.appendChild(search);

		  form.addEventListener("keyup", event => {
		  	event.stopPropagation()
		  	let optionList = event.target.parentElement.parentElement;

		  	let value = event.target.value,
		  		 	items = optionList.querySelectorAll(".custom-opt");


		  	if (items.length > 0) {
		  		let termToSearch = new RegExp(value, "gi");

		  		items.forEach(item => {
		  			if (item.innerText.search(termToSearch) == -1){
		  				item.classList.add("select-hide");
		  			} else {
		  				item.classList.contains("select-hide") ? item.classList.remove("select-hide") : "";
		  			}
		  		})
		  	} else {
		  		optionList.innerHTML += "There's nothing to show."
		  	}

		  })	  	
	  }

	  if (custom[i].classList.contains("custom-searchable")) {
	  	addSearch();
	  }

		createItems(ll, selElmnt, optionList);	  

	  custom[i].appendChild(optionList);
	  selectedItem.addEventListener("click", function(e) {
	    /* When the select box is clicked, close any other select boxes,
	    and open/close the current select box: */
	    e.stopPropagation();
	    closeAllSelect(this);
	    this.nextSibling.classList.toggle("select-hide");
	    this.classList.toggle("select-arrow-active");
	  });

	  selectedItem.addEventListener("keyup", e => {
	  	if(e.keyCode === 13) {
					e.preventDefault();
					e.target.click();
				}
	  })
	}

	function closeAllSelect(elmnt) {
	  /* A function that will close all select boxes in the document,
	  except the current select box: */
	  var x, y, i, xl, yl, arrNo = [];
	  x = document.getElementsByClassName("select-items");
	  y = document.getElementsByClassName("select-selected");
	  xl = x.length;
	  yl = y.length;
	  for (i = 0; i < yl; i++) {
	    if (elmnt == y[i]) {
	      arrNo.push(i)
	    } else {
	      y[i].classList.remove("select-arrow-active");
	    }
	  }
	  for (i = 0; i < xl; i++) {
	    if (arrNo.indexOf(i)) {
	      x[i].classList.add("select-hide");
	    }
	  }
	}

	/* If the user clicks anywhere outside the select box,
	then close all select boxes: */
	document.addEventListener("click", (e) => {
		if (e.target.nodeName == "INPUT") { return; }
		closeAllSelect();
	}); 
}

function updateSelect(menu, selIndex){
	let currentCustom = menu.parentElement,
		currentItems = currentCustom.querySelectorAll(".custom-opt", ".same-as-selected"),
		currentTop = currentCustom.querySelector(".select-selected");

	currentItems.forEach(item => {
		item.remove();
	});

	optionList = menu.parentElement.querySelector(".select-items");

	createItems(menu.options.length, menu, optionList);
	currentTop.innerHTML = menu.options[0].innerHTML;

	if (selIndex != undefined) { 
		let options = optionList.querySelectorAll(".custom-opt");
		options[selIndex].click() 
	} else {
		triggerChange(menu);
	}
}

function createItems(length, menu, container) {

  for (let j = 0; j < length; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    optionItem = document.createElement("DIV");
    optionItem.classList.add("custom-opt");
    optionItem.setAttribute("tabIndex", 0);
    optionItem.innerHTML = menu.options[j].innerHTML;

    optionItem.addEventListener("click", function(e) {
      /* When an item is clicked, update the original select box,
      and the selected item: */
      var y, i, k, originalSelect, h, yl;

      originalSelect = this.parentNode.parentNode.getElementsByTagName("select")[0];
      h = this.parentNode.previousSibling;

      for (i = 0; i < originalSelect.length; i++) {
        if (originalSelect.options[i].innerHTML == this.innerHTML) {
          originalSelect.selectedIndex = i;
          h.innerHTML = this.innerHTML;

          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;

          for (k = 0; k < yl; k++) {
            y[k].classList.remove("same-as-selected");
          }

          this.setAttribute("class", "same-as-selected custom-opt");
          break;
        }
      }

      triggerChange(originalSelect);        
      h.click();
    });

    // keyboard controls
    optionItem.addEventListener("keyup", e => {
			if(e.keyCode === 13) {
				e.preventDefault();
				e.target.click();
			}
		});

    // easy menu exit
		optionItem.addEventListener("keyup", e => {
			if(e.keyCode === 27) {
				e.preventDefault();
				let sel = optionItem.parentElement.previousSibling;
				sel.click();
			}
		});

    container.appendChild(optionItem);
  }
}

function triggerChange(elem) {
	let changeEvent = new Event('change');
	elem.dispatchEvent(changeEvent);
}

export { CustomSelectSingle, updateSelect };