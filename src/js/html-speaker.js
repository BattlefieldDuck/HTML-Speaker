window.speechSynthesis.cancel();

//Store current speaker ID
var speakerId = null;

//Find all speakers
var speakers = document.getElementsByTagName("html-speaker");
[...speakers].forEach(function(speaker) {
	var iconStart = speaker.hasAttribute('data-start') ? speaker.getAttribute('data-start') : "\u25B6";
	var iconPause = speaker.hasAttribute('data-pause') ? speaker.getAttribute('data-pause') : "\u25cf";
	speaker.innerHTML = iconStart + speaker.innerHTML;
	
	speaker.addEventListener('click', e => {
		//Find this speaker ID
		var thisSpeakerId;
		for (var i = 0; i < speakers.length; i++) {
			if (speaker === speakers[i]) {
				thisSpeakerId = i;
			}
		}
		
		var synth = window.speechSynthesis;
		//If this speaker ID != current speaker ID
		if (thisSpeakerId !== speakerId) {
			//Cancel the speech
			synth.cancel();
			
			var content = document.getElementById(speaker.getAttribute('for'));
			var contentText = content.textContent.trim();
			
			//Create SpeechSynthesisUtterance
			var utt = new SpeechSynthesisUtterance();
			utt.text = contentText;
			if (speaker.hasAttribute('data-pitch')) {
				utt.pitch = speaker.getAttribute('data-pitch');
			}
			if (speaker.hasAttribute('data-rate')) {
				utt.rate = speaker.getAttribute('data-rate');
			}
			if (speaker.hasAttribute('data-volume')) {
				utt.volume = speaker.getAttribute('data-volume');
			}
			if (speaker.hasAttribute('data-lang')) {
				utt.lang = speaker.getAttribute('data-lang');
			}
			if (speaker.hasAttribute('data-voice')) {
				var voices = synth.getVoices();
				var selectedVoice = speaker.getAttribute('data-voice');
				for (var i = 0; i < voices.length; i++) {
					if (voices[i].name === selectedVoice) {
						utt.voice = voices[i];
						utt.lang = null;
						break;
					}
				}
			}
			
			//TODO: Highlight is currently spoken word!
			/*
			utt.onboundary = function(event) {		
				if (event.name === "word") {
					var nextWord = "";
					const regex = new XRegExp('\\p{P}');
					var count = event.charIndex;
					while (count < contentText.length) {
						var currentChar = contentText.charAt(count++);
						if (regex.test(currentChar)) {
							break;
						} else {
							nextWord += currentChar.trim();
						}
					}
					
					$('.bg-success').contents().unwrap();
					var rgxp = new RegExp(nextWord, 'gm');
					var repl = '<span class="bg-success">' + nextWord + '</span>';
					content.innerHTML = content.innerHTML.replace(rgxp, repl);
					
					console.log(nextWord);
				}
			}
			*/
			
			//If end, set current speaker ID to null because the speech was end
			utt.onend = function() {
				if (thisSpeakerId === speakerId) {
					speakerId = null;
				} 
				speaker.innerHTML = speaker.innerHTML.replace(speaker.hasAttribute('data-pause') ? speaker.getAttribute('data-pause') : "\u25cf", speaker.hasAttribute('data-start') ? speaker.getAttribute('data-start') : "\u25B6");	
			}
			
			synth.speak(utt);
			
			//UI: Set thisSpeaker to pause button, oldSpeaker to play button
			speaker.innerHTML = speaker.innerHTML.replace(iconStart, iconPause);
			if (speakerId !== null) {
				speakers[speakerId].innerHTML = speakers[speakerId].innerHTML.replace(speakers[speakerId].hasAttribute('data-pause') ? speakers[speakerId].getAttribute('data-pause') : "\u25cf", speakers[speakerId].hasAttribute('data-start') ? speakers[speakerId].getAttribute('data-start') : "\u25B6");
			}
			
			//Store this speaker ID to current one
			speakerId = thisSpeakerId;
		}
		//If this speaker ID == current speaker ID, pause or resume
		else if (synth.paused) {
			synth.resume();
			speaker.innerHTML = speaker.innerHTML.replace(iconStart, iconPause);
		} else if (synth.speaking) {
			synth.pause();
			speaker.innerHTML = speaker.innerHTML.replace(iconPause, iconStart);
		}
	});
});
