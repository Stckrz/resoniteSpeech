var SpeechRecognition = SpeechRecognition 
var SpeechGrammarList = SpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent




	const colors = [
		'blue',
		'black',
		'red'
	]

	const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(" | ",)};`;

	const recognition = new SpeechRecognition();
	const speechRecognitionList = new SpeechGrammarList();

	speechRecognitionList.addFromString(grammar, 1);

	recognition.grammars = speechRecognitionList;
	recognition.continuous = false;
	recognition.lang = "en-US";
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;

	const diagnostic = document.querySelector(".output");
	const bg = document.querySelector("html");
	const hints = document.querySelector(".hints");

	let colorHTML = "";
	colors.forEach((color, i) => {
		console.log(color, i);
		colorHTML += `<span style="background-color:${color};"> ${color} </span>`;
	});
	hints.innerHTML = `Tap or click then say a color to change the background color of the app. Try ${colorHTML}.`;

	recognition.onresult = (event) => {
		const color = event.results[0][0].transcript;
		diagnostic.textContent = `Result received: ${color}.`;
		bg.style.backgroundColor = color;
		console.log(`Confidence: ${event.results[0][0].confidence}`);
	}

	recognition.onspeechend = () => {
		recognition.stop();
	};

	recognition.onnomatch = (event) => {
		diagnostic.textContent = "I didn't recognize that color.";
	}
	recognition.onerror = (event) => {
		diagnostic.textContent = `Error occurred in recognition: ${event.error}`;
	}
