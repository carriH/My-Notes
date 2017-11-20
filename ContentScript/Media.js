const MIN_AUDIO_WIDTH = 250;
const MIN_AUDIO_HEIGHT = 50;

const MIN_VIDEO_WIDTH = 350;
const MIN_VIDEO_HEIGHT = 200;
var styleSheet

function Media(json) {
    addCSSRule = function(selector, rules, index) {
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(styleSheet);
            styleSheet = document.styleSheets[document.styleSheets.length - 1];
        }

        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == selector) {
                styleSheet.cssRules[i].style = rules;
                return;
            }
        }

        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(selector + "{" + rules + "}", index);
        } else if ("addRule" in styleSheet) {
            styleSheet.addRule(selector, rules, index);
        }
    }

    this.menuPosX = 0;
    this.menuPosY = 0;

    var chuncks = [];

    if (!json) {
        json = {};
    }
    this.audio = JSON.parse(json.audio || false);
    this.video = JSON.parse(json.video || false);
    this.top = parseFloat(json.top || mouseCoord.y);
    this.left = parseFloat(json.left || mouseCoord.x);
    this.width = parseFloat(json.width || (this.video ? MIN_VIDEO_WIDTH : MIN_AUDIO_WIDTH));
    this.height = parseFloat(json.height || (this.video ? MIN_VIDEO_HEIGHT : MIN_AUDIO_HEIGHT));
    this.menuPosX = this.left - 20;
    this.menuPosY = this.top + 15;

    if (json.mediaFile)
        this.mediaFile = JSON.parse(json.mediaFile);

    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    if (!navigator.getUserMedia) {
        throw "Navegador incompatible.";
    }

}

Media.prototype.update = function(props) {

    this.left = parseFloat(props.left || this.left);
    this.top = parseFloat(props.top || this.top);
    this.width = parseFloat(props.width || this.width);
    this.height = parseFloat(props.height || this.height);
    this.menuPosX = this.left - 20;
    this.menuPosY = this.top + 15;

    this.player.style.top = this.top + "px";
    this.player.style.left = this.left + "px";
    this.player.style.width = this.width + "px";
    this.player.style.height = this.height + "px";

    if (props.backgroundColor) {
        this.player.style.backgroundColor = props.backgroundColor;
        this.hide.style.backgroundColor = props.backgroundColor;
        this.rec.style.backgroundColor = props.backgroundColor;
    }
    if (props.color) {
        this.player.style.color = props.color;
        this.controlBar.style.color = props.color;
        this.hide.style.color = props.color;
        this.rec.style.color = props.color;
        this.progressBar.color = props.color;
        addCSSRule('#' + this.progressBar.id + '::-moz-progress-bar', 'background-color: ' + props.color);
        addCSSRule('#' + this.volume.id + '::-moz-range-thumb', 'background-color: ' + props.color);
        addCSSRule('#' + this.volume.id + '::-moz-range-track', 'background-color: ' + props.color);
    }
}

Media.prototype.applyBackgroundOpacity = function(level) {
    var color = window.getComputedStyle(this.player, null).getPropertyValue('background-color').match(/\d+(.\d+)?/g);
    var newColor = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + level + ")";
    this.player.style.backgroundColor = newColor;
    this.hide.style.backgroundColor = newColor;
    this.rec.style.backgroundColor = newColor;
}

Media.prototype.draw = function(id, className, backgroundColor, color, opacity, hoverOpacity, mediaUpdatedNotification) {

    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        var ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], { type: mimeString });
        return blob;

    }

    var rgbColor = hexToRgb(backgroundColor);
    var rgbaBackgroundColor = "rgba(" + rgbColor.r + ", " + rgbColor.g + ", " + rgbColor.b + ", " + opacity + ")";

    this.media = document.createElement('div');
    this.media.id = 'media_' + id
    this.media.className = 'mediaPlayer';
    this.media.style.top = this.top + 'px';
    this.media.style.left = this.left + 'px';
    this.media.addEventListener("mouseover", function() { this.applyBackgroundOpacity(hoverOpacity); }.bind(this), true);
    this.media.addEventListener("mouseout", function() { this.applyBackgroundOpacity(opacity); }.bind(this), true);

    this.rec = document.createElement('i');
    this.rec.id = 'btnRec_' + id;
    this.rec.className = 'mediaButton material-icons';
    this.rec.textContent = (this.video ? 'videocam' : 'mic')
    this.rec.title = browser.i18n.getMessage("mediaRecBtnTitle");
    this.rec.style.backgroundColor = rgbaBackgroundColor;
    this.rec.style.color = color;
    this.media.appendChild(this.rec);

    this.player = document.createElement('div');
    this.player.id = 'player_' + id;
    this.player.className = 'player';
    this.player.style.width = this.width + 'px';
    this.player.style.height = this.height + 'px';
    this.player.style.backgroundColor = rgbaBackgroundColor;
    this.player.style.color = color;
    this.player.style.display = 'none';
    this.media.appendChild(this.player);


    this.hide = document.createElement('i');
    this.hide.id = 'hideBtn_' + id
    this.hide.style.backgroundColor = rgbaBackgroundColor;
    this.hide.style.color = color;
    this.hide.title = browser.i18n.getMessage("mediaHideBtnTitle");
    this.hide.className = 'mediaButton hideBtn material-icons'
    this.hide.textContent = 'keyboard_arrow_up';
    this.player.appendChild(this.hide);



    this.mediaContent = document.createElement(this.video ? 'video' : 'audio');
    this.mediaContent.style.width = this.width + 'px';
    this.mediaContent.style.height = (this.height - 60) + 'px'
    if (this.video) {
        this.mediaContent.className = 'videoAnotation';
    }
    this.player.appendChild(this.mediaContent);

    this.progressBar = document.createElement('progress');
    this.progressBar.id = 'progressBar_' + id;
    this.progressBar.className = 'progressBar';
    this.progressBar.min = 0;
    this.progressBar.max = 100;
    this.progressBar.value = 0;
    addCSSRule('#' + this.progressBar.id + '::-moz-progress-bar', 'background-color: ' + color);
    //this.progressBar.style.backgroundColor = this.backgroundColor;
    //this.progressBar.style.color = this.color;
    this.player.appendChild(this.progressBar);

    this.controlBar = document.createElement('div');
    this.controlBar.id = 'controls_' + id;
    this.controlBar.className = 'controlBar';
    this.player.appendChild(this.controlBar);

    this.playPause = document.createElement('i');
    this.playPause.id = 'btnPlay_' + id;
    this.playPause.className = 'mediaButton material-icons';
    this.playPause.textContent = 'play_arrow';
    this.playPause.title = browser.i18n.getMessage("mediaPlayBtnTitle");
    this.controlBar.appendChild(this.playPause);

    this.stop = document.createElement('i');
    this.stop.id = 'btnStop_' + id;
    this.stop.className = 'mediaButton material-icons';
    //this.stop.className = 'mediaButton fa fa-stop-circle';
    this.stop.textContent = 'stop';
    this.stop.title = browser.i18n.getMessage("mediaStopBtnTitle");
    this.controlBar.appendChild(this.stop);

    if (this.video) {
        this.fullScreen = document.createElement('i');
        this.fullScreen.id = 'fullScreenBtn_' + id;
        this.fullScreen.title = browser.i18n.getMessage("mediaFullScreenBtnTitle");
        this.fullScreen.className = 'mediaButton leftMediaButton material-icons'
        this.fullScreen.textContent = 'fullscreen';
        this.controlBar.appendChild(this.fullScreen);
    }

    this.volume = document.createElement('input');
    this.volume.type = 'range';
    this.volume.id = 'volumen_' + id;
    this.volume.className = 'volume';
    this.volume.title = browser.i18n.getMessage("mediaVolumeBtnTitle");
    this.volume.style.color = color;
    this.controlBar.appendChild(this.volume);
    addCSSRule('#' + this.volume.id + '::-moz-range-thumb', 'background-color: ' + color);
    addCSSRule('#' + this.volume.id + '::-moz-range-track', 'background-color: ' + color);

    this.mute = document.createElement('i');
    this.mute.id = 'btnMute_' + id;
    this.mute.className = 'mediaButton material-icons leftMediaButton';
    this.mute.textContent = 'volume_up'
    this.mute.title = browser.i18n.getMessage("mediaMuteModeOnTitle");
    this.controlBar.appendChild(this.mute);

    if (this.mediaFile) {
        this.mediaBlob = dataURItoBlob(this.mediaFile)
        this.loadPlayer(backgroundColor, color, opacity, hoverOpacity);
    } else {
        this.createMedia(mediaUpdatedNotification, backgroundColor, color, opacity, hoverOpacity);
    }

}

Media.prototype.getMenuPos = function() {
    return {
        x: this.menuPosX,
        y: this.menuPosY
    }
}

Media.prototype.getNodeReference = function() {
    return this.media;
}

Media.prototype.toJSon = function() {
    return {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
        audio: this.audio,
        video: this.video,
        mediaFile: JSON.stringify(this.mediaFile)
    };
}

Media.prototype.highlightItem = function(state) {
    if (state == 'hover') {
        this.media.classList.add('highlightElem');
        var nodeTop = this.media.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo(0, nodeTop - (window.innerHeight / 2));
    } else {
        this.media.classList.remove('highlightElem');
    }
}

Media.prototype.createMedia = function(mediaUpdatedNotification, backgroundColor, color, opacity, hoverOpacity) {

    var that = this;

    function onMediaRecorderError(err) {
        console.log('The following gUM error occured: ' + err);
    }

    function startRecording(e) {
        if (e)
            e.preventDefault();

        that.rec.style.color = 'red';
        that.mediaRecorder.start();
        console.log(that.mediaRecorder.state);
        console.log("recorder started");
        that.rec.removeEventListener("mouseup", startRecording, false);
        that.rec.addEventListener("mouseup", stopRecording, false);
    }

    function stopRecording(e) {
        e.preventDefault();

        that.mediaRecorder.stop();
        console.log(that.mediaRecorder.state);
        console.log("recorder stopped");
        that.rec.removeEventListener("mouseup", stopRecording, false);
    }


    function onMediaRecorderStop() {

        if (!this.video) {
            stream = document.createElement('audio');
            this.mediaBlob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
        } else {
            stream = document.createElement('video');
            this.mediaBlob = new Blob(this.chunks, { 'type': 'video/mp4' });
        }

        this.chunks = [];

        var fileReader = new FileReader();
        var that = this;

        fileReader.onload = function() {
            that.mediaFile = this.result;
            mediaUpdatedNotification();
        }
        fileReader.readAsDataURL(this.mediaBlob);

        this.loadPlayer(backgroundColor, color, opacity, hoverOpacity);
    }

    function callback(stream) {
        this.mediaRecorder = new MediaRecorder(stream);

        this.chunks = [];

        this.mediaRecorder.addEventListener("dataavailable", function(e) {
            this.chunks.push(e.data);
        }.bind(this), true);

        this.mediaRecorder.addEventListener("stop", onMediaRecorderStop.bind(this), true);
        this.rec.addEventListener("mouseup", startRecording, false);
    }

    if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({
            audio: this.audio,
            video: this.video
        }).then(callback.bind(this)).catch(onMediaRecorderError.bind(this));
    } else {
        navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        if (navigator.getUserMedia) {
            var control
            navigator.getUserMedia(
                // constraints - only audio needed for this app
                {
                    audio: this.audio,
                    video: this.video
                },
                callback.bind(this),
                onMediaRecorderError.bind(this)
            );
        } else {
            trhow('Option not supported on your browser!');
        }
    }



}

Media.prototype.loadPlayer = function(backgroundColor, color, opacity, hoverOpacity) {
    var that = this;

    function showPlayer() {
        that.rec.style.display = 'none';
        that.player.style.display = 'block';
    }

    function hidePlayer() {
        that.rec.style.display = 'block';
        that.player.style.display = 'none';

    }

    function playPauseVideo() {
        if (that.mediaContent.paused || that.mediaContent.ended) {
            // Change the button to a pause button
            changeButtonType(that.playPause, browser.i18n.getMessage("mediaPauseBtnTitle"), 'pause');
            that.mediaContent.play();
            if (that.mediaContent.ended)
                that.progressBar.value = 100;
        } else {
            // Change the button to a play button
            changeButtonType(that.playPause, browser.i18n.getMessage("mediaPlayBtnTitle"), 'play_arrow');
            that.mediaContent.pause();
        }
    }

    function seek(e) {
        e.stopPropagation();
        var percent = e.offsetX / this.offsetWidth;
        that.mediaContent.currentTime = percent * that.mediaContent.duration;
        e.target.value = Math.floor(percent / 100);
        e.target.textContent = that.progressBar.value + '% played';
    }

    function stopVideo() {
        that.mediaContent.pause();
        if (that.mediaContent.currentTime) that.mediaContent.currentTime = 0;
    }

    function muteVolume() {
        if (that.mediaContent.muted) {
            // Change the button to a mute button
            changeButtonType(that.mute, browser.i18n.getMessage("mediaMuteModeOnTitle"), 'volume_up');
            that.volume.disabled = false;
            that.mediaContent.muted = false;
        } else {
            // Change the button to an unmute button
            changeButtonType(that.mute, browser.i18n.getMessage("mediaMuteModeOffTitle"), 'volume_off');
            that.mediaContent.muted = true;
            that.volume.disabled = true;
        }
    }

    // Update the progress bar
    function updateProgressBar() {
        // Work out how much of the media has played via the duration and currentTime parameters
        var percentage = Math.floor((100 / that.mediaContent.duration) * that.mediaContent.currentTime);
        // Update the progress bar's value
        that.progressBar.value = percentage;
        // Update the progress bar's text (for browsers that don't support the progress element)
        that.progressBar.textContent = percentage + '% played';
    }

    // Updates a button's title, textContent and CSS class
    function changeButtonType(btn, value, icon) {
        btn.title = value;
        if (icon)
            btn.textContent = icon;
        else
            btn.textContent = icon;
    }

    function exitFullScreen() {
        that.mediaContent.removeAttribute('controls');
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    function toggleFullScreen() {
        //var player = document.getElementById("player");

        if (that.mediaContent.requestFullscreen)
            if (document.fullScreenElement) {
                document.cancelFullScreen();
            } else {
                that.mediaContent.requestFullscreen();
            }
        else if (that.mediaContent.msRequestFullscreen)
            if (document.msFullscreenElement) {
                document.msExitFullscreen();
            } else {
                that.mediaContent.msRequestFullscreen();
            }
        else if (that.mediaContent.mozRequestFullScreen)
            if (document.mozFullScreenElement) {
                document.mozCancelFullScreen();
            } else {
                that.mediaContent.mozRequestFullScreen();
            }
        else if (that.mediaContent.webkitRequestFullscreen)
            if (document.webkitFullscreenElement) {
                document.webkitCancelFullScreen();
            } else {
                that.mediaContent.webkitRequestFullscreen();
            }
        else {
            alert("Fullscreen API is not supported");

        }
    }



    this.mediaContent.src = window.URL.createObjectURL(this.mediaBlob);

    this.rec.style.color = color;
    this.rec.className = 'mediaButton mediaIcon material-icons';
    this.rec.textContent = (this.video ? 'local_movies' : 'music_note');
    this.rec.title = browser.i18n.getMessage("mediaShowControlBtnTitle");
    this.rec.addEventListener('mouseup', showPlayer, false);
    this.hide.addEventListener('mouseup', hidePlayer, false);

    //JS to control media

    this.playPause.addEventListener('mouseup', playPauseVideo, false);
    this.stop.addEventListener("mouseup", stopVideo, false);

    this.volume.value = this.mediaContent.volume * 100;
    this.volume.addEventListener("change", function(evt) {
        that.mediaContent.volume = evt.target.value / 100;
    });
    this.volume.addEventListener("mousedown", function(e) {
        e.stopPropagation();
    }, true);
    this.mute.addEventListener("mouseup", muteVolume, false);

    if (this.fullScreen)
        this.fullScreen.addEventListener("mouseup", toggleFullScreen, false);

    this.mediaContent.addEventListener('ended', function() {
        this.pause();
        that.progressBar.value = 100;
    }, false);

    this.mediaContent.addEventListener('timeupdate', updateProgressBar, false);

    this.progressBar.addEventListener("mousedown", seek, true);


    this.mediaContent.addEventListener('pause', function() {
        // Change the button to be a play button
        changeButtonType(that.playPause, browser.i18n.getMessage("mediaPlayBtnTitle"), 'play_arrow');
    }, false);

    var elemInFullScreen;

}

Media.prototype.delete = function() {
    this.media.parentNode.removeChild(this.media);
}

Media.prototype.activateMovingResizing = function(action) {
    var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

    var onMouseMove = function(event) {
        posX = event.clientX + window.pageXOffset - that.left;
        posY = event.clientY + window.pageYOffset - that.top;

        if (that.player.style.display != 'none') {
            onLeftEdge = posX < MARGIN;
            onRightEdge = posX > that.width - MARGIN;
            onTopEdge = (posY - 25 < MARGIN && that.video);
            onBottomEdge = (posY - 25 > that.height - MARGIN && that.video);


            if ((onLeftEdge && onTopEdge) || (onRightEdge && onBottomEdge))
                that.media.style.cursor = "nw-resize";
            else if ((onLeftEdge && onBottomEdge) || (onRightEdge && onTopEdge))
                that.media.style.cursor = "ne-resize";
            else if (onTopEdge || onBottomEdge)
                that.media.style.cursor = "n-resize";
            else if (onLeftEdge || onRightEdge)
                that.media.style.cursor = "e-resize";
            else
                that.media.style.cursor = "";
        }

    }

    var onMouseDown = function(event) {

        var onResize = function(event) {
            var currMouse = {
                x: event.clientX + window.pageXOffset,
                y: event.clientY + window.pageYOffset
            }

            if (onRightEdge) {
                var currentWidth = currMouse.x - prevMouse.x + that.player.offsetWidth;
                if (currentWidth >= (that.video ? MIN_VIDEO_WIDTH : MIN_AUDIO_WIDTH)) {
                    that.player.style.width = currentWidth + 'px';
                    if (that.video) {
                        that.mediaContent.style.width = currentWidth + 'px';
                    }
                }
            }
            if (onBottomEdge) {
                var currentHeight = currMouse.y - prevMouse.y + that.player.offsetHeight;
                if (currentHeight > (that.video ? MIN_VIDEO_HEIGHT : MIN_AUDIO_HEIGHT)) {
                    that.player.style.height = currentHeight + 'px';
                    if (that.video) {
                        that.mediaContent.style.height = (currentHeight - 60) + 'px';
                    }
                }
            }
            if (onLeftEdge) {
                var currentWidth = prevMouse.x - currMouse.x + that.player.offsetWidth;
                if (currentWidth >= (that.video ? MIN_VIDEO_HEIGHT : MIN_AUDIO_HEIGHT)) {
                    that.player.style.width = currentWidth + 'px';
                    that.media.style.left = currMouse.x + 'px';
                    if (that.video) {
                        that.mediaContent.style.width = currentWidth + 'px';
                    }
                }
            }

            if (onTopEdge) {
                var currentHeight = prevMouse.y - currMouse.y + that.player.offsetHeight;
                if (currentHeight > (that.video ? MIN_VIDEO_HEIGHT : MIN_AUDIO_HEIGHT)) {
                    that.player.style.height = currentHeight + 'px';
                    that.media.style.top = currMouse.y + 'px';
                    if (that.video) {
                        that.mediaContent.style.height = (currentHeight - 60) + 'px';
                    }
                }
            }

            prevMouse.x = currMouse.x;
            prevMouse.y = currMouse.y;
            event.stopPropagation();
            event.preventDefault();
        };
        var onMove = function(event) {
            that.media.style.left = event.clientX + window.pageXOffset - posX + "px";
            that.media.style.top = event.clientY + window.pageYOffset - posY + "px";
            event.stopPropagation();
            event.preventDefault();
        };

        var onMouseUp = function(event) {
            var playerValues = that.player.getBoundingClientRect();
            var mediaValues = that.media.getBoundingClientRect();
            var newValues = {
                top: mediaValues.top,
                left: mediaValues.left,
                height: that.player.style.display != 'none' ? playerValues.height : that.height,
                width: that.player.style.display != 'none' ? playerValues.width : that.width
            }
            if (
                (that.top != newValues.top + window.pageYOffset) ||
                (that.left != newValues.left + window.pageXOffset) ||
                (that.height != newValues.height) ||
                (that.width != newValues.width)
            ) {
                that.top = newValues.top + window.pageYOffset;
                that.left = newValues.left + window.pageXOffset;
                that.height = newValues.height;
                that.width = newValues.width;

                that.menuPosX = that.left - 20;
                that.menuPosY = that.top + 15;
                action();
                event.stopPropagation();
                event.preventDefault();
            }
            document.removeEventListener('mousemove', onResize, true);
            document.removeEventListener('mousemove', onMove, true);
            document.removeEventListener('mouseup', onMouseUp, true);
            that.media.style.cursor = "";

        }

        //calculate the position of the mouse inside the note
        var prevMouse = mouseCoord;
        if (that.player.style.display != 'none' &&
            (onLeftEdge || onRightEdge || onTopEdge || onBottomEdge))
            document.addEventListener('mousemove', onResize, true);
        else
            document.addEventListener('mousemove', onMove, true);
        document.addEventListener('mouseup', onMouseUp, true);
    };

    var that = this;
    this.media.addEventListener("mousemove", onMouseMove, true);
    this.media.addEventListener("mousedown", onMouseDown, false);
}



function changeControlsInFullScreen() {
    if (document.fullscreenElement || document.mozFullScreenElement) {
        elemInFullScreen = document.fullscreenElement || document.mozFullScreenElement;
        if (elemInFullScreen.className == 'videoAnotation') {
            elemInFullScreen.controls = "true";
        } else {
            elemInFullScreen = null;
        }
    } else if (elemInFullScreen) {
        elemInFullScreen.controls = "";

    }
}
document.removeEventListener("mozfullscreenchange", changeControlsInFullScreen, true);
document.addEventListener("mozfullscreenchange", changeControlsInFullScreen, true);