const socket = io();

const { username, userChats } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", { username, userChats });
socket.on("message", (message) => {
  console.log(message);
  displayChat(message);
});

document.getElementById("chat-input").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.getElementById("messageText").value;
  socket.emit("chat-message", message);
});

function displayChat(message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.innerHTML = `<p class="info">${message.username}</p>
    <p class="mText">${message.message}</p>`;
  document.querySelector(".messageView").appendChild(messageDiv);
}
