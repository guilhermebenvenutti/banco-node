// Usando o IP da AWS
const API_URL = 'http://52.15.204.177:3000/api';

document.getElementById('transferenciaForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Pega a conta de origem real que salvamos no Dashboard!
    const contaOrigem = localStorage.getItem('conta_id');
    
    if (!contaOrigem) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = 'index.html';
        return;
    }

    const contaDestino = document.getElementById('contaDestino').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const descricao = document.getElementById('descricao').value;
    const mensagem = document.getElementById('mensagem');

    if (!contaDestino || !valor || valor <= 0) {
        mensagem.textContent = 'Preencha todos os campos corretamente';
        return;
    }

    // Trava de segurança extra no Frontend
    if (contaOrigem == contaDestino) {
        mensagem.textContent = 'Você não pode transferir dinheiro para si mesmo';
        return;
    }

    try {
        // 2. Agora aponta para a API correta na nuvem
        const response = await fetch(`${API_URL}/transacoes/transferir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conta_origem: parseInt(contaOrigem),
                conta_destino: parseInt(contaDestino),
                valor: valor,
                descricao: descricao || 'Transferência via App'
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Transferência realizada com sucesso!');
            window.location.href = 'dashboard.html';
        } else {
            mensagem.textContent = data.erro || 'Erro ao realizar transferência';
        }
    } catch (error) {
        mensagem.textContent = 'Erro de conexão com o servidor';
    }
});