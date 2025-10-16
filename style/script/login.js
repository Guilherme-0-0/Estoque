// Usuário e senha corretos
const USUARIO_CORRETO = "admin";
const SENHA_CORRETA = "admin";

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // evita reload da página

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if(username === USUARIO_CORRETO && password === SENHA_CORRETA){
    // login certo, redireciona para inicio.html
    window.location.href = "templates\\inicio.html";
  } else {
    // login errado, mostra mensagem de erro
    errorMsg.style.display = "block";
  }
});
