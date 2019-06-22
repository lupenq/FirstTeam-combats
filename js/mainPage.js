const turnButton = document.querySelector('.turnButton');
const progressEnemy =  document.querySelector('.progressEnemy .progress-bar-fill');
const progressHero = document.querySelector('.progressHero .progress-bar-fill');

const heroName = document.querySelector('.hero-name');
const heroHpValue = document.querySelector('.progressHero .hp-value');
const enemyHpValue = document.querySelector('.progressEnemy .hp-value');

document.addEventListener("DOMContentLoaded", ready);

function ready() {
    let xhrGetName = new XMLHttpRequest();

    xhrGetName.open('GET', '/whoami' + '?token=' + localStorage.getItem('token'));
    xhrGetName.send();
    xhrGetName.onload = function() {
        heroName.innerHTML = JSON.parse(xhrGetName.responseText).user.username;
    }
    progressEnemy.parentElement.classList.add('hide');

    heroHpValue.innerHTML = '30/30';
    enemyHpValue.innerHTML = '30/30';
    heroHpValue.style.position = 'absolute';
}

const logsOfFight = document.querySelector('.fightLogs');
let i = 0;

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

        if(resultLength !== 0){
            logsOfFight.innerHTML += `<li class="log">${parseTurnQuery.combat.results[0][i].origin.username} нанес удар 
            ${parseTurnQuery.combat.results[0][i].target.username} на ${parseTurnQuery.combat.results[0][i].hit} hp</li>` ;
            i++;
        }
        
        makeTurn = parseTurnQuery.combat.turn_status || false;

        // Если игрок атакует вторым, то благодаря turn_status мы можем 
        // сразу обновить хпшки и не делать то что дальше
        
        if(makeTurn === true) {
            heroHealth = parseTurnQuery.combat.you.health / 30 * 100 + '%';
            enemyHealth = parseTurnQuery.combat.enemy.health / 30 * 100 + '%';
            progressHero.style.width = heroHealth;
            progressEnemy.style.width = enemyHealth;
            heroHpValue.innerHTML = parseTurnQuery.combat.you.health + '/30';
            enemyHpValue.innerHTML = parseTurnQuery.combat.enemy.health + '/30';

            console.log(parseTurnQuery.combat.status);

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
                heroHpValue.innerHTML = parseDatabase[battleIndex].players[heroIndex].health + '/30';
                enemyHpValue.innerHTML = parseDatabase[battleIndex].players[enemyIndex].health + '/30';

                progressHero.style.width = heroHealth;
                progressEnemy.style.width = enemyHealth;


                if(parseDatabase[battleIndex].status === 'finished') {
                    let enemyHP = parseDatabase[battleIndex].players[enemyIndex].health;
                    let heroHP = parseDatabase[battleIndex].players[heroIndex].health;
                    if(enemyHP <= 0 && heroHP > 0) {
                        fight_logs.innerHTML += 
                        `<li>Победа! ${heroName.innerText} одолел ${enemyName.innerHTML} c
                        ${heroHP} hp</li>`;
                    }
                    else if (enemyHP > 0 && heroHP <= 0) {
                        fight_logs.innerHTML +=
                        `<li>Поражение! ${enemyName.innerHTML} одолел ${heroName.innerText} c
                        ${enemyHP} hp</li>`;
                    }
                    else {
                        fight_logs.innerHTML += '<li>Ничья!</li>';
                    }
                    clearInterval(timer);
                }
                
                if(makeTurn === true || resultLength + 2 == curentResultLength) {
                    clearInterval(timer);
                }
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
