const API_URL = 'http://52.15.204.177:3000/api';

// ====================== LOGIN ======================
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cpf = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value;
    const mensagem = document.getElementById('mensagem');

    try {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, senha })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            window.location.href = 'dashboard.html';
        } else {
            mensagem.textContent = data.erro || 'CPF ou senha inválidos';
        }
    } catch (error) {
        mensagem.textContent = 'Erro de conexão com o servidor';
    }
});

// ====================== CADASTRO ======================
document.getElementById('cadastroForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value;
    const mensagem = document.getElementById('mensagem');

    try {
        const response = await fetch(`${API_URL}/usuarios/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, cpf, senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Cadastro realizado com sucesso! Faça login.');
            window.location.href = 'index.html';
        } else {
            mensagem.textContent = data.erro || 'Erro ao cadastrar';
        }
    } catch (error) {
        mensagem.textContent = 'Erro de conexão com o servidor';
    }
});
