async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = userInput.value.trim();

    if (message === "") return;

    // Show user's message (right-aligned, cute avatar)
    chatBox.innerHTML += `
    <div class="user-message">
        <div class="message-bubble user-bubble">${message}</div>
        <div class="avatar">🤎</div>
    </div>`;

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.setAttribute('id', 'typing');
    typingIndicator.innerHTML = `<em>Cup of Care is brewing your reply... ☕✨</em>`;
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Simulate brewing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Send message to backend
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        // Remove typing indicator
        typingIndicator.remove();

        // Show bot reply (left-aligned, cafe avatar)
        chatBox.innerHTML += `
        <div class="bot-message">
            <div class="avatar">☕</div>
            <div class="message-bubble bot-bubble">${data.response}</div>
        </div>`;

        // Clear input and scroll to latest message
        userInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        typingIndicator.remove();
        chatBox.innerHTML += `
        <div class="bot-message">
            <div class="avatar">☕</div>
            <div class="message-bubble bot-bubble">Sorry! Something went wrong. Please try again. 💛</div>
        </div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
