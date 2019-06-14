const findOponentButton = document.querySelector('.findOponent');
const hide = document.querySelector('.hide');
const fight_logs = document.querySelector('.fight-logs');

findOponentButton.addEventListener('click', function() {
    var xhr = new XMLHttpRequest();
    
    var body = 'token=' + localStorage.getItem('token');
    xhr.open("POST", '/fight', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);

    xhr.onload = function() {

        if(JSON.parse(xhr.responseText).combat.status === 'pending') {

            fight_logs.innerHTML = '<li>Ожидание противника</li>';

            const params =  'token=' + localStorage.getItem('token') +
            '&combat_id=' + JSON.parse(xhr.responseText).combat.id;

            setInterval(function(){
                let xhrStatus = new XMLHttpRequest();
                xhrStatus.open("GET", '/status?' + params, true);
                xhrStatus.send();
                xhrStatus.onload = function () {
                    localStorage.setItem("combat_id", JSON.parse(xhrStatus.responseText).combat.id)
                    if(JSON.parse(xhrStatus.responseText).combat.status === 'progress') {
                        //document.location.href = 'http://localhost:3333/mainPage.html';
                        hide.classList.remove("hide");
                        findOponentButton.classList.add("hide");
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
