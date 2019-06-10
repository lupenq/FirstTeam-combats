const chatButton = document.querySelector('.chatButton');
const chatMessagess = document.querySelector('.chatMessages');
const textMessage = document.querySelector('.chatInput');
var userToken = localStorage.getItem('token');

function templateChat(data) {
    const name = data.user ? data.user.username : 'Anon';
    const msg = data.message;
    const date = new Date(data.timestamp);

    return `
   <li class="message">
   <span>[${prettyDate(date)}] </span><span class="chatUsername">${name}</span>: <span class="textMessage">${msg}</span>
   </li>
   `;
}

window.onload = function () {
    callXHRget();
}

document.querySelector('.chatForm').onsubmit = function (e) {
    e.preventDefault();
    callXHRpost()
        .then(() => {
            callXHRget();
            textMessage.value = '';
        });
}

function callXHRget() {
    let xhrGet = new XMLHttpRequest();

    xhrGet.open('GET', '/chat' + '?token=' + userToken);
    xhrGet.send();

    xhrGet.onload = function () {
        var chatMessagesData = JSON.parse(xhrGet.responseText).chat;
        chatMessagess.innerHTML = chatMessagesData.reduce(function (html, messageData) {
            html += templateChat(messageData);
            return html;
        }, '');

    }

}

function prettyDate(date) {
    return `${zeros(date.getHours())}:${zeros(date.getMinutes())}:${zeros(date.getSeconds())}`;
}

function zeros(number) {
    if (number < 10)
        return `0${number}`
    return number;
}

function callXHRpost() {
    return new Promise((resolve, reject) => {
        let xhrPost = new XMLHttpRequest();
        let messeges = textMessage.value;

        xhrPost.open('POST', '/chat');
        xhrPost.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrPost.send(`token=${userToken}&message=${messeges}`);

        xhrPost.onload = function () {
            return resolve();
        }
    })
}
