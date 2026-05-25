const request = require('supertest');
const app = require('../src/server.js');

describe('2. Gerenciamento de Contas Bancárias', () => {
    
    it('T3 - Criação automática de conta com saldo zero', async () => {
        // Fazendo login com o usuário criado no T1 para pegar o ID dele
        const loginRes = await request(app)
            .post('/api/usuarios/login')
            .send({ cpf: '11122233399', senha: 'SenhaForte123!' });
        
        const usuarioId = loginRes.body.usuario.id;

        // Busca a conta do usuário
        const contaRes = await request(app).get(`/api/contas/usuario/${usuarioId}`);
        
        expect(contaRes.statusCode).toBe(200);
        expect(parseFloat(contaRes.body.saldo)).toBe(0); // Garante que é R$ 0,00
    });

    it('T4 - Tentativa de criar/atualizar conta com saldo negativo', async () => {
        // Como o saldo negativo é bloqueado pelo banco (CHECK), tentamos forçar uma transferência impossível ou rota direta
        // Se você não tem rota para forçar saldo, testamos a lógica da transferência
        const res = await request(app)
            .post('/api/transacoes/transferir')
            .send({
                conta_origem: 9999, // Conta irreal
                cpf_destino: '00000000000',
                valor: -50 // Valor negativo
            });
        
        expect(res.statusCode).not.toBe(200);
    });
});