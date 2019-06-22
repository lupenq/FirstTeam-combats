  var buttonSubmit = document.querySelector('.submit input');
  var nameField = document.querySelector('input.login');
  var passwordField = document.querySelector('input.pass');
  var formLog = document.querySelector('.formLog');

  formLog.addEventListener('submit', function(e) { 
    e.preventDefault();
    var xhr = new XMLHttpRequest();
    var body = 'username=' + nameField.value +
      '&password=' + passwordField.value;
    xhr.open("POST", '/login', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);
    xhr.onload = function() {
        let userToken = JSON.parse(xhr.responseText).user.token;
        localStorage.setItem('token', userToken);
        document.location.href = 'http://localhost:3333/mainPage.html';
    };
    
  });
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
   <span>[${prettyDate(date)}] </span><span class="chatUsername"><b>${name}</b></span>: <span class="textMessage">${msg}</span>
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


window.setInterval(function() {
    var elem = document.querySelector('.chatLog');
    elem.scrollTop = elem.scrollHeight;
  }, 5000);
const findOponentButton = document.querySelector('.findOponent');
const hide = document.querySelector('.hide');
const fight_logs = document.querySelector('.fight-logs');

findOponentButton.addEventListener('click', function() {
    const xhr = new XMLHttpRequest();
    
    const body = 'token=' + localStorage.getItem('token');
    xhr.open("POST", '/fight', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);

    xhr.onload = function() {

        if(JSON.parse(xhr.responseText).combat.status === 'pending') {

            fight_logs.innerHTML = '<li>Ожидание противника</li>';

            const params =  'token=' + localStorage.getItem('token') +
            '&combat_id=' + JSON.parse(xhr.responseText).combat.id;

            const timer = setInterval(function(){
                const xhrStatus = new XMLHttpRequest();
                xhrStatus.open("GET", '/status?' + params, true);
                xhrStatus.send();
                xhrStatus.onload = function () {
                    localStorage.setItem("combat_id", JSON.parse(xhrStatus.responseText).combat.id)
                    if(JSON.parse(xhrStatus.responseText).combat.status === 'progress') {
                        //document.location.href = 'http://localhost:3333/mainPage.html';
                        hide.classList.remove("hide");
                        findOponentButton.classList.add("hide");
                        clearInterval(timer);
                    }
                }
            }, 1500)
        }

        if(JSON.parse(xhr.responseText).combat.status === 'progress') {
            localStorage.setItem("combat_id", JSON.parse(xhr.responseText).combat.id);
            //document.location.href = 'http://localhost:3333/mainPage.html';
            hide.classList.remove("hide");
            findOponentButton.classList.add("hide");
        }
    }
});

const turnButton = document.querySelector('.turnButton');
const progressEnemy =  document.querySelector('.progressEnemy .progress-bar-fill');
const progressHero = document.querySelector('.progressHero .progress-bar-fill');

turnButton.addEventListener('click', function(e) {
    e.preventDefault();

    let atackRadio = document.querySelector('input[name=attack]:checked');
    let defenseRadio = document.querySelector('input[name=protection]:checked');
    let makeTurn = false;
    let resultLength, battleIndex, heroIndex, enemyIndex;

    // Первый запрос, который отправляет удар и блок
    let xhr = new XMLHttpRequest();
    let body = 'token=' + localStorage.getItem('token') +
    '&combat_id=' + localStorage.getItem('combat_id') +
    '&turn={"hit":"' + atackRadio.value + 
    '", "blocks":"'+ defenseRadio.value + '"}';

    xhr.open("POST", '/turn', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);

    xhr.onload = function() {

        let parseTurnQuery = JSON.parse(xhr.response);
        resultLength = parseTurnQuery.combat.results.length;
        
        makeTurn = parseTurnQuery.combat.turn_status || false;

        // Если игрок атакует вторым, то благодаря turn_status мы можем 
        // сразу обновить хпшки и не делать то что дальше
        
        if(makeTurn === true) {
            heroHealth = parseTurnQuery.combat.you.health / 30 * 100 + '%';
            enemyHealth = parseTurnQuery.combat.enemy.health / 30 * 100 + '%';

            progressHero.style.width = heroHealth;
            progressEnemy.style.width = enemyHealth;
            return;
        }

        // Если игрок атакует первым, то нужно ждать, пока походит второй игрок, а затем обновить хп
        // Постоянно проверяем combats.json на добавление новых ходов в массив turn, если добавил,
        // то обновляем хпшки и чистим таймер

        let timer = setInterval( function() {

            let curentResultLength, heroHealth, enemyHealth, currentToken;
            let xhrDatabase = new XMLHttpRequest();
            xhrDatabase.open("GET", '/json/combats.json');
            xhrDatabase.send();

            xhrDatabase.onload = function() {

                parseDatabase = JSON.parse(xhrDatabase.response);
                battleIndex = findButtleIndex(parseDatabase, localStorage.getItem('combat_id'));
                console.log(battleIndex);
                currentToken = parseDatabase[battleIndex].players[0].token;
                curentResultLength = parseDatabase[battleIndex].turns.length;

                if(currentToken === localStorage.getItem('token')) {
                    heroIndex = 0;
                    enemyIndex = 1;
                }

                else {
                    heroIndex = 1;
                    enemyIndex = 0;
                }

                heroHealth = parseDatabase[battleIndex].
                players[heroIndex].health / 30 * 100 + '%';
                enemyHealth = parseDatabase[battleIndex].
                players[enemyIndex].health / 30 * 100 + '%';
                makeTurn = parseTurnQuery.combat.turn_status || false;
            
                if(makeTurn === true || resultLength + 2 == curentResultLength) {
                    clearInterval(timer);
                }

                progressHero.style.width = heroHealth;
                progressEnemy.style.width = enemyHealth;
            }
        }, 2000);
    }   
});

function findButtleIndex(battlesArray, currentId) {
    let index;
    battlesArray.forEach((element, i) => {
        if(element.id === currentId) {
            index = i;
        }
    });
    return index;
};

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

const buttonSubmit = document.querySelector('.submit input');
const nameField = document.querySelector('input.login');
const passwordField = document.querySelector('input.pass');
const formReg = document.querySelector('.formReg');

formReg.addEventListener('submit', function(e) { 
  e.preventDefault(); 
  var xhr = new XMLHttpRequest();
  var body = 'username=' + nameField.value +
    '&password=' + passwordField.value;
  xhr.open("POST", '/register', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(body);
  xhr.onload = function() {
    document.location.href = 'http://localhost:3333/auth.html';
  };
});