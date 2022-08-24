new Vue({
    el: "#app",
    data() {
      return {
        audio: null,
        circleLeft: null,
        barWidth: null,
        duration: null,
        currentTime: null,
        isTimerPlaying: false,
        tracks: [
          {
            name: "Mekanın Sahibi",
            artist: "Norm Ender",
            cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/1.jpg",
            source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/1.mp3",
            url: "https://www.youtube.com/watch?v=z3wAjJXbYzA",
            favorited: false
          },
          {
            name: "Everybody Knows",
            artist: "Leonard Cohen",
            cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/2.jpg",
            source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/2.mp3",
            url: "https://www.youtube.com/watch?v=Lin-a2lTelg",
            favorited: true
          },
          ,
          {
            name: "Excuses",
            artist: "ap-dhillon",
            cover: "https://github.com/mohammadomer691/song/raw/main/148549-excuses-ap-dhillon-mp3-song-300.jpg",
            source: "https://github.com/mohammadomer691/song/raw/main/Excuses.mp3",
            url: "https://www.youtube.com/watch?v=L3wKzyIN1yk",
            favorited: false
          },
          {
            name: "295",
            artist: "Sidhu Moosewala",
            cover: "https://raw.githubusercontent.com/mohammadomer691/song/main/295-1.jpg",
            source: "https://github.com/mohammadomer691/song/blob/main/295_1.mp3?raw=true",
            url: "https://www.youtube.com/watch?v=L3wKzyIN1yk",
            favorited: false
          }
          ,{
            name: "So High",
            artist: "Sidhu Moosewala",
            cover: "https://github.com/mohammadomer691/song/raw/main/so%20high%20png.jpg",
            source: "https://github.com/mohammadomer691/song/blob/main/So-High-Sidhu-Moose-Wala-190Kbps.mp3?raw=true",
            url: "https://www.youtube.com/watch?v=L3wKzyIN1yk",
            favorited: false
          }
        ],
        currentTrack: null,
        currentTrackIndex: 0,
        transitionName: null
      };
    },
    methods: {
      play() {
        if (this.audio.paused) {
          this.audio.play();
          this.isTimerPlaying = true;
        } else {
          this.audio.pause();
          this.isTimerPlaying = false;
        }
      },
      generateTime() {
        let width = (100 / this.audio.duration) * this.audio.currentTime;
        this.barWidth = width + "%";
        this.circleLeft = width + "%";
        let durmin = Math.floor(this.audio.duration / 60);
        let dursec = Math.floor(this.audio.duration - durmin * 60);
        let curmin = Math.floor(this.audio.currentTime / 60);
        let cursec = Math.floor(this.audio.currentTime - curmin * 60);
        if (durmin < 10) {
          durmin = "0" + durmin;
        }
        if (dursec < 10) {
          dursec = "0" + dursec;
        }
        if (curmin < 10) {
          curmin = "0" + curmin;
        }
        if (cursec < 10) {
          cursec = "0" + cursec;
        }
        this.duration = durmin + ":" + dursec;
        this.currentTime = curmin + ":" + cursec;
      },
      updateBar(x) {
        let progress = this.$refs.progress;
        let maxduration = this.audio.duration;
        let position = x - progress.offsetLeft;
        let percentage = (100 * position) / progress.offsetWidth;
        if (percentage > 100) {
          percentage = 100;
        }
        if (percentage < 0) {
          percentage = 0;
        }
        this.barWidth = percentage + "%";
        this.circleLeft = percentage + "%";
        this.audio.currentTime = (maxduration * percentage) / 100;
        this.audio.play();
      },
      clickProgress(e) {
        this.isTimerPlaying = true;
        this.audio.pause();
        this.updateBar(e.pageX);
      },
      prevTrack() {
        this.transitionName = "scale-in";
        this.isShowCover = false;
        if (this.currentTrackIndex > 0) {
          this.currentTrackIndex--;
        } else {
          this.currentTrackIndex = this.tracks.length - 1;
        }
        this.currentTrack = this.tracks[this.currentTrackIndex];
        this.resetPlayer();
      },
      nextTrack() {
        this.transitionName = "scale-out";
        this.isShowCover = false;
        if (this.currentTrackIndex < this.tracks.length - 1) {
          this.currentTrackIndex++;
        } else {
          this.currentTrackIndex = 0;
        }
        this.currentTrack = this.tracks[this.currentTrackIndex];
        this.resetPlayer();
      },
      resetPlayer() {
        this.barWidth = 0;
        this.circleLeft = 0;
        this.audio.currentTime = 0;
        this.audio.src = this.currentTrack.source;
        setTimeout(() => {
          if(this.isTimerPlaying) {
            this.audio.play();
          } else {
            this.audio.pause();
          }
        }, 300);
      },
      favorite() {
        this.tracks[this.currentTrackIndex].favorited = !this.tracks[
          this.currentTrackIndex
        ].favorited;
      }
    },
    created() {
      let vm = this;
      this.currentTrack = this.tracks[0];
      this.audio = new Audio();
      this.audio.src = this.currentTrack.source;
      this.audio.ontimeupdate = function() {
        vm.generateTime();
      };
      this.audio.onloadedmetadata = function() {
        vm.generateTime();
      };
      this.audio.onended = function() {
        vm.nextTrack();
        this.isTimerPlaying = true;
      };
  
      // this is optional (for preload covers)
      for (let index = 0; index < this.tracks.length; index++) {
        const element = this.tracks[index];
        let link = document.createElement('link');
        link.rel = "prefetch";
        link.href = element.cover;
        link.as = "image"
        document.head.appendChild(link)
      }
    }
  });