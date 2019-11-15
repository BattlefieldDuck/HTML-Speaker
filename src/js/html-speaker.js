var speakers = document.getElementsByTagName("html-speaker");

if (typeof speechSynthesis === "undefined") {
	[...speakers].forEach(function(speaker) {
		speaker.style.display = "none";
	});

	throw "HTML-Speaker: speechSynthesis is not supported in the browser.";
}

var synth = window.speechSynthesis;

//Cancel the speech on reload 
synth.cancel();

//Cancel the speech on page unload
window.onbeforeunload = function() {
	synth.cancel();
}

var activeSpeaker = null;
[...speakers].forEach(function(speaker) {
	var iconStart = speaker.hasAttribute("data-start") ? speaker.getAttribute("data-start") : "\u25B6";
	var iconPause = speaker.hasAttribute("data-pause") ? speaker.getAttribute("data-pause") : "\u25cf";
	speaker.textContent = iconStart + speaker.textContent;
	speaker.addEventListener("click", function() {
		if (speaker !== activeSpeaker) {
			speaker.textContent = speaker.textContent.replace(iconStart, iconPause);
			if (activeSpeaker !== null) {
				activeSpeaker.textContent = activeSpeaker.textContent.replace(activeSpeaker.hasAttribute("data-pause") ? activeSpeaker.getAttribute("data-pause") : "\u25cf", activeSpeaker.hasAttribute("data-start") ? activeSpeaker.getAttribute("data-start") : "\u25B6");
			}
		
			synth.cancel();
			
			var content = document.getElementById(speaker.getAttribute("for"));
			var contentText = content.textContent.trim();
			
			//Create SpeechSynthesisUtterance
			var utt = new SpeechSynthesisUtterance(contentText);
			if (speaker.hasAttribute("data-pitch")) {
				utt.pitch = speaker.getAttribute("data-pitch");
			}
			if (speaker.hasAttribute("data-rate")) {
				utt.rate = speaker.getAttribute("data-rate");
			}
			if (speaker.hasAttribute("data-volume")) {
				utt.volume = speaker.getAttribute("data-volume");
			}
			if (speaker.hasAttribute("data-lang")) {
				utt.lang = speaker.getAttribute("data-lang");
			}
			if (speaker.hasAttribute("data-voice")) {
				var voices = synth.getVoices();
				var selectedVoice = speaker.getAttribute("data-voice");
				
				if (voices !== null) {
					for (const voice of voices) {
						if (voice.name === selectedVoice) {
							utt.voice = voice;
							break;
						}
					}
				}
				
				if (utt.voice === null) {
					console.warn("HTML-Speaker: voice("+selectedVoice+") is not found in the browser. Default voice will be used.");
				}
			}
			
			//TODO: Highlight is currently spoken word!
			/*
			utt.onboundary = function(event) {		
				if (event.name === "word") {
					var nextWord = "";
					const regex = new XRegExp("\\p{P}");
					var count = event.charIndex;
					while (count < contentText.length) {
						var currentChar = contentText.charAt(count++);
						if (regex.test(currentChar)) {
							break;
						} else {
							nextWord += currentChar.trim();
						}
					}
					
					$(".bg-success").contents().unwrap();
					var rgxp = new RegExp(nextWord, "gm");
					var repl = "<span class="bg-success">" + nextWord + "</span>";
					content.textContent = content.textContent.replace(rgxp, repl);
					
					console.log(nextWord);
				}
			}
			*/
			
			utt.onend = function() {
				speaker.textContent = speaker.textContent.replace(speaker.hasAttribute("data-pause") ? speaker.getAttribute("data-pause") : "\u25cf", speaker.hasAttribute("data-start") ? speaker.getAttribute("data-start") : "\u25B6");
				if (speaker === activeSpeaker) {
					activeSpeaker = null;
				}
			}
			
			synth.speak(utt);
			
			activeSpeaker = speaker;
		}
		else if (synth.paused) {
			speaker.textContent = speaker.textContent.replace(iconStart, iconPause);
			synth.resume();
		} else if (synth.speaking) {
			speaker.textContent = speaker.textContent.replace(iconPause, iconStart);
			synth.pause();
		}
	});
});
