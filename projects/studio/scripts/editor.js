window.addEventListener("load", () => {
	inputArea = element("#codeInput")
	resultArea = element("#codeResult")
	linesArea = element("#codeLines")
	inputArea.onkeyup = () => {
		resultArea.innerHTML = inputArea.innerHTML
		changeWidth(inputArea); changeWidth(resultArea)
		
		let linesSplit = inputArea.innerText
		linesSplit = linesSplit.split("\n")
		lines = linesSplit.length
		if(linesSplit[linesSplit.length - 1] == "\n") boom.alert("bruh")
		let linesHtml = ""
		for(var i = 0; i < lines; i++) {
			linesHtml += `<span>${i + 1}</span><br>`
		}
		linesArea.innerHTML = linesHtml
		codeInput.style.height = resultArea.offsetHeight
	}
})

function changeWidth(el) {
	for(var i = 0; i < 10; i += 10) {
		setTimeout(() => {
			el.style.left = linesArea.offsetWidth
			el.style.width = `calc(100% - ${linesArea.offsetWidth}px)`
		}, i)
	}
}

let inputArea, resultArea, linesArea