
document.querySelector(".login-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Credenciais corretas
    const usuarioCorreto = "admin";
    const senhaCorreta = "Poli@2025";

    // Captura os valores inseridos
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Verifica credenciais
    if (username === usuarioCorreto && password === senhaCorreta) {
        window.location.href = "Admin_options.html"; // Redireciona para o link desejado
    } else {
        alert("Usuário ou senha incorretos. Tente novamente!");
    }
});

