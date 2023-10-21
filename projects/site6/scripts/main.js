let scroll = 0, popup = false

setTimeout(() => boom.reveal(), 10)

const main = {
	load() {
		history.pushState({page: 1}, "Home")
		skills.load()
		nav.load()
		footer.load()
		projects.tab("home")
		projects.tab("archive")
		design.load()
		rss.load()
		
		if(location.param("page") == undefined) return
		switch(location.param("page")) {
			case "project":
				projects.open(param("id"))
				break
			case "branding":
				this.popup(1)
				break
			case "archive":
				this.popup(2)
				break
			case "privacy":
				this.popup(3)
				break
			case "design":
				this.popup(4)
				break
			case "terms":
				this.popup(5)
				break
			default:
				console.error("404 page not found")
				break
		}
	},
	
	popup(id, result) {
		popup = true;
		switch(id) {
			case 0:
				result = "project"; break
			case 1:
				result = "branding"; break
			case 2:
				result = "archive"; break
			case 3:
				result = "privacy"; break
			case 4:
				result = "design"; break
			case 5:
				result = "terms"; break
		}
		if(id == 0) result += `&id=${projects.current}`
		history.replaceState({page: 1}, "Popup", `?page=${result}`)
		scroll = window.pageYOffset
		pages = elements("#popup main section")
		for(const page of pages) {
			page.style.display = "none"
		}
		pages[id].style.display = "block"
		element("#popup").classList.remove("reveal")
		element("#app").style.maxHeight = "0"
		element("#popup main").scrollTo(0, 0)
	},
	
	popdown() {
		popup = false
		history.pushState({page: 1}, "Home", "index.html")
		document.documentElement.style.scrollBehavior = 'auto'
		setTimeout(() => window.scrollTo(0, scroll), 1)
		setTimeout(() => document.documentElement.style.scrollBehavior = 'smooth', 1)
		element("#app").style.maxHeight = "fit-content"
		element("#popup").classList.add("reveal")
	}
}

const rss = {
	load() {
		fetch(this.url)
			.then(response => response.text())
			.then(str => new DOMParser().parseFromString(str, "text/xml"))
			.then(data => {
				data = new XMLSerializer().serializeToString(data.documentElement)
				this.convert(data)
			})
			.catch(err => {
				element("#vids").style.display = "none"
				console.error(err)
			})
	},
	convert(xml, html = "") {
		while(xml.includes("<div>")) {
			xml = xml.substring(xml.indexOf("<div>") + 10, xml.length)
			html += xml.substring(0, xml.indexOf("</div>") + 6).insert(xml.indexOf("<div") + 4, " class='reveal'")
		}
		element("#videos").innerHTML = html
	}
}

const nav = {
	load() {
		let html = ""
		for(const link of this.links) {
			html += `<li><a onclick="nav.open()" href="${link.link}">${link.title}</a></li>`
		}
		element("nav ul").innerHTML = html;
	},
	open() {
		element("#burger").classList.toggle("active")
		element("nav").classList.toggle("active")
	}
}

const skills = {
	load() {
		let html = ""
		for(const skill of this.list) {
			html += `<card-icon class="reveal" icon="./images/icons/${skill.icon}" title="${skill.title}"></card-icon>`
		}
		element("#skills").innerHTML = html;
	}
}

const design = {
	load(html = "", count = 0) {
		for(const object of this.list) {
			count++
			html += `<div class="block design"><div class="content"><div class="text">
								<h2 class="cat"`
			if(count == 1) html+= " id='first'"
			html += `>${object.title}</h2>
								<iframe height="300" style="width: 100%" scrolling="no" src="https://codepen.io/mrboomdeveloper/embed/preview/${object.code}?default-tab=html&theme-id=dark" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
							</div>
							<div class="grid">${object.content}</div>
							</div></div></div>`
		}
		element("#design").innerHTML = html
	}
}

const projects = {
	tab(page) {
		let html = ""
		for(const cat of this.cats[page]) {
			html += `<h2 class="cat">${cat.title}</h2><div class="grid">`
			for(const projectId of cat.content) {
				const project = this.all[projectId]
				html += `<card-product class="reveal" onclick="` + (project.description != undefined ?
					`projects.open(${projectId})` : `go(${project.link})`)
				html += `" clickable title="${project.name}" description="${project.description || project.link}" 
					banner="./images/banners/${project.id}.jpg" tags="${project.tags}"></card-product>`
			}
			html += "</div>"
		}
		fill = page == "home" ? "#projects .content" : "#archive .content"
		element(fill).innerHTML = html
	},
	open(id) {
		this.current = id
		media = this.all[id]
		element("#banner").src = `./images/banners/${media.id}.jpg`
		element("#title").innerHTML = media.name
		element("#tags").innerHTML = media.tags
		element("#description").innerHTML = media.description
		let html = ""
		for(var i = 1; i < 6; i++) {
			const screenshot = media.id + "" + i
			html += `<a target="_blank" href="./images/screenshots/${screenshot}.jpg">
				<card-simple clickable icon="./images/screenshots/${screenshot}.jpg"></card-simple>
			</a>`
		}
		element("#screenshots").innerHTML = html;
		main.popup(0)
	},
	download() {
		go(this.all[this.current].link)
	},
	trailer() {
		go(this.all[this.current].trailer)
	}
}

const footer = {
	load() {
		let html = ""
		for(const link of this.social) {
			html += `<li><a href="${link.url}" target="_blank"><img src="./images/icons/${link.icon}" title="${link.title}" alt="${link.title}"/></a>`
		}
		element("#social").innerHTML = html; html = ""
		for(const link of this.links) {
			html += `<li><a href="` + (link.url != undefined ? 
				`${link.url}" target="_blank">` : `javascript:void(0)" onclick="main.popup(${link.popup})">`) +
				`${link.title}</a></li>`
		}
		element("#links").innerHTML = html;
	}
}

window.addEventListener("scroll", () => boom.reveal() )

window.addEventListener('popstate', event => {
	if(location.hash != undefined) {
		history.replaceState(null, null, ' ')
		return
	}
	popup ? main.popdown() : history.back()
})