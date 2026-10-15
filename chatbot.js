/* ==========================================================================
   EXOTIC GB HUB - CLIENT-SIDE FAQ CHATBOT
   ========================================================================== */

const WHATSAPP_URL = "https://wa.me/918884730939";

/* ==========================================================================
   FAQ DATABASE
   ========================================================================== */
const exoticFAQs = {
  fish: {
    question: "Available Fish",
    answer: `🐟 We have different varieties of aquarium fish available depending on our current stock.
    <br><br><strong>Available Fish Varieties:</strong>
    <ul>
      <li>🐠 Guppy</li>
      <li>🐟 Betta (Full Moon, Giant Plakat, Crowntail)</li>
      <li>🐠 Tetra</li>
      <li>🐟 Koi Carp</li>
    </ul>
    Please check our latest stock update or contact EXOTIC GB HUB for today's availability.`
  },
  shipping: {
    question: "Shipping",
    answer: "🚚 Yes! EXOTIC GB HUB provides shipping across India. Shipping availability and charges may depend on your location and the type of fish ordered."
  },
  order: {
    question: "How to Order",
    answer: "📦 To place an order, browse the available fish in our dashboard, select the product you want, and follow the ordering process. You can also contact us directly if you need assistance."
  },
  payment: {
    question: "Payment",
    answer: "💳 Payment options depend on the current ordering process. Please contact EXOTIC GB HUB before making a payment so we can provide the correct payment details."
  },
  contact: {
    question: "Contact",
    answer: "📞 You can contact EXOTIC GB HUB through our official contact channels. Send us your requirements and we will help you with fish availability and ordering."
  }
};

/* ==========================================================================
   KEYWORD / QUERY MATCHING ENGINE
   ========================================================================== */
function findExoticAnswer(question) {
  const text = question.toLowerCase().trim();

  /* Fish */
  if (
    text.includes('fish') ||
    text.includes('stock') ||
    text.includes('available') ||
    text.includes('species') ||
    text.includes('variety') ||
    text.includes('betta') ||
    text.includes('guppy')
  ) {
    return { text: exoticFAQs.fish.answer, showWA: false };
  }

  /* Shipping */
  if (
    text.includes('shipping') ||
    text.includes('ship') ||
    text.includes('delivery') ||
    text.includes('deliver')
  ) {
    return { text: exoticFAQs.shipping.answer, showWA: false };
  }

  /* Order */
  if (
    text.includes('order') ||
    text.includes('buy') ||
    text.includes('purchase') ||
    text.includes('place order') ||
    text.includes('how can i buy') ||
    text.includes('how to buy')
  ) {
    return { text: exoticFAQs.order.answer, showWA: false };
  }

  /* Payment */
  if (
    text.includes('payment') ||
    text.includes('pay') ||
    text.includes('upi') ||
    text.includes('money')
  ) {
    return { text: exoticFAQs.payment.answer, showWA: false };
  }

  /* Contact / WhatsApp / Admin */
  if (
    text.includes('contact') ||
    text.includes('phone') ||
    text.includes('whatsapp') ||
    text.includes('instagram') ||
    text.includes('dm') ||
    text.includes('admin') ||
    text.includes('owner') ||
    text.includes('call')
  ) {
    return { text: exoticFAQs.contact.answer, showWA: true };
  }

  /* Greetings */
  if (
    text === 'hi' ||
    text === 'hello' ||
    text === 'hey' ||
    text.includes('good morning') ||
    text.includes('good afternoon') ||
    text.includes('good evening')
  ) {
    return {
      text: "👋 Hello! Welcome to EXOTIC GB HUB. How can I help you today? You can ask about fish availability, shipping, orders, payment, or contact details.",
      showWA: false
    };
  }

  /* Thank you */
  if (text.includes('thank') || text.includes('thanks')) {
    return {
      text: "😊 You're welcome! EXOTIC GB HUB is always happy to help.",
      showWA: false
    };
  }

  /* Fallback */
  return {
    text: `🤖 I'm currently a simple FAQ assistant.<br><br>
    I can help you with:<br>
    🐟 Fish availability<br>
    🚚 Shipping<br>
    📦 Ordering<br>
    💳 Payment<br>
    📞 Contact<br><br>
    Please select one of the FAQ buttons or contact our admin directly:`,
    showWA: true
  };
}

/* ==========================================================================
   UI INJECTION & RESPONSIVE POSITIONING
   ========================================================================== */
function initChatbotUI() {
  if (document.getElementById('exoticChatbotBtn')) return;

  const style = document.createElement('style');
  style.id = 'exotic-chatbot-styles';
  style.innerHTML = `
    .floating-chatbot-btn {
      position: fixed;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #000000;
      color: #00e5ff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      border: 2px solid #04C4D9;
      box-shadow: 0 5px 25px rgba(0, 229, 255, 0.35);
      cursor: pointer;
      z-index: 10000;
      transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
      outline: none;
    }
    .floating-chatbot-btn:hover {
      transform: scale(1.08);
      background: #04C4D9;
      color: #000000;
    }

    .chatbot-window {
      position: fixed;
      width: 360px;
      max-width: calc(100vw - 32px);
      height: 520px;
      max-height: calc(100vh - 120px);
      background: #ffffff;
      border-radius: 18px;
      border: 1px solid #04C4D9;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.35);
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

    /* --- DESKTOP / LAPTOP (LEFT SIDE) --- */
    @media (min-width: 769px) {
      .floating-chatbot-btn {
        bottom: 25px;
        left: 25px;
        right: auto;
      }
      .chatbot-window {
        bottom: 95px;
        left: 25px;
        right: auto;
      }
    }

    /* --- MOBILE (LIFTED HIGHER TO CLEAR CART ICON) --- */
    @media (max-width: 768px) {
      .floating-chatbot-btn {
        bottom: 96px;
        right: 18px;
        left: auto;
      }
      .chatbot-window {
        bottom: 162px;
        right: 16px;
        left: auto;
        height: 480px;
      }
    }

    .chat-header {
      background: #000000;
      color: white;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #04C4D9;
    }
    .chat-header-info strong {
      display: block;
      font-size: 15px;
      color: #00e5ff;
      font-weight: 800;
    }
    .chat-header-info small {
      display: block;
      color: #cccccc;
      font-size: 11px;
    }
    .chat-close-btn {
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 1.4rem;
      cursor: pointer;
      line-height: 1;
    }
    .chat-close-btn:hover { color: #00e5ff; }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      background: #f4f7f8;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .chat-msg {
      max-width: 85%;
      padding: 10px 14px;
      font-size: 13px;
      line-height: 1.5;
      word-break: break-word;
    }
    .chat-msg ul {
      margin: 6px 0 0 16px;
      padding: 0;
    }
    .chat-msg.bot {
      background: #ffffff;
      color: #222222;
      align-self: flex-start;
      border-radius: 12px 12px 12px 3px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }
    .chat-msg.user {
      background: #000000;
      color: #ffffff;
      align-self: flex-end;
      border-radius: 12px 12px 3px 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }

    .chat-whatsapp-action {
      margin-top: 8px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #25D366;
      color: #ffffff !important;
      text-decoration: none;
      padding: 7px 14px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 12px;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);
    }

    .chat-suggestions {
      padding: 10px;
      background: #ffffff;
      border-top: 1px solid #eeeeee;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      max-height: 105px;
      overflow-y: auto;
    }
    .chat-chip {
      border: 1px solid #04C4D9;
      background: #ffffff;
      color: #111111;
      padding: 6px 10px;
      border-radius: 16px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .chat-chip:hover {
      background: #04C4D9;
      color: #000000;
    }

    .chat-typing {
      display: none;
      align-self: flex-start;
      background: #ffffff;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 12px;
      color: #777777;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }

    .chat-footer {
      display: flex;
      height: 54px;
      border-top: 1px solid #dddddd;
      background: #ffffff;
    }
    .chat-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 12px;
      font-size: 13px;
      color: #222222;
    }
    .chat-send-btn {
      width: 52px;
      border: none;
      background: #000000;
      color: #00e5ff;
      cursor: pointer;
      font-size: 16px;
      transition: 0.2s;
    }
    .chat-send-btn:hover {
      background: #04C4D9;
      color: #000000;
    }
  `;
  document.head.appendChild(style);

  const botHTML = `
    <button class="floating-chatbot-btn" id="exoticChatbotBtn" title="Ask EXOTIC GB HUB Assistant" aria-label="Open Chatbot">
      <i class="fa-solid fa-comments"></i>
    </button>

    <div class="chatbot-window" id="exoticChatbotWindow">
      <div class="chat-header">
        <div class="chat-header-info">
          <strong>EXOTIC GB HUB</strong>
          <small>Fish Assistant • FAQ Support</small>
        </div>
        <button class="chat-close-btn" id="exoticChatClose" title="Close">×</button>
      </div>

      <div class="chat-messages" id="exoticChatMessages">
        <div class="chat-msg bot">
          👋 <strong>Hello!</strong><br><br>
          Welcome to <strong>EXOTIC GB HUB</strong>.<br><br>
          I can help you with fish availability, shipping, orders, payment, and contact information.<br><br>
          Choose an FAQ below or type your question.
        </div>
      </div>

      <div class="chat-suggestions">
        <button class="chat-chip" onclick="askFAQ('fish')">🐟 Available Fish</button>
        <button class="chat-chip" onclick="askFAQ('shipping')">🚚 Shipping</button>
        <button class="chat-chip" onclick="askFAQ('order')">📦 How to Order</button>
        <button class="chat-chip" onclick="askFAQ('payment')">💳 Payment</button>
        <button class="chat-chip" onclick="askFAQ('contact')">📞 Contact</button>
      </div>

      <div class="chat-typing" id="exoticChatTyping">Typing...</div>

      <form class="chat-footer" id="exoticChatForm" onsubmit="handleChatSubmit(event)">
        <input type="text" class="chat-input" id="exoticChatInput" placeholder="Ask something..." autocomplete="off" required />
        <button type="submit" class="chat-send-btn" title="Send message"><i class="fa-solid fa-paper-plane"></i></button>
      </form>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = botHTML;
  document.body.appendChild(container);

  document.getElementById('exoticChatbotBtn').addEventListener('click', toggleChatbotWindow);
  document.getElementById('exoticChatClose').addEventListener('click', toggleChatbotWindow);
}

function toggleChatbotWindow() {
  const win = document.getElementById('exoticChatbotWindow');
  const btn = document.getElementById('exoticChatbotBtn');
  const isActive = win.classList.toggle('active');

  if (isActive) {
    btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    setTimeout(() => document.getElementById('exoticChatInput').focus(), 100);
  } else {
    btn.innerHTML = '<i class="fa-solid fa-comments"></i>';
  }
}

function appendMessage(htmlContent, sender = 'bot', showWhatsApp = false) {
  const container = document.getElementById('exoticChatMessages');
  const msgEl = document.createElement('div');
  msgEl.className = `chat-msg ${sender}`;
  msgEl.innerHTML = htmlContent;

  if (showWhatsApp) {
    const waWrap = document.createElement('div');
    waWrap.style.marginTop = "8px";
    waWrap.innerHTML = `
      <a href="${WHATSAPP_URL}" target="_blank" class="chat-whatsapp-action">
        <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
      </a>
    `;
    msgEl.appendChild(waWrap);
  }

  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}

function askFAQ(category) {
  const faq = exoticFAQs[category];
  if (!faq) return;

  appendMessage(faq.question, 'user');

  const typing = document.getElementById('exoticChatTyping');
  typing.style.display = 'inline-block';
  const container = document.getElementById('exoticChatMessages');
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    typing.style.display = 'none';
    appendMessage(faq.answer, 'bot', category === 'contact');
  }, 350);
}

function handleChatSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('exoticChatInput');
  const question = input.value.trim();
  if (!question) return;

  appendMessage(question, 'user');
  input.value = '';

  const typing = document.getElementById('exoticChatTyping');
  typing.style.display = 'inline-block';
  const container = document.getElementById('exoticChatMessages');
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    typing.style.display = 'none';
    const result = findExoticAnswer(question);
    appendMessage(result.text, 'bot', result.showWA);
  }, 450);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbotUI);
} else {
  initChatbotUI();
}