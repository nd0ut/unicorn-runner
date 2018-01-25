class SingleSoundManager {
    constructor() {
        this.context = new AudioContext();
        this.sources = new WeakMap();
    }

    loadSamples(urls) {
        return new Promise(resolve => {
            const bufferLoader = new BufferLoader(
                this.context,
                urls,
                bufferList => resolve(bufferList)
            );
            bufferLoader.load();
        })
    }

    play(buffer, {time, loop, rate, forceStop} = {time: 0, loop: false, rate: 1, forceStop: false}) {
        if(this.sources.has(buffer)) {
            const source = this.sources.get(buffer);
            source.playbackRate.value = rate;
            return;
        }

        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.context.destination);
        source.loop = loop;
        source.playbackRate.value = rate;

        if(!forceStop) {
            source.addEventListener('ended', () => this.stop(buffer));
        }

        source.start(time);    
        
        this.sources.set(buffer, source);
    }

    stop(buffer) {
        if(!this.sources.has(buffer)) {
            return;
        }

        const source = this.sources.get(buffer);
        source.stop();
        this.sources.delete(buffer);
    }
}

export const SoundManager = new SingleSoundManager();

class BufferLoader {
    constructor(context, urlList, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = new Array();
        this.loadCount = 0;
    }

    loadBuffer(url, index) {
        // Load buffer asynchronously
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        const loader = this;

        request.onload = function() {
            // Asynchronously decode the audio file data in request.response
            loader.context.decodeAudioData(
                request.response,
                function(buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    loader.bufferList[index] = buffer;
                    if (++loader.loadCount == loader.urlList.length)
                        loader.onload(loader.bufferList);
                },
                function(error) {
                    console.error('decodeAudioData error', error);
                }
            );
        };

        request.onerror = function() {
            alert('BufferLoader: XHR error');
        };

        request.send();
    }

    load() {
        for (var i = 0; i < this.urlList.length; ++i) {
            this.loadBuffer(this.urlList[i], i);
        }
    }
}
