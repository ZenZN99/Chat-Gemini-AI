const typingForm = document.querySelector(".typing-form"); // form element

const chatList = document.querySelector(".chat-list");

const API_Key = "AIzaSyC1XMDdsufCNgzKESncbuyiMLgKwvNSkuU";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_Key}`;

const showTypingEffect = (text, textElement) => {
  const words = text.split(" ");
  let currentWord = 0;
  const typingInterval = setInterval(() => {
    textElement.innerText +=  (currentWord === 0 ? "" : " ") + words[currentWord++];
    if (currentWord === words.length) {
      clearInterval(typingInterval);
    }

  },75);
};
const generateAPIResponse = async (div) => {
  const textElement = div.querySelector(".text");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "content-Type" : "application/json" },
      body: JSON.stringify({
        contents: [//
          {
            role: "user",
            parts: [{ text: userMessage }],//
          },
        ],
      }),
    });

    const data = await res.json();
    const apiResponse = data?.candidates[0].content.parts[0].text.replace(
      /\*\*(.*?)\*\*/g,
      '$1'
    );
   
    showTypingEffect(apiResponse, textElement);
  } catch (e) {
    console.error(e);
  } finally {
    div.classList.remove("loading");
  }
};

const copyMessage = (copy_btn) => {
  const messageText = copy_btn.parentElement.querySelector(".text").innerText;
  navigator.clipboard.writeText(messageText);////hsoub
  copy_btn.innerText = "✓";
  setTimeout(() => (copy_btn.innerText = "content_copy"), 1000);
};
const showLoading = () => {
  const html = `
   
            <div class="message-content">
              <img src="gemini.svg" alt="" />
              <p class="text"></p>
              <div class="loading">
                <div class="loadingBar"></div>
                <div class="loadingBar"></div>
                <div class="loadingBar"></div>
                <div class="loadingBar"></div>
              </div>
            </div>
              <span onClick="copyMessage(this)" class="material-symbols-outlined"> content_copy </span>
     
    `;
  const div = document.createElement("div");
  div.classList.add("message", "incoming", "loading");

  div.innerHTML = html;//

  chatList.appendChild(div);
  window.scrollTo(0, chatList.scrollHeight);
  generateAPIResponse(div);
};

const handleAoutGoingChat = () => {
  userMessage = document.querySelector(".typing-input").value;
  console.log(userMessage);

  if (!userMessage) return;

  const html = `
       <div class="message-content">
              <img src="user.png" alt="" />
              <p class="text"></p>
            </div>
    `;

  const div = document.createElement("div");//
  div.classList.add("message", "outgoing");
  div.innerHTML = html;

  div.querySelector(".text").innerHTML = userMessage;

  chatList.appendChild(div);

  typingForm.reset();

  window.scrollTo(0, chatList.scrollHeight);

  setTimeout(showLoading, 500);
};

typingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleAoutGoingChat();
});


