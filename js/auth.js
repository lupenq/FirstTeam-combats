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