const code = {
	format() {
		while(input.innerHTML.includes(" \n")) { input.innerHTML = input.innerHTML.replaceAll(" \n", "\n") }
		while(input.innerHTML.includes("\n ")) { input.innerHTML = input.innerHTML.replaceAll("\n ", "\n") }
		input.innerHTML = input.innerHTML.replaceAll("<div><br></div>", "").replaceAll("<br><div>", "").replaceAll("<div>", "\n")
		input.innerHTML = input.innerHTML.replaceAll(" \n", "\n").replaceAll("\n\n", "\n").replaceAll("\t", "")
		input.innerHTML = input.innerHTML.replaceAll("\t\n", "").replaceAll("<div><br></div>", "\n").replace("run", "\nrun")
		/*//input.innerHTML = input.innerHTML.replaceAll("")
		//TODO: Fix phantom lines
		
		let runn = input.innerHTML.substring(input.innerHTML.indexOf("app"), input.innerHTML.indexOf("\nrun") - 1)
		let runnF = runn.replaceAll("\n", "\n\t")
		input.innerHTML = input.innerHTML.replace(runn, runnF)*/
		
		/* THESE LINES ARE CURRENTLY IN DEVELOPMENT
		runn = input.innerHTML.substring(input.innerHTML.indexOf("\nrun") + 4, input.innerHTML.length)
		runnF = runn.replaceAll("\n", "\n\t")
		input.innerHTML = input.innerHTML.replace(runn, runnF)*/
		
		highlight()
	},
	compile() {
		compilier.start()
			.then(() => boom.alert("Приложение завершено!"))
			.catch(() => boom.alert("Произошла ошибка во время компиляции приложения"))
			.finally(() => {
				location.hash = ""
				location.hash = "compilied"
			})
	}
}

const compilier = {
	start() {
		return new Promise(function(next, error) {
			boom.alert("Запуск компилятора...")
			const html = compilier.translateAll(input.innerText.replaceAll("\t", ""))
			html.startsWith != null ? next(html) : error(html)
		})
	},
	translateAll(text) {
		let res = ""
		try {
		for(let fun of text.split("\n")) {
			fun = fun.trim()
			if(fun.startsWith("app")) {
				res += fun.replace("app", "program") + ";"
			}
			if(fun.startsWith("const")) {
				res += fun.replace("\n", "") + ";"
			}
			if(fun.startsWith("int")) {
				res += fun.replace("int", "var") + " : Integer;"
			}
			if(fun.startsWith("run")) {
				res += "begin"
			}
			if(fun.startsWith("log")) {
				res += fun.replace("log", "println").replace("\n", "") + ";"
			}
			res += "<br>"
		}
		res += "end."
		} catch(e) {
			this.result(this.error + "<br><br>" + e)
			return null
		}
		this.result(res)
		return res
	},
	result(text) {
		logs.innerHTML = text
	},
	error: "Во время компиляции вашего приложения произошла ошибка (╯°□°）╯︵ ┻━┻"
}

window.onload = () => {
	input = element("#input")
	result = element("#result")
	wrapper = element(".codeWrapper")
	lineN = element("#lineNumber")
	logs = element("#compilied")
	input.innerHTML = exampleCode
	element("#run").onclick = code.format

	element("#compile").onclick = code.compile
	highlight()
	let trans, timed = 0
	
	input.onkeyup = () => highlight()
	input.addEventListener("transitionrun", () => {
		for(var i = 0; i < 300; i++) {
			setTimeout(() => wrapper.style.height = result.offsetHeight, i)
		}
	})
}

function highlight() {
	let firstQuote = true, firstScope = true, lines = 0
	word = "", hf = ""
	for (const char of input.innerHTML.replaceAll("\t", "    ")) {
		switch (char) {
			case `"`:
			case `'`:
			case "`":
				finishWord()
				if (firstQuote) {
					hf += `<span color="green">${char}`
					firstQuote = false
				} else {
					hf += `${char}</span>`
					firstQuote = true
				}
				break
			case "(":
			case ")":
				finishWord()
				if(firstScope) {
					hf += `${char}<span color="var">`
					firstScope = false
				} else {
					hf += `</span>${char}`
					firstScope = true
				}
				break
			case "+": case "-":
			case "*": case ":": case "=":
				finishWord()
				hf += `<span color="default">${char}</span>`
				break
			case " ":
				finishWord()
				hf += char
				break
			case "\n":
				finishWord()
				hf += char
				break
			default:
				word += char
				wordFinished = false
				break
		}
	}
	
	result.innerHTML = (hf + word)
	changeWidth(result)
	changeWidth(input)
	
	let linesSplit = input.innerHTML
	linesSplit = linesSplit.replaceAll("<div>", "\n")
	linesSplit = linesSplit.replaceAll("<div>", "").replaceAll("</div>", "").split("\n")
	lines = linesSplit.length
	
	let linesHtml = ""
	for(var i = 0; i < lines; i++) {
		linesHtml += `<span>${i + 1}</span><br>`
	}
	lineN.innerHTML = linesHtml
	wrapper.style.height = result.offsetHeight
}

function changeWidth(el) {
	for(var i = 0; i < 10; i += 10) {
		setTimeout(() => {
			el.style.left = lineN.offsetWidth
			el.style.width = `calc(100% - ${lineN.offsetWidth}px)`
		}, i)
	}
}

function finishWord() {
	wordFinished = true
	let end = false
	
	if(word.includes("<div><br></div>")) end = true
	if(keywords.hasOwnProperty(word)) {
		console.debug("Style default", word)
		hf += keywords[word]
		word = ""
		return
	}
	
	if(word.startsWith("<div>")) {
		let ward = word
		if(end) ward = ward.replaceAll("<div><br></div>", "")
		ward = ward.substring(5, ward.length)
		if(keywords.hasOwnProperty(ward)) {
			console.debug("Style with Open", word)
			if(end) hf += "\n"
			if(word.split("<br>").length > 1) {
				for(var i = 1; i < word.split("<br>").length; i++) { hf += "\n" }
			} else { hf += "\n" }
			hf += keywords[ward]
			word = ""
			return
		}
	}
	
	if(word.startsWith("</div><div>")) {
		let ward = word.substring(11, word.length)
		if(ward.includes("<br>")) end = true
		ward = ward.replaceAll("<br></div><div>", "")
		if(keywords.hasOwnProperty(ward)) {
			console.debug("Style with Close/Open", ward)
			if(end) hf += "\n"
			for(var i = 1; i < word.split("<br>").length; i++) {
				hf += "\n"
			}
			
			if(word.split("<br>").length < 2) hf += "\n"
			hf += keywords[ward]
			word = ""
			return
		}
	}
	
	//Фиг знает что делать с этим кодом. Если без него все будет работать, то удалю его. Когда-нибудь.
	/*word = word.replaceAll("|%|", "")
	if(keywords.hasOwnProperty(word.trim())) {
		console.debug("Style with Trim", word.trim())
		console.error(hf)
		hf += "\t" + keywords[word.trim()]
		console.error(hf)
		return
	}*/
	
	console.debug("Dont style", word)
	hf += word
	word = ""
}

const keywords = {
	app: "<span color='main'>app</span>",
	const: "<span color='main'>const</span>",
	int: "<span color='main'>int</span>",
	run: "<span color='main'>run</span>"
}

const exampleCode = `app hello_world
\tconst message = "Hello World!"
\nrun
\tlog(message)`

let result, input, word, hf, wrapper, lineN, wordFinished = false, logs