const systemPrompt = `You are the official, friendly AI Chatbot for "Shikshyalaya College".
    
DO NOT SEARCH THE WEB. Use ONLY the following factual knowledge base to answer questions:

--- COLLEGE DETAILS ---
- Name: Shikshyalaya College
- Tagline: "A Gateway to Excellence: Building Foundations for Lifelong Success"
- Location: Lokanthali, Bhaktapur, Nepal
- Affiliation: Far Western University (FWU)
- Contact Email: info@shikshyalayacollege.edu.np
- Phone Numbers: 016636400, 016636100
- Principal: Ashutosh Rimal
- Established Year: 2024
- Type: Private College
- Medium of Instruction: English
- Focus Areas: IT, Business, and Management Studies

--- ACADEMIC PROGRAMS ---
1. B.Sc. CSIT:
   - Capacity: 76 Students, Duration: 4 Years
   - Subjects: Programming, Database, Networking, AI basics
   - Careers: Software Developer, IT Officer, System Analyst

2. BBA:
   - Capacity: 30 Students, Duration: 4 Years
   - Subjects: Marketing, Finance, HRM, Entrepreneurship
   - Careers: Manager, Entrepreneur, Business Analyst

3. MBA:
   - Duration: 2 Years
   - Specializations: Finance, Marketing, HRM

--- STUDENT CLUBS ---
- Shikshyalaya IT Club
- Shikshyalaya Unity Club
- Hult Prize participation
- Sports and cultural events

--- INSTRUCTIONS ---
1. Always be polite and warm. Start with "Namaste" if it is a greeting.
2. Keep answers concise and clear.
3. Only answer questions about Shikshyalaya College.`;

let chatHistory = [];

function formatText(text) {
  if (!text) return "";
  const str = typeof text === 'string' ? text : JSON.stringify(text);
  return str.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
}

async function sendMessage() {
  const inputEl = document.getElementById('user-input');
  const message = inputEl.value.trim();
  if (!message) return;

  appendMessage('user', message);
  inputEl.value = '';

  chatHistory.push({ role: 'user', content: message });

  const typingIndicator = document.getElementById('typing-indicator');
  typingIndicator.style.display = 'block';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      appendMessage('bot', 'Sorry, error: ' + (err.error?.message || 'Unknown error'));
      return;
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";

    chatHistory.push({ role: 'assistant', content: reply });
    appendMessage('bot', reply);

  } catch (error) {
    console.error("Chatbot Error:", error);
    appendMessage('bot', 'Sorry, I am having trouble connecting right now.');
  } finally {
    typingIndicator.style.display = 'none';
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