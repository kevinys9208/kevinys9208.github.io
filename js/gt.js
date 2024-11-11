let socket;

let roomId;
let userName;

let myModal;
let chatMessages;
let messageInput;
let sendButton;

window.onload = function() {
    myModal = new bootstrap.Modal(document.getElementById('connectModal'));
    myModal.show();

    chatMessages = document.getElementById('chat-messages');
    messageInput = document.getElementById('message-input');
    sendButton = document.getElementById('send-button');

    sendButton.onclick = function() {
        sendMessage();
    };
    
    messageInput.onkeypress = function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };
};

function connectWebSocket() {
    userName = document.getElementById('userName').value.trim();
    roomId = document.getElementById('roomId').value.trim();

    if (userName) {
        socket = new WebSocket(`wss://kevinys.duckdns.org/ws?userName=${userName}&roomId=${roomId}`);

        socket.onopen = function(e) {
            console.log("웹소켓 연결 성공");
            myModal.hide();
        };

        socket.onmessage = function(event) {
            var data = event.data.split(':');
            var from = data[0];
            
            switch (from) {
                case 'room':
                    roomId = data[1];
                    document.getElementById('roomIdLabel').innerHTML = roomId
                    break;
                case 'client':
                    addMessage(data[1], data[2]);
                    break;
            }
        };

        socket.onclose = function(event) {
            console.log("웹소켓 연결 종료");
        };

    } else {
        alert("이름은 필수로 입력해주세요!");
    }
}

function sendMessage() {
    const message = messageInput.value;
    if (message && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        messageInput.value = '';
    }
}

function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', userName == sender ? 'sent' : 'received');

    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                        now.getMinutes().toString().padStart(2, '0');

    messageElement.innerHTML = `<strong>${sender}:</strong> ${text}
                                <div class="timestamp">${timeString}</div>`;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}