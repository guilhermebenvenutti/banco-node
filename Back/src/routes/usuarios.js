const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();

// Cadastro de usuário e criação de conta automática
router.post('/register', async (req, res) => {
  const { nome, cpf, senha } = req.body;
  const client = await pool.connect(); // Puxamos o client para fazer uma Transação segura

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    await client.query('BEGIN'); // Inicia a transação

    // 1. Cria o usuário
    const resultUser = await client.query(
      'INSERT INTO usuarios (nome, cpf, senha) VALUES ($1, $2, $3) RETURNING id, nome, cpf',
      [nome, cpf, hashedSenha]
    );
    
    const novoUsuario = resultUser.rows[0];

    // 2. Cria a conta bancária zerada para esse usuário
    await client.query(
      'INSERT INTO contas (usuario_id, saldo) VALUES ($1, $2)',
      [novoUsuario.id, 0.00]
    );

    await client.query('COMMIT'); // Se tudo deu certo, salva no banco!

    res.status(201).json({ mensagem: 'Usuário e conta criados com sucesso', usuario: novoUsuario });
  } catch (err) {
    await client.query('ROLLBACK'); // Se der erro em qualquer passo, desfaz tudo
    console.error("### ERRO REAL DO BANCO ###", err);
    
    if (err.code === '23505') { // unique violation (cpf duplicado)
      return res.status(400).json({ erro: 'CPF já cadastrado' });
    }
    res.status(500).json({ erro: err.message });
  } finally {
    client.release();
  }
});

// Login
router.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE cpf = $1', [cpf]);

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'CPF ou senha inválidos' });
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'CPF ou senha inválidos' });
    }

    res.json({
      mensagem: 'Login realizado com sucesso',
      usuario: { id: usuario.id, nome: usuario.nome, cpf: usuario.cpf }
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;