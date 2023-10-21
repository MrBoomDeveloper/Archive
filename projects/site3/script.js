var hidden = document.getElementsByClassName("hideable");
var header = document.getElementById("header");
var top_menu = document.getElementById("top-menu");
var acc = document.getElementsByClassName("accordion");
var errorDiv = document.getElementById("error");
var last_scrolled = 0;
var i;

function error() {
	errorDiv.style.display = "block";
}

function closeErr() {
	errorDiv.style.display = "none";
}

window.addEventListener("load", function(){
	for (let h = 0; h < hidden.length; h++) {
		hidden[h].classList.toggle("hidden");
	}
});

function toggleMenu(x) {
  x.classList.toggle("change");
  top_menu.classList.toggle("menu-hidden");
}

window.addEventListener('scroll', function() {
	if(window.pageYOffset > last_scrolled) {
		if(top_menu.classList.contains("menu-hidden")) {
			if(window.pageYOffset > 50) {
				header.className = "header-hidden";
			}
		}
	} else {
		header.className = "";
	}
	last_scrolled = window.pageYOffset;
});

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

location.hash = "";