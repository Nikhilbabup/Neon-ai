const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Your browser does not support Speech Recognition.");
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  const micButton = document.getElementById("mic-button");
  const micIcon = micButton.querySelector(".material-symbols-outlined");
  const promptInput = document.getElementById("prompt-input");

  let isListening = false;
  let silenceTimer = null;
  let minListenTimer = null;
  let canStop = false;

  micButton.addEventListener("click", () => {
    isListening ? stopListening() : startListening();
  });

  function startListening() {
    recognition.start();
    isListening = true;
    canStop = false;

    micIcon.textContent = "graphic_eq";
    micIcon.classList.add("listening");

    minListenTimer = setTimeout(() => {
      canStop = true;
      micIcon.textContent = "hearing";
    }, 4000);
  }

  function stopListening() {
    recognition.stop();
    isListening = false;

    micIcon.textContent = "mic";
    micIcon.classList.remove("listening");

    clearTimeout(silenceTimer);
    clearTimeout(minListenTimer);
  }

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    promptInput.value += transcript.trim() + " ";

    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      if (canStop) {
        stopListening();
        submitPrompt(); // Submit when silence detected
      }
    }, 2000);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    stopListening();
  };

  recognition.onend = () => {
    if (isListening) {
      try {
        recognition.start();
      } catch (err) {
        console.warn("Could not restart recognition:", err);
      }
    }
  };
}

// Submission handler
function submitPrompt() {
  const textarea = document.getElementById("prompt-input");
  const message = textarea.value.trim();
  if (message) {
    console.log("Submitting:", message);
    // Add backend call or UI handling here
    textarea.value = ""; // Clear input after submission
  }
}

// Submit on Enter
document.getElementById("prompt-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    submitPrompt();
  }
});
