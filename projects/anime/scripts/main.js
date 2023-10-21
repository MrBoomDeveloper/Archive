let request = "home";
let curr = 0;

const main = {
	load: function() {
		cookies.set("logs", true);
	},
	
	popup: function(page) {
		pages = elements("#popup main section");
		for(var i = 0; i < pages.length; i++) {
			pages[i].style.display = "none";
		}
		pages[page].style.display = "block";
		element("#popup").classList.remove("reveal");
	},
	
	back: function() {
		element("#popup").classList.add("reveal");
	}
}

const search = {
	open: function() {
		console.log("search not available currently");
	}
}

const profile = {
	open: function() {
		console.log("profile not available currently");
	}
}

const anilist = {
	open: function(id) {
		request = "preview";
		this.request([id]);
		element("#popup .wrapper").style.display = "none";
		curr = id;
		main.popup(0);
	},
	
	watch: function() {
		request = "index";
		this.request([curr]);
	},
	
	options: function() {
		console.log("options not available currently");
	},
	
	request: function(arg) {
		switch(request) {
			case "index":
				var url = anilibria.host, options = {
					method: 'POST', headers: request_headers,
					body: JSON.stringify({ query: "random_release" })
				}
				break;
			default:
				var variables = { id: arg[0] }
				var url = anilist.host, options = {
					method: 'POST', headers: request_headers,
					body: JSON.stringify({ query: this.about, variables: variables })
				}
				break;
		}
		fetch(url, options)
			.then(this.handleResponse)
			.then(this.handleData)
			.catch(this.handleError);
	},
	
	handleResponse: function(response) {
		return response.json().then(function (json) {
			return response.ok ? json : Promise.reject(json);
		});
	},
	
	handleData: function(data) {
		//console.debug(JSON.stringify(data));
		element("#popup .wrapper").style.display = "block";
		switch(request) {
			case "preview":
				var html = "";
				tags_html = "";
				media = data.data.Media;
				element("#banner").src = media.bannerImage;
				element("#title").innerHTML = media.title.english;
				meta_html = util.meta(media.startDate.year, false);
				meta_html += util.meta(media.format, true);
				meta_html += util.meta(media.status, true);
				meta_html += util.meta(media.type, true);
				meta_html += util.meta(media.countryOfOrigin, true);
				if(media.isAdult) meta_html += util.meta("18+", true);
				element("#meta").innerHTML = meta_html;
				eps_html = '<p>' + util.meta(media.episodes + " Episodes", false);
				eps_html += util.meta(media.duration + " Minutes", true);
				element("#episodes").innerHTML = eps_html;
				counter.nextEp(media.nextAiringEpisode);
				for(var i = 0; i < media.tags.length; i++) {
					tags_html += util.tag(media.tags[i].name);
				}
				element("#tags").innerHTML = tags_html;
				element("#description").innerHTML = media.description.replace("<br>", "").replace("</br>", "");
				score = element("#rating h3");
				score.innerHTML = media.averageScore;
				html = "";
				for(var i = 0; i < media.externalLinks.length; i++) {
					html += util.external(media.externalLinks[i]);
				}
				element("#external").innerHTML = html;
				element("#watch").innerHTML = media.type == "ANIME" ? "Watch now" : "Read now";
				trailer.load(media.trailer);
				break;
				
			case "index":
				console.debug("lol");
				console.debug(JSON.stringify(data));
				break;
		}
	},
	
	handleError: function(error) {
		console.debug(JSON.stringify(error));
	}
}

const counter = {
	nextEp: function(object) {
		if(object == null) {
			this.stop();
			return;
		}
		time = object.timeUntilAiring;
		element("#nextEp").innerHTML = "Until next episode: " + this.convert(time);
		this.countdown = setInterval(() => {
			element("#nextEp").innerHTML = "Until next episode: " + this.convert(time);
			time -= 1;
			if(time < 1000) this.stop();
		}, 1000);
	},
	convert: function(s) {
		result = "";
		date = new Date(s * 1000);
		days = s / 60 / 60 / 24;
		if(parseInt(days) > 0) result = parseInt(days) + " days ";
		hours = (s / 60 / 60) - parseInt(days) * 24;
		if(parseInt(hours)) result += parseInt(hours) + " hours ";
		if(date.getMinutes() > 0) result += date.getMinutes() + " minutes ";
		result += date.getSeconds() + " seconds ";
		return result;
	},
	stop: function() {
		element("#nextEp").style.display = "none";
		clearInterval(this.countdown);
	}
}

const trailer = {
	watch: function() {
		switch(this.site) {
			case "youtube":
				go("https://www.youtube.com/watch?v=" + this.id);
				break;
		}
	},
	load: function(object) {
		btn = element("#trailer");
		if(object == null) {
			btn.style.display = "none";
			return;
		}
		this.site = object.site;
		this.id = object.id;
		btn.style.display = this.site != "youtube" ? "none" : "block";
	}
}

const util = {
	meta: function(name, dot) {
		result = '<span>';
		if(dot) result+= ' · ';
		result += this.tags.hasOwnProperty(name) ? this.tags[name] : name;
		result += '</span>';
		return result;
	},
	tag: function(name) {
		result = '<span class="tag">';
		result += this.tags.hasOwnProperty(name) ? this.tags[name] : name;
		result += '</span>';
		return result;
	},
	external: function(ex) {
		result = '<a target="_blank" href="' + ex.url + '"><span class="tag link clickable">';
		result += '<img src="' + ex.icon + '"';
		result += ex.icon != undefined ? '/>' : ' style="width: 0; margin: 0"/>';
		result += '<span>' + ex.site + '</span></span></a>';
		return result;
	}
}