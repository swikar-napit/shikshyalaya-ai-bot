// script.js
// NOTE: The system prompt used to live here as a plain JS string. It has
// been moved to api/chat.js (server-side) because anything in this file is
// visible to anyone via browser dev tools — a client-side system prompt can
// be bypassed entirely by calling /api/chat directly. This file now only
// handles UI + sending the conversation history.

const STORAGE_KEY = 'shikshyalaya_chat_history';
const MAX_MESSAGE_LENGTH = 500;

let chatHistory = [];

// Restore a previous conversation from this browser (if any).
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  chatHistory = saved ? JSON.parse(saved) : [];
} catch (e) {
  console.warn('Could not restore chat history:', e);
  chatHistory = [];
}

function saveHistory() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
  } catch (e) {
    console.warn('Could not save chat history:', e);
  }
}

// Re-render any saved messages after the static welcome message in the HTML.
window.addEventListener('DOMContentLoaded', () => {
  chatHistory.forEach((msg) => {
    appendMessage(msg.role === 'user' ? 'user' : 'bot', msg.content);
  });
});

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatText(text) {
  if (!text) return '';
  let str = typeof text === 'string' ? text : JSON.stringify(text);

  // Escape raw HTML first so nothing in the message (user or model output)
  // can inject markup, then layer our own safe formatting on top.
  str = escapeHtml(str);

  // **bold**
  str = str.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

  // Emails -> mailto: links
  str = str.replace(
    /([\w.+-]+@[\w-]+\.[\w.-]+)/g,
    '<a href="mailto:$1">$1</a>'
  );

  // Phone-like number sequences (8+ digits, optional leading +) -> tel: links
  str = str.replace(/(\+?\d[\d-]{7,}\d)/g, (match) => {
    const dialNumber = match.replace(/-/g, '');
    return `<a href="tel:${dialNumber}">${match}</a>`;
  });

  // Bare URLs -> clickable links
  str = str.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Turn "- item" / "* item" lines into a real <ul><li> list, keep the
  // rest as plain text with line breaks.
  const lines = str.split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)/);
    if (bulletMatch) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${bulletMatch[1]}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
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

async function sendMessage() {
  const inputEl = document.getElementById('user-input');
  const message = inputEl.value.trim();
  if (!message) return;

  if (message.length > MAX_MESSAGE_LENGTH) {
    appendMessage(
      'bot',
      `That message is a little long — please keep it under ${MAX_MESSAGE_LENGTH} characters so I can read it properly.`
    );
    return;
  }

  appendMessage('user', message);
  inputEl.value = '';
  setInputEnabled(false); // prevent double-sends while waiting for a reply

  chatHistory.push({ role: 'user', content: message });
  saveHistory();

  const typingIndicator = document.getElementById('typing-indicator');
  typingIndicator.style.display = 'block';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Only the conversation turns are sent — the system prompt is owned
      // and applied server-side in api/chat.js.
      body: JSON.stringify({ messages: chatHistory })
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.error?.message || 'Sorry, something went wrong. Please try again.';
      appendMessage('bot', errMsg);
      return;
    }

    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    chatHistory.push({ role: 'assistant', content: reply });
    saveHistory();
    appendMessage('bot', reply);
  } catch (error) {
    console.error('Chatbot Error:', error);
    appendMessage('bot', 'Sorry, I am having trouble connecting right now.');
  } finally {
    typingIndicator.style.display = 'none';
    setInputEnabled(true);
  }
}

function appendMessage(sender, text) {
  const messagesDiv = document.getElementById('chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.innerHTML = formatText(text);
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function handleKeyPress(e) {
  if (e.key === 'Enter') sendMessage();
}

function clearChat() {
  chatHistory = [];
  saveHistory();
  location.reload();
}