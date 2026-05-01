const API_URL = 'http://52.15.204.177:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('nomeUsuario').textContent = usuario.nome || 'Usuário';
    
    // Inicia a busca dos dados reais no banco
    carregarDadosBancarios(usuario.id);
});

async function carregarDadosBancarios(usuarioId) {
    try {
        // 1. Busca a conta e o saldo usando o ID do usuário
        const responseConta = await fetch(`${API_URL}/contas/usuario/${usuarioId}`);
        if (!responseConta.ok) throw new Error('Conta não encontrada');
        
        const conta = await responseConta.json();
        
        // Formata o saldo para Reais (ex: R$ 1.500,00)
        const saldoFormatado = parseFloat(conta.saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('saldo').textContent = saldoFormatado;

        // SALVA O ID DA CONTA (Vamos precisar muito disso para a tela de transferência!)
        localStorage.setItem('conta_id', conta.id);

        // 2. Busca o histórico usando o ID da conta
        carregarHistorico(conta.id);

    } catch (error) {
        console.error(error);
        document.getElementById('saldo').textContent = 'Erro ao carregar';
    }
}

async function carregarHistorico(contaId) {
    const historicoDiv = document.getElementById('historico');
    historicoDiv.innerHTML = '<p>Carregando histórico...</p>';

    try {
        const response = await fetch(`${API_URL}/transacoes/historico/${contaId}`);
        const transacoes = await response.json();

        if (transacoes.length === 0) {
            historicoDiv.innerHTML = '<p style="color: #ccc;">Nenhuma transação encontrada.</p>';
            return;
        }

        // Monta a lista de histórico dinamicamente
        historicoDiv.innerHTML = transacoes.map(t => {
            const isOrigem = (t.conta_origem == contaId);
            const tipoTexto = isOrigem ? 'Saiu:' : 'Entrou:';
            const cor = isOrigem ? '#ff5252' : '#00c853'; // Vermelho se saiu, Verde se entrou
            
            const dataFormatada = new Date(t.data).toLocaleDateString('pt-BR');
            const valorFormatado = parseFloat(t.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            return `<p>
                      <strong style="color: ${cor}">${tipoTexto}</strong> 
                      ${t.descricao || t.tipo} - ${valorFormatado} 
                      <span style="font-size: 0.8em; color: #aaa; float: right;">${dataFormatada}</span>
                    </p>`;
        }).join('');

    } catch (error) {
        historicoDiv.innerHTML = '<p class="error">Erro ao carregar histórico.</p>';
    }
}

// Função de logout 
function logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('conta_id'); // Limpa a conta também
    window.location.href = 'index.html';
}