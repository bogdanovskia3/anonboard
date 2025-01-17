const MAX_CHAR = 300; // Use consistent character limit
const postButton = document.getElementById('postButton');
const messageInput = document.getElementById('messageInput');
const charCount = document.getElementById('charCount');
const messageFeed = document.getElementById('messageFeed');

// Update the character count dynamically while typing
messageInput.addEventListener('input', () => {
    const currentLength = messageInput.value.length;
    charCount.textContent = `${currentLength}/${MAX_CHAR}`;  // Update the character count to match MAX_CHAR
});

postButton.addEventListener('click', async () => {
    const messageText = messageInput.value.trim();
    if (messageText.length > 0 && messageText.length <= MAX_CHAR) {
        try {
            const response = await fetch('http://localhost:5000/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: messageText }),
            });
            const newMessage = await response.json();

            // Update feed with the new message
            addMessageToFeed(
                newMessage.text,
                newMessage.randomTag,
                newMessage.timestamp
            );
            messageInput.value = '';  // Clear input
            charCount.textContent = `0/${MAX_CHAR}`;  // Reset character count
        } catch (error) {
            console.error('Failed to post message:', error);
        }
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5000/messages');
        const messages = await response.json();
        messages.forEach((msg) => {
            addMessageToFeed(
                msg.text,
                msg.randomTag,
                new Date(msg.timestamp)
            );
        });
    } catch (error) {
        console.error('Failed to fetch messages:', error);
    }
});

// Helper function to add a message to the feed
function addMessageToFeed(text, randomTag, timestamp) {
    const messageCard = document.createElement('div');
    messageCard.classList.add('message-card');

    const messageContent = document.createElement('p');
    messageContent.textContent = text;

    const messageFooter = document.createElement('div');
    messageFooter.classList.add('message-footer');
    messageFooter.innerHTML = `
        <span>${randomTag}</span>
        <span>${new Date(timestamp).toLocaleTimeString()}</span>
    `;

    messageCard.appendChild(messageContent);
    messageCard.appendChild(messageFooter);
    messageFeed.prepend(messageCard);
}
