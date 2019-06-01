 
function template(getOnlineUsers) {
    return `
    <li class="useronline" id="${getOnlineUsers.id}">${getOnlineUsers.username} is online <a href="#"><image src="./img/sword.png" class="fightlogo"></a> </li>
    `;
}

 
document.querySelector('.searchForOnlineUsers').onclick = function()
{
    let xhr = new XMLHttpRequest();

    xhr.open('GET', '/online');
    xhr.send();

    xhr.onload = function () {
            let getOnlineUsers = JSON.parse(xhr.responseText).users;
            // document.querySelector('.onlineConteiner').innerText = listOfOnlineUsers;
            document.querySelector('.onlineConteiner').innerHTML = //запускаем шаблонизацию
            getOnlineUsers.reduce(function (html, user) {
            html += template(user);
            return html;
    }, '');

        }
}
