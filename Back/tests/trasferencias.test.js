const request = require('supertest');
const app = require('../src/server.js');

describe('3. Realização de Transferências', () => {
    
    it('T5 - Transferência realizada com sucesso (Simulado)', async () => {
        // Nota para a faculdade: Esse teste requer que a conta tenha saldo. 
        // Como a conta teste começa com 0, o ideal é injetar saldo direto no banco antes.
        // Aqui verificamos se a estrutura da requisição funciona.
        const res = await request(app)
            .post('/api/transacoes/transferir')
            .send({
                conta_origem: 1, // ID do Guilherme ADM que tem dinheiro
                cpf_destino: '11122233399',
                valor: 1,
                descricao: 'Teste Jest'
            });
        
        expect(res.statusCode).toBe(200);
        expect(res.body.mensagem).toMatch(/sucesso/i);
    });

    it('T6 - Transferência com saldo insuficiente', async () => {
        // Pega a conta teste que criamos (que tem R$ 0,00) e tenta transferir 1 milhão
        const res = await request(app)
            .post('/api/transacoes/transferir')
            .send({
                conta_origem: 999, // ID da conta sem saldo
                cpf_destino: '13880251916',
                valor: 1000000,
                descricao: 'Tentativa falha'
            });
        
        expect(res.statusCode).not.toBe(200);
        expect(res.body.erro).toMatch(/saldo insuficiente/i);
    });
});