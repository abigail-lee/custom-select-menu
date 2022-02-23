var optionList, optionItem, buttonTemplate;

function CustomSelectMultiple(){
	var custom, i, ll, selElmnt, selectedItem;


	/* Look for any elements with the class "custom-select": */
	custom = document.getElementsByClassName("custom-select__multiple");

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
		  const alert = document.createElement("div");

		  search.classList.add("custom-search");
		  form.type = "text";
		  form.id = `searchItems-${i}`;
		  form.placeholder = "Search";
		  label.for = `searchItems-${i}`;
		  label.innerText = "Search";
		  alert.classList.add("alert-holder")
		  alert.innerHTML = "<span class='status-message'>You may select a maximum of 5 items.<br/> Please remove one or more items before selecting another.</span>";

		  search.appendChild(label);
		  search.appendChild(form);
		  search.appendChild(alert)
		  optionList.appendChild(search);

		  alert.addEventListener("click", (e) => {
		  	e.stopPropagation();
		  	e.target.classList.remove("alert__active");
		  });

		  form.addEventListener("keyup", event => {
		  	event.stopPropagation();

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

	  createItems(ll, selElmnt);

	  custom[i].appendChild(optionList);

	  selectedItem.addEventListener("click", function(e) {
	    /* When the select box is clicked, close any other select boxes,
	    and open/close the current select box: */

	    e.stopPropagation();
	    // closeAllSelect(this);
	    // if (this.nextSibling.classList.contains("select-hide")) {
	    // 	this.nextSibling.classList.remove("select-hide");
	    // } else {
	    // 	console.log(this);
	    // }

			this.nextSibling.classList.toggle("select-hide");   
	    this.classList.toggle("select-arrow-active");

	    /* scroll to the top of the menu */

	  });

	  selectedItem.addEventListener("keyup", e => {
	  	if(e.keyCode === 13) {
					e.preventDefault();
					e.target.click();
				}
	  })

	  optionList.querySelectorAll(".custom-opt")[0].click();
	  optionList.querySelectorAll(".custom-opt")[1].click();
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
	    	x[i].scrollTop = 0;
	      x[i].classList.add("select-hide");
	    }
	  }
	}

	/* If the user clicks anywhere outside the select box,
	then close all select boxes: */
	document.addEventListener("click", (e) => {
		if (e.target.nodeName == "INPUT") { return; }
		closeAllSelect()
	}); 
}

function updateMultipleSelect(menu){
	let currentCustom = menu.parentElement,
		currentItems = currentCustom.querySelectorAll(".custom-opt, .same-as-selected"),
		currentTop = currentCustom.querySelector(".select-selected");

	currentItems.forEach(item => {
		item.remove();
	})

	createItems(menu.options.length, menu);
	currentTop.innerHTML = menu.options[0].innerHTML;
	triggerChange(menu);
}

function createItems(length, menu) {
	/* store current items in multiselect */
	let activeSelection = [];

	/* store the button template */
	buttonTemplate = document.getElementById("active-option-template");


	for (let j = 1; j < length; j++) {
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
      e.stopPropagation();

      originalSelect = this.parentNode.parentNode.getElementsByTagName("select")[0];
      h = this.parentNode.previousSibling;

      for (i = 0; i < originalSelect.length; i++) {
        if (originalSelect.options[i].innerHTML == this.innerHTML) {
          let val = originalSelect.options[i].value;

          // if this is the first time something as been selected, 
          // remove the placeholder from selected options
          originalSelect.options[0].selected = false;

          // check whether this item is already an active option
          // add or remove it accordingly
          if (activeSelection.indexOf(val) == -1 && activeSelection.length < 5) {
          	if (h.childNodes.length == 1 && h.childNodes[0].nodeType == 3) { h.innerHTML = '' };
          	const btn = buttonTemplate.cloneNode(true);

          	btn.id = `selected-${val}`;
          	btn.classList.add('active-option');
          	btn.querySelector(".label").innerHTML = this.innerHTML;

          	btn.addEventListener("click", event => {
          		event.stopPropagation();
					  	removeSelected(this);
					  });   

          	// create the button holding our newly selected filter
          	// update the hidden select menu to select its option equivalent
          	// push the value to our activeSelection variable keeping track
          	// add the selected class
          	h.appendChild(btn);
          	originalSelect.options[i].selected = true;
          	activeSelection.push(val);
          	this.setAttribute("class", "same-as-selected custom-opt");

          	// trigger a change on the select menu so that vue can catch it
          	triggerChange(originalSelect);
          } else if (activeSelection.length == 5 && !this.classList.contains("same-as-selected")) {
        		let alert = document.querySelector(".alert-holder");
        		alert.classList.add("alert__active");
        		          	
					} else {
          	removeSelected(this);
          }

          function removeSelected(el){
          	originalSelect.options[i].selected = false;
          	h.querySelector(`#selected-${val}`).remove();
          	activeSelection = activeSelection.filter(opt => {
          		return opt !== val;
          	});

          	el.classList.remove("same-as-selected");

          	// if activeSelection length is zero, show placeholder text
          	if (activeSelection.length == 0) {
          		h.innerHTML = "Select an item";
          	}

          	let alert = document.querySelector(".alert-holder");
						if (alert.classList.contains("alert__active")) { alert.classList.remove("alert__active") }

          	triggerChange(originalSelect);
          }         

          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;

          // for (k = 0; k < yl; k++) {
          //   y[k].removeAttribute("class");
          // }

          break;
        }
      }

      // triggerChange(originalSelect); 
      // h.click();
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

    optionList.appendChild(optionItem);
  }
}

function triggerChange(elem) {
	let changeEvent = new Event('change');
	elem.dispatchEvent(changeEvent);
}

export { CustomSelectMultiple, updateMultipleSelect };