import vw_template from '../../templates/vw_template.html'
import youtube_template from '../../templates/youtube.html'
import Ractive from 'ractive'
import YouTubePlayer from 'youtube-player';
import share from '../modules/share'
Ractive.DEBUG = false;

export class videowall {

	constructor(googledoc) {

		var self = this

		this.interactive = googledoc.interactive

		this.videos = googledoc.videos

		this.videos.sort(function(a, b) {

		    return a.order - b.order;

		});

		this.videos.forEach(function(item) {

		    item.live = (item.type==='placeholder') ? false : true ;

		});

		this.articles = googledoc.articles

		this.articles.sort(function(a, b) {

		    return a.order - b.order;

		});

		this.data = { 
			title: self.interactive[0].title,
			intro: self.interactive[0].intro,
			social: self.interactive[0].social,
			hashtags: self.interactive[0].hashtags,
			fbimg: self.interactive[0].fbimg,
			contributors: self.interactive[0].contributors,
			hub_name: self.interactive[0].hub_name,
			hub_url: self.interactive[0].hub_url,
			supporter_intro: self.interactive[0].supporter_intro,
			supporter_img: self.interactive[0].supporter_img,
			supporter_abouturl: self.interactive[0].supporter_abouturl,
			copyright: self.interactive[0].copyright,
			readmoretitle: self.interactive[0].readmoretitle,
			articles: self.articles,
			videos: self.videos
		}

		this.ractivate()

	}

	ractivate() {

		var self = this

		this.render = function () {

		  var ractive = new Ractive({
		    target: "#app",
		    template: vw_template,
		  	data: self.data
		  });

		};

		self.render()

		self.activate()

	}  

	activate() {

		var self = this

        var flicks = document.getElementsByClassName("vw-video-trigger");

        var control = function() {

            let index = +this.getAttribute('data-vw-video-index');

            self.currentVideo = index

            self.youtube()

        };

        for (var i = 0; i < flicks.length; i++) {

            flicks[i].addEventListener('click', control, false);

        }

        // Activate the main social media buttons on the page.

		let sharegeneral = share(self.data.social, self.getShareUrl(), self.data.fbimg, null, self.data.hashtags);

		let social = document.getElementsByClassName("social-general")

		for (let i = 0; i < social.length; i++) {

			let platform = social[i].getAttribute('data-social');

			social[i].addEventListener('click',() => sharegeneral(platform));

		}

	}

	youtube() {

		var self = this

		var index = self.currentVideo

		this.initialize = () => {

		  var ractive = new Ractive({
		    target: "#vw-video-modal",
		    template: youtube_template,
		  	data: self.videos[index]
		  });

		};

		self.initialize()

        self.player = new YouTubePlayer('vw-video-player', {
            height: "100%",
            width: "100%",
            videoId: self.videos[index].youtube,
            playerVars: { 'autoplay': 1, 'showinfo': 0, 'controls': 1, 'rel': 0 }
        });

		document.querySelector("#vw-modal-close").addEventListener('click',() => {

			self.player.pauseVideo();

			document.querySelector("#vw-video-modal").style.display = 'none'

		});

		document.querySelector("#vw-video-modal").style.display = 'block'

		let sharespecific = share(self.videos[index].social, self.getShareUrl(), self.videos[index].fbimg, null, self.data.hashtags);

		let social = document.getElementsByClassName("social-specific")

		for (let i = 0; i < social.length; i++) {

			console.log("Boom")

			let platform = social[i].getAttribute('data-social');

			social[i].addEventListener('click',() => sharespecific(platform));

		}


	}

	getShareUrl() { 

		var isInIframe = (parent !== window);

		var parentUrl = null;

		var shareUrl = (isInIframe) ? document.referrer : window.location.href;

		shareUrl = shareUrl.split('?')[0]

		return shareUrl;

	}

}