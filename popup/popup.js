document.addEventListener('DOMContentLoaded', () => {
  const pitchSlider = document.getElementById('pitch-slider');
  const pitchValue = document.getElementById('pitch-value');
  const resetButton = document.getElementById('reset-button');

  // --- Helper Functions ---
  function updateDisplay(value) {
    const displayValue = value > 0 ? `+${value}` : value;
    pitchValue.textContent = displayValue;
  }

  // This is the new function that sends the message to the content script
  function sendMessageToContentScript(value) {
    browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        if (tabs.length > 0) {
          // Log to the popup's console right before sending
          browser.tabs.sendMessage(tabs[0].id, {
            pitchValue: value
          });
        }
      })
      .catch(error => {
        // Log errors to the popup's console
        console.error("Could not send message:", error);
      });
  }

  // --- Event Listeners ---
  pitchSlider.addEventListener('input', () => {
    const newPitch = pitchSlider.value;
    updateDisplay(newPitch);
    sendMessageToContentScript(newPitch); // Send the new value
  });

  resetButton.addEventListener('click', () => {
    pitchSlider.value = 0;
    updateDisplay(0);
    sendMessageToContentScript(0); // Send the reset value
  });
});