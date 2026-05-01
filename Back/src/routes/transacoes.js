const express = require('express');
const pool = require('../db');
const router = express.Router();

// Transferência entre contas
router.post('/transferir', async (req, res) => {
  const { conta_origem, conta_destino, valor } = req.body;

  if (valor <= 0) return res.status(400).json({ erro: 'Valor deve ser maior que zero' });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verifica saldo suficiente
    const saldoResult = await client.query('SELECT saldo FROM contas WHERE id = $1', [conta_origem]);
    if (saldoResult.rows.length === 0 || saldoResult.rows[0].saldo < valor) {
      await client.query('ROLLBACK');
      return res.status(400).json({ erro: 'Saldo insuficiente' });
    }

    // Debitar da origem
    await client.query('UPDATE contas SET saldo = saldo - $1 WHERE id = $2', [valor, conta_origem]);

    // Creditar no destino
    await client.query('UPDATE contas SET saldo = saldo + $1 WHERE id = $2', [valor, conta_destino]);

    // Registrar transação
    await client.query(
      'INSERT INTO transacoes (conta_origem, conta_destino, valor) VALUES ($1, $2, $3)',
      [conta_origem, conta_destino, valor]
    );

    await client.query('COMMIT');
    res.json({ mensagem: 'Transferência realizada com sucesso' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ erro: err.message });
  } finally {
    client.release();
  }
});


// Ver histórico de transações de uma conta
router.get('/historico/:conta_id', async (req, res) => {
  const { conta_id } = req.params;
  try {
    // Busca transações onde a conta enviou OU recebeu dinheiro, ordenado da mais nova para a mais velha
    const result = await pool.query(`
      SELECT * FROM transacoes 
      WHERE conta_origem = $1 OR conta_destino = $1 
      ORDER BY data DESC LIMIT 10
    `, [conta_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;