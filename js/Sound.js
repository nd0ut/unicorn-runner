export class Sound {
           constructor(name, buf, createSource) {
               this.name = name;
               this.buffer = buf;
               this.createSource = createSource;

               this.isPlaying = false;
               this.timeoutId = undefined;
               this.source = undefined;
               this.gainNode = undefined;
           }

           playOnce({ rate = 1, volume = 0.3 } = {}) {
               const { gainNode, source } = this.createSource(this.buffer);
               this.gainNode = gainNode;
               this.source = source;

               this.source.playbackRate.value = rate;
               this.gainNode.gain.value = volume;            

               this.source.start(0);
               this.isPlaying = true;
           }

           playLoop({ rate = 1, volume = 0.3 } = {}) {
               const { gainNode, source } = this.createSource(this.buffer, {
                   loop: true
               });
               this.gainNode = gainNode;
               this.source = source;

               this.source.playbackRate.value = rate;
               this.gainNode.gain.value = volume;

               this.source.start(0);
               this.isPlaying = true;
           }

           startPlaying(options) {
               const { gainNode, source } = this.createSource(this.buffer, options);
               this.gainNode = gainNode;
               this.source = source;

               this.source.start(0);
               this.isPlaying = true;
           }

           stop() {
               if (this.source) {
                   this.source.stop();
               }

               this.isPlaying = false;
           }

           playing({ rate = 1, volume = 0.3 } = {}) {
               if (!this.isPlaying) {
                   this.startPlaying({ loop: true, rate, volume });
               }

               this.source.playbackRate.value = rate;
               this.gainNode.gain.value = volume;

               if (this.timeoutId) {
                   clearTimeout(this.timeoutId);
               }

               this.timeoutId = setTimeout(this.stop.bind(this), 100);
           }
       }
