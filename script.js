

const MAX_MESSAGE_LENGTH = 600;

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatText(text) {
  if (!text) return '';
  let str = typeof text === 'string' ? text : JSON.stringify(text);

  str = escapeHtml(str);

  // **bold**
  str = str.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

  // Emails
  str = str.replace(
    /([\w.+-]+@[\w-]+\.[\w.-]+)/g,
    '<a href="mailto:$1">$1</a>'
  );

  // Phone numbers
  str = str.replace(/(\+?\d[\d-]{7,}\d)/g, (match) => {
    const dialNumber = match.replace(/-/g, '');
    return `<a href="tel:${dialNumber}">${match}</a>`;
  });

  // URLs
  str = str.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Bullet lists
  const lines = str.split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)/);
    if (bulletMatch) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${bulletMatch[1]}</li>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      if (line.trim() !== '') html += line + '<br>';
    }
  }
  if (inList) html += '</ul>';

  return html;
}

function setInputEnabled(enabled) {
  const inputEl = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  if (inputEl) inputEl.disabled = !enabled;
  if (sendBtn) sendBtn.disabled = !enabled;
  if (enabled && inputEl) inputEl.focus();
}

function showTyping(show) {
  const t = document.getElementById('typing-indicator');
  if (t) t.style.display = show ? 'flex' : 'none';
}

async function sendMessage() {
  const inputEl = document.getElementById('user-input');
  const message = inputEl.value.trim();
  if (!message) return;

  if (message.length > MAX_MESSAGE_LENGTH) {
    appendMessage('bot', `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`);
    return;
  }

  // Hide chips after first message
  const chipRow = document.getElementById('chip-row');
  if (chipRow) chipRow.style.display = 'none';

  appendMessage('user', message);
  inputEl.value = '';
  setInputEnabled(false);
  showTyping(true);

  try {
    // No history — only the current message is sent each time
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.error?.message || 'Sorry, something went wrong. Please try again.';
      appendMessage('bot', errMsg);
      return;
    }

    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    appendMessage('bot', reply);

  } catch (error) {
    console.error('Chatbot Error:', error);
    appendMessage('bot', 'Sorry, I am having trouble connecting right now. Please try again.');
  } finally {
    showTyping(false);
    setInputEnabled(true);
  }
}

function appendMessage(sender, text) {
  const messagesDiv = document.getElementById('chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;

  if (sender === 'bot') {
    // Animate bot message typing in
    msgDiv.innerHTML = '';
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    const formatted = formatText(text);
    // Small delay then set content for a smooth feel
    setTimeout(() => {
      msgDiv.innerHTML = formatted;
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 80);
  } else {
    msgDiv.innerHTML = formatText(text);
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}

function chipSend(text) {
  const inputEl = document.getElementById('user-input');
  inputEl.value = text;
  sendMessage();
}

function handleKeyPress(e) {
  if (e.key === 'Enter') sendMessage();
}

function clearChat() {
  location.reload();
}