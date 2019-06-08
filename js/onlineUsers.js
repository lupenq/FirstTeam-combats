 const searchForOnlineUsers = document.querySelector('.searchForOnlineUsers');
 const listOfUsers =  document.querySelector('.listOfUsers');

function template(getOnlineUsers) {
    return `
    <li class="onlineUser" id="${getOnlineUsers.id}">${getOnlineUsers.username} <a href="#"><image src="./img/sword.png" class="callFight"></a> </li>
    `;
}

window.onload = function(){
    callXHR();
}

searchForOnlineUsers.onclick = function(){
    callXHR();
}

function callXHR(){
    let xhr = new XMLHttpRequest();

    xhr.open('GET', '/online');
    xhr.send();

    xhr.onload = function () {
            let getOnlineUsers = JSON.parse(xhr.responseText).users;
      
            if(getOnlineUsers.length > 0){
                listOfUsers.innerHTML = getOnlineUsers.reduce(function (html, user) {
                    html += template(user);
                    return html;
                }, '');
            } else {
                
                listOfUsers.innerHTML = '<li>Пока никого нет :(</li>';
            }
        }
}
