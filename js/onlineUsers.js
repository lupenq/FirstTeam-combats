const listOfUsers = document.querySelector('.listOfUsers');

function template_onlineUsers(getOnlineUsers) {
    return `
    <li class="onlineUser" id="${getOnlineUsers.id}">${getOnlineUsers.username} <a href="#"><image src="./img/info.png" class="callFight"></a> </li>
    `;
}

window.onload = onlineUsers_Timer();

function onlineUsers_Timer(){
    callXHR_onlineUsers();
    setTimeout(function run() {
        callXHR_onlineUsers();
        setTimeout(run, 60000);
    }, 60000);
}

function callXHR_onlineUsers(){
    let xhr_onlineUsers = new XMLHttpRequest();
    xhr_onlineUsers.open('GET', '/online');
    xhr_onlineUsers.send();
    
    xhr_onlineUsers.onload = function () {
            let getOnlineUsers = JSON.parse(xhr_onlineUsers.responseText).users;
            if(getOnlineUsers.length > 0){
                listOfUsers.innerHTML = getOnlineUsers.reduce(function (html, user) {
                    html += template_onlineUsers(user);
                    return html;
                }, '');
            } else {
                
                listOfUsers.innerHTML = '<li>Пока никого нет :(</li>';
            }
        }
}
