/* ==========================================================================
   EXOTIC GB HUB - AI AQUARIUM CHATBOT (RENDER BACKEND INTEGRATED)
   ========================================================================== */

const BACKEND_CHAT_URL = "https://exotic-gb-hub-backend-1.onrender.com/api/chat";
const WHATSAPP_URL = "https://wa.me/918884730939";

let chatHistory = [];

function initChatbotUI() {
  if (document.getElementById('exoticChatbotBtn')) return;

  const style = document.createElement('style');
  style.id = 'exotic-chatbot-styles';
  style.innerHTML = `
    /* Floating Chatbot Button */
    .floating-chatbot-btn {
      position: fixed;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0284c7, #8b5cf6);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      border: 2px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 10px 25px rgba(2, 132, 199, 0.45);
      cursor: pointer;
      z-index: 9998;
      transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease;
      outline: none;
    }
    .floating-chatbot-btn:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 14px 30px rgba(139, 92, 246, 0.55);
    }
    .chatbot-btn-pulse {
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      border: 2px solid #38bdf8;
      animation: chatPulse 2.5s infinite;
      pointer-events: none;
    }
    @keyframes chatPulse {
      0% { transform: scale(1); opacity: 0.8; }
      70% { transform: scale(1.28); opacity: 0; }
      100% { transform: scale(1.28); opacity: 0; }
    }

    /* Base responsive rules before JS positioning runs */
    @media (min-width: 769px) {
      .floating-chatbot-btn { bottom: 20px; right: 86px; }
      body:has(.floating-cart-pill) .floating-chatbot-btn { bottom: 28px; right: 190px; }
    }
    @media (max-width: 768px) {
      .floating-chatbot-btn { bottom: 86px; right: 20px; }
      body:has(.floating-cart-pill) .floating-chatbot-btn { bottom: 78px; right: 18px; }
    }

    /* Chat Window */
    .chatbot-window {
      position: fixed;
      bottom: 86px;
      right: 20px;
      width: 360px;
      max-width: calc(100vw - 32px);
      height: 520px;
      max-height: calc(100vh - 110px);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 22px;
      border: 1.5px solid rgba(255, 255, 255, 0.95);
      box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.28);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 10001;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .chatbot-window.active {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }

    .chat-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.1);
    }
    .chat-header-info { display: flex; align-items: center; gap: 10px; }
    .chat-avatar-badge {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0284c7, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      border: 2px solid white;
    }
    .chat-title-text h4 { font-size: 0.92rem; font-weight: 800; margin: 0; font-family: 'Space Grotesk', sans-serif; }
    .chat-title-text span { font-size: 0.72rem; color: #34d399; font-weight: 700; display: flex; align-items: center; gap: 4px; }
    .chat-title-text span::before {
      content: ''; width: 7px; height: 7px; border-radius: 50%; background: #34d399; display: inline-block;
    }
    .chat-close-btn {
      background: transparent; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; padding: 4px;
    }
    .chat-close-btn:hover { color: #ffffff; }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
    }
    .chat-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 0.88rem;
      line-height: 1.45;
      word-break: break-word;
    }
    .chat-msg.bot {
      background: #ffffff;
      color: #0f172a;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .chat-msg.user {
      background: linear-gradient(135deg, #0284c7, #8b5cf6);
      color: #ffffff;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25);
    }

    .chat-whatsapp-action {
      margin-top: 8px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #25D366;
      color: #ffffff !important;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 999px;
      font-weight: 800;
      font-size: 0.8rem;
      box-shadow: 0 6px 16px rgba(37, 211, 102, 0.35);
      transition: transform 0.2s ease, filter 0.2s ease;
    }
    .chat-whatsapp-action:hover {
      transform: translateY(-2px);
      filter: brightness(1.08);
    }

    .chat-suggestions {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 6px 14px 10px 14px;
      scrollbar-width: none;
    }
    .chat-suggestions::-webkit-scrollbar { display: none; }
    .chat-chip {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 0.74rem;
      font-weight: 700;
      color: #475569;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .chat-chip:hover {
      background: #4f46e5;
      color: #ffffff;
      border-color: #4f46e5;
    }

    .chat-typing {
      display: none;
      align-self: flex-start;
      background: #ffffff;
      padding: 8px 14px;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
      gap: 4px;
    }
    .chat-typing span {
      width: 6px;
      height: 6px;
      background: #94a3b8;
      border-radius: 50%;
      animation: chatBlink 1.4s infinite;
    }
    .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
    .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes chatBlink {
      0%, 100% { opacity: 0.3; transform: translateY(0); }
      50% { opacity: 1; transform: translateY(-3px); }
    }

    .chat-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #ffffff;
      border-top: 1.5px solid #e2e8f0;
    }
    .chat-input {
      flex: 1;
      border: 1.5px solid #cbd5e1;
      border-radius: 999px;
      padding: 9px 16px;
      font-size: 0.88rem;
      font-weight: 600;
      outline: none;
      color: #0f172a;
    }
    .chat-input:focus { border-color: #0284c7; }
    .chat-send-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0284c7, #8b5cf6);
      border: none;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.92rem;
      transition: transform 0.2s;
    }
    .chat-send-btn:hover { transform: scale(1.08); }
  `;
  document.head.appendChild(style);

  const botHTML = `
    <button class="floating-chatbot-btn" id="exoticChatbotBtn" title="Ask Fish & Aquarium AI" aria-label="Open AI Chatbot">
      <div class="chatbot-btn-pulse"></div>
      <i class="fa-solid fa-robot"></i>
    </button>

    <div class="chatbot-window" id="exoticChatbotWindow">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar-badge"><i class="fa-solid fa-fish-fins"></i></div>
          <div class="chat-title-text">
            <h4>EXOTIC AI Assistant</h4>
            <span>Online • Fish & Tank Expert</span>
          </div>
        </div>
        <button class="chat-close-btn" id="exoticChatClose" title="Close"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="chat-messages" id="exoticChatMessages">
        <div class="chat-msg bot">
          Hello! 🐠 I am your EXOTIC GB HUB Assistant. Ask me about live fishes, tank sizes, accessories, feed, or water care!
        </div>
      </div>

      <div class="chat-suggestions">
        <button class="chat-chip" onclick="sendQuickMessage('What live fishes do you offer?')">Live Fishes</button>
        <button class="chat-chip" onclick="sendQuickMessage('How do I size a rimless tank?')">Tank Sizing</button>
        <button class="chat-chip" onclick="sendQuickMessage('What accessories and filters are available?')">Equipment</button>
        <button class="chat-chip" onclick="sendQuickMessage('Connect to WhatsApp admin')">WhatsApp Admin</button>
      </div>

      <div class="chat-typing" id="exoticChatTyping">
        <span></span><span></span><span></span>
      </div>

      <form class="chat-footer" id="exoticChatForm" onsubmit="handleChatSubmit(event)">
        <input type="text" class="chat-input" id="exoticChatInput" placeholder="Ask about fish, tanks, food..." autocomplete="off" required />
        <button type="submit" class="chat-send-btn" title="Send message"><i class="fa-solid fa-paper-plane"></i></button>
      </form>
    </div>
  `;

  const div = document.createElement('div');
  div.innerHTML = botHTML;
  document.body.appendChild(div);

  document.getElementById('exoticChatbotBtn').addEventListener('click', toggleChatbotWindow);
  document.getElementById('exoticChatClose').addEventListener('click', toggleChatbotWindow);

  window.addEventListener('resize', positionChatbotIcon);
  window.addEventListener('scroll', positionChatbotIcon, { passive: true });
  setTimeout(positionChatbotIcon, 100);
}

// Positions left of cart in laptop mode, and above cart in mobile mode
function positionChatbotIcon() {
  const btn = document.getElementById('exoticChatbotBtn');
  const win = document.getElementById('exoticChatbotWindow');
  if (!btn) return;

  const cartElement = document.querySelector('.floating-cart-pill') || document.querySelector('.floating-cart-btn');
  if (!cartElement) return;

  const isMobile = window.innerWidth <= 768;
  const rect = cartElement.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) return;

  if (isMobile) {
    // MOBILE MODE: chatbot icon directly ABOVE the cart option
    const rightOffset = Math.max(12, window.innerWidth - rect.right);
    const bottomOffset = (window.innerHeight - rect.top) + 12;
    btn.style.right = `${rightOffset}px`;
    btn.style.bottom = `${bottomOffset}px`;

    if (win) {
      win.style.right = `${rightOffset}px`;
      win.style.bottom = `${bottomOffset + 60}px`;
    }
  } else {
    // LAPTOP MODE: chatbot icon to the LEFT SIDE of the cart icon
    const rightOffset = (window.innerWidth - rect.left) + 14;
    const bottomOffset = window.innerHeight - rect.bottom;
    btn.style.right = `${rightOffset}px`;
    btn.style.bottom = `${bottomOffset}px`;

    if (win) {
      win.style.right = `${rightOffset}px`;
      win.style.bottom = `${bottomOffset + 62}px`;
    }
  }
}

function toggleChatbotWindow() {
  const win = document.getElementById('exoticChatbotWindow');
  const isActive = win.classList.toggle('active');
  if (isActive) {
    document.getElementById('exoticChatInput').focus();
    positionChatbotIcon();
  }
}

function appendMessage(text, sender = 'bot', showWhatsApp = false) {
  const container = document.getElementById('exoticChatMessages');
  const msgEl = document.createElement('div');
  msgEl.className = `chat-msg ${sender}`;
  
  let formattedText = text.replace(/\[SHOW_WHATSAPP\]/g, '').trim();
  msgEl.innerText = formattedText;

  if (showWhatsApp) {
    const waWrap = document.createElement('div');
    waWrap.style.marginTop = "8px";
    waWrap.innerHTML = `
      <a href="${WHATSAPP_URL}?text=${encodeURIComponent('Hi EXOTIC GB HUB Admin, I have an inquiry: ' + formattedText)}" target="_blank" class="chat-whatsapp-action">
        <i class="fa-brands fa-whatsapp"></i> Connect to WhatsApp
      </a>
    `;
    msgEl.appendChild(waWrap);
  }

  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}

function sendQuickMessage(text) {
  document.getElementById('exoticChatInput').value = text;
  handleChatSubmit(new Event('submit'));
}

async function handleChatSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('exoticChatInput');
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage(userText, 'user');
  input.value = '';

  if (/whatsapp|admin|contact|call|phone|owner/i.test(userText)) {
    appendMessage("For more info contact admin directly on WhatsApp:", 'bot', true);
    return;
  }

  const typing = document.getElementById('exoticChatTyping');
  typing.style.display = 'flex';
  const container = document.getElementById('exoticChatMessages');
  container.scrollTop = container.scrollHeight;

  try {
    const res = await fetch(BACKEND_CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, history: chatHistory })
    });

    typing.style.display = 'none';

    if (!res.ok) {
      appendMessage("For more info contact admin.", 'bot', true);
      return;
    }

    const data = await res.json();
    const replyText = data.reply || "For more info contact admin.";
    const showWA = data.showWhatsApp || /contact admin|for more info/i.test(replyText);

    chatHistory.push({ role: "user", parts: [{ text: userText }] });
    chatHistory.push({ role: "model", parts: [{ text: replyText }] });

    appendMessage(replyText, 'bot', showWA);
  } catch (err) {
    typing.style.display = 'none';
    appendMessage("For more info contact admin.", 'bot', true);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbotUI);
} else {
  initChatbotUI();
}