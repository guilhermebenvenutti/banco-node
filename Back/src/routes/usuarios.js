const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();

// Cadastro de usuário
router.post('/register', async (req, res) => {
  const { nome, cpf, senha } = req.body;

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nome, cpf, senha) VALUES ($1, $2, $3) RETURNING id, nome, cpf',
      [nome, cpf, hashedSenha]
    );

    res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') { // unique violation (cpf duplicado)
      return res.status(400).json({ erro: 'CPF já cadastrado' });
    }
    res.status(500).json({ erro: err.message });
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

    // Aqui você pode retornar um token JWT no futuro
    res.json({
      mensagem: 'Login realizado com sucesso',
      usuario: { id: usuario.id, nome: usuario.nome, cpf: usuario.cpf }
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;