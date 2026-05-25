const request = require('supertest');
const app = require('../src/server.js'); // Ajuste o caminho se sua pasta tests estiver em outro lugar

describe('1. Gerenciamento de Usuários', () => {
    const usuarioTeste = {
        nome: 'Usuario Teste Jest',
        cpf: '11122233399',
        senha: 'SenhaForte123!'
    };

    it('T1 - Cadastro de usuário com sucesso', async () => {
        const res = await request(app)
            .post('/api/usuarios/register')
            .send(usuarioTeste);
        
        // Se a rota existir e der certo, o professor pediu status 201
        expect(res.statusCode).toBe(201); 
        expect(res.body).toHaveProperty('mensagem');
    });

    it('T2 - Tentativa de cadastro com CPF duplicado', async () => {
        // Tenta cadastrar o mesmo de novo
        const res = await request(app)
            .post('/api/usuarios/register')
            .send(usuarioTeste);
        
        // Deve dar erro (ex: 400 ou 500 dependendo de como você tratou)
        expect(res.statusCode).not.toBe(201);
        expect(res.body.erro).toMatch(/já cadastrado|duplicado|existe/i);
    });
});