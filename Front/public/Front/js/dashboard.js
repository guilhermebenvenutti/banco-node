// Carrega dados do usuário logado
document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('nomeUsuario').textContent = usuario.nome || 'Usuário';
    
    carregarSaldo();
    carregarHistorico();
});

async function carregarSaldo() {
    // Por enquanto vamos simular o saldo (depois podemos melhorar com rota real)
    document.getElementById('saldo').textContent = 'R$ 1.250,75';
}

async function carregarHistorico() {
    const historicoDiv = document.getElementById('historico');
    historicoDiv.innerHTML = `
        <p><strong>Transferência enviada</strong> - R$ 150,00 - 01/04/2026</p>
        <p><strong>Transferência recebida</strong> - R$ 500,00 - 31/03/2026</p>
        <p><strong>Depósito</strong> - R$ 300,00 - 30/03/2026</p>
    `;
}

// Função de logout (usada no dashboard)
function logout() {
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
}
