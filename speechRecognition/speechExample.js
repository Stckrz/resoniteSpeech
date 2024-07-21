var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const statusText = document.querySelector(".status")
const sendButton = document.querySelector('.sendButton');

const ws = new WebSocket('ws://localhost:8080')
ws.onopen = () => {
	console.log('websocket connection established')
	statusText.innerText = "Connection Established"
}

ws.onmessage = (event) => {
	const message = event.data;
	console.log("message", message)
	if (message === 'br55667') {
		statusText.innerText = "Listening..."
		recognition.start()
	}
}

const keywords = [
	"big head",
	"cancel",
	"you're grounded",
	"you're ungrounded",
	"them",
	"that person"
];


const recognition = new SpeechRecognition();
sendButton.addEventListener('click', () => ws.send('br55667'))

// if (SpeechGrammarList) {
// 	const speechRecognitionList = new SpeechGrammarList();
// 	const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
// 	speechRecognitionList.addFromString(grammar, 1);
// 	recognition.grammars = speechRecognitionList;
// }
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = function(event) {
	for (let i = event.resultIndex; i < event.results.length; i++) {
		const keyword = event.results[i][0].transcript;
		const keyphraseArray = keyword.split(" ");
		console.log(keyword)
		console.log('Confidence: ' + event.results[i][0].confidence);
		statusText.innerText = `Registered "${keyword}"`
		if (keywords.includes(keyword)) {
			ws.send(keyword)
			recognition.stop();
		} else if (keyphraseArray.length > 1) {
			if (keyphraseArray[0] === 'Target') {
				ws.send(keyphraseArray[1])
			}
		}
	}
}

recognition.onend = function() {
	console.log('recognition ended');
}

recognition.onnomatch = function(event) {
	statusText.innerText = "I didn't recognise that keyword.";
}

recognition.onerror = function(event) {
	statusText.innerText = 'Error occurred in recognition: ' + event.error;
}
