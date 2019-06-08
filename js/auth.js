  const buttonSubmit = document.querySelector('.submit input');
  const nameField = document.querySelector('input.login');
  const passwordField = document.querySelector('input.pass');
  const formLog = document.querySelector('.formLog');

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
        document.location.href = 'http://localhost:3333/fight.html';
    };
    
  });