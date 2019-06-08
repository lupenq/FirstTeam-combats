const buttonSubmit = document.querySelector('.submit input');
const nameField = document.querySelector('input.login');
const passwordField = document.querySelector('input.pass');
const formReg = document.querySelector('.formReg');

formReg.addEventListener('submit', function(e) { 
  e.preventDefault(); 
  var xhr = new XMLHttpRequest();
  var body = 'username=' + nameField.value +
    '&password=' + passwordField.value;
  if(!(nameField.value)==="" && !(passwordField.value)===""){
    xhr.open("POST", '/register', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);
    xhr.onload = function () {
        document.location.href = 'http://localhost:3333/auth.html';
    };
  }
});