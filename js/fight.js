const findOponentButton = document.querySelector('.findOponent');
const hide = document.querySelector('.hide');
const fight_logs = document.querySelector('.fight-logs');
const enemyName = document.querySelector('.enemy-name');
const fightLogs = document.querySelector('.fightLogs');

findOponentButton.addEventListener('click', function() {
    const xhr = new XMLHttpRequest();
    
    const body = 'token=' + localStorage.getItem('token');
    xhr.open("POST", '/fight', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);

    xhr.onload = function() {

        if(JSON.parse(xhr.responseText).combat.status === 'pending') {

            fightLogs.innerHTML = '<li class="log">Ожидание противника</li>';

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
                        progressEnemy.parentElement.classList.remove('hide');
                        fight_logs.innerHTML += '<li>Противник найден!</li>';
                        clearInterval(timer);
                        enemyName.innerHTML = JSON.parse(xhrStatus.responseText).combat.enemy.username;
                    }
                }
            }, 1500)
        }

        if(JSON.parse(xhr.responseText).combat.status === 'progress') {
            localStorage.setItem("combat_id", JSON.parse(xhr.responseText).combat.id);
            //document.location.href = 'http://localhost:3333/mainPage.html';
            enemyName.innerHTML = JSON.parse(xhr.responseText).combat.players[0].username;
            hide.classList.remove("hide");
            findOponentButton.classList.add("hide");
            progressEnemy.parentElement.classList.remove('hide');
        }
    }
});
