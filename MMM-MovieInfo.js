/* Magic Mirror
 * Module: MMM-MovieInfo
 *
 * By fewieden https://github.com/fewieden/MovieInfo
 *
 * MIT Licensed.
 */

Module.register("MMM-MovieInfo",{

	index: 0,

	defaults: {
		api_key: false,
		updateInterval: 180 * 60 * 1000,
		rotateInterval: 3 * 60 * 1000,
		genre: true,
		rating: true,
		plot: true,
		useLanguage: false
	},

	start: function() {
		Log.info("Starting module: " + this.name);
		this.genres = {
            28: this.translate("ACTION"),
            12: this.translate("ADVENTURE"),
            16: this.translate("ANIMATION"),
            35: this.translate("COMEDY"),
            80: this.translate("CRIME"),
            99: this.translate("DOCUMENTARY"),
            18: this.translate("DRAMA"),
            10751: this.translate("FAMILY"),
            14: this.translate("FANTASY"),
            10769: this.translate("FOREIGN"),
            36: this.translate("HISTORY"),
            27: this.translate("HORROR"),
            10402: this.translate("MUSIC"),
            9648: this.translate("MYSTERY"),
            10749: this.translate("ROMANCE"),
            878: this.translate("SCIENCE_FICTION"),
            10770: this.translate("TV_MOVIE"),
            53: this.translate("THRILLER"),
            10752: this.translate("WAR"),
            37: this.translate("WESTERN")
	    };
        if(this.config.useLanguage){
            this.config.language = config.language;
        }
		this.sendSocketNotification('CONFIG', this.config);
		setInterval(() => {
			this.index++;
			this.updateDom(1000);
		}, this.config.rotateInterval);
	},

    getStyles: function() {
        return ['font-awesome.css', 'MMM-MovieInfo.css'];
    },

    getTranslations: function() {
        return {
            en: "translations/en.json",
            de: "translations/de.json"
        };
    },

	socketNotificationReceived: function(notification, payload){
		if(notification === 'DATA'){
			this.upcoming = payload;
			this.updateDom(1000);
		}
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		if(this.upcoming) {
			if (this.index >= this.upcoming.results.length) {
				this.index = 0;
			}

			wrapper.classList.add("wrapper", "align-left");
			
			var header = document.createElement("header");
			header.classList.add("module-header");
			header.innerHTML = "Upcoming movie: " + this.upcoming.results[this.index].title;
			wrapper.appendChild(header);
			
			var metadata = document.createElement("div");

			var movieimage = document.createElement("div");
			movieimage.classList.add("float-left","movieimage");
			
			var movieimageholder = document.createElement("div");
			movieimageholder.classList.add("movieimageholder");

			var poster = document.createElement("img");
			poster.classList.add("poster");
			poster.src = "https://image.tmdb.org/t/p/w185_and_h278_bestv2" + this.upcoming.results[this.index].poster_path;
			movieimageholder.appendChild(poster);

			movieimage.appendChild(movieimageholder);				

			metadata.appendChild(movieimage);			


			var details = document.createElement("div");
			details.classList.add("float-left","moviedetails");

			
			if(this.config.plot) {
				var plot = document.createElement("div");
				plot.classList.add("xsmall", "plot");
				plot.innerHTML = this.upcoming.results[this.index].overview.length > 250 ? this.upcoming.results[this.index].overview.substring(0, 248) + '...' : this.upcoming.results[this.index].overview;
				details.appendChild(plot);
			}

			
			if(this.config.genre){
				var genres = document.createElement("div");
				genres.classList.add("xsmall");
				var genrespan = document.createElement("span");
				genrespan.classList.add("xsmall", "float-left");
				genrespan.innerHTML = this.translate("GENRES") + ": ";
				genres.appendChild(genrespan);
				var max = Math.min(3, this.upcoming.results[this.index].genre_ids.length);
				for (var i = 0; i < max; i++) {
					if (this.genres.hasOwnProperty(this.upcoming.results[this.index].genre_ids[i])) {
						var genre = document.createElement("span");
						genre.classList.add("xsmall", "thin", "badge", "float-left");
						genre.innerHTML = this.genres[this.upcoming.results[this.index].genre_ids[i]];
						genres.appendChild(genre);
					}
				}
				details.appendChild(genres);
			}
			
			if(this.config.rating) {
				var stars = document.createElement("div");
				stars.classList.add("xsmall");
				var star = document.createElement("i");
				star.classList.add("fa", "fa-star-o");
				stars.appendChild(star);
				var starspan = document.createElement("span");
				starspan.innerHTML = " " + this.upcoming.results[this.index].vote_average;
				stars.appendChild(starspan);
				details.appendChild(stars);
			}

			metadata.appendChild(details);
			wrapper.appendChild(metadata);
		}
                
		return wrapper;
	}
});