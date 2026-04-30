document.getElementById('transferenciaForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const contaDestino = document.getElementById('contaDestino').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const descricao = document.getElementById('descricao').value;
    const mensagem = document.getElementById('mensagem');

    if (!contaDestino || !valor || valor <= 0) {
        mensagem.textContent = 'Preencha todos os campos corretamente';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/transacoes/transferir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conta_origem: 1,        // Vamos melhorar isso depois
                conta_destino: parseInt(contaDestino),
                valor: valor,
                descricao: descricao || 'Transferência'
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Transferência realizada com sucesso!');
            window.location.href = '../dashboard.html';
        } else {
            mensagem.textContent = data.erro || 'Erro ao realizar transferência';
        }
    } catch (error) {
        mensagem.textContent = 'Erro de conexão com o servidor';
    }
});