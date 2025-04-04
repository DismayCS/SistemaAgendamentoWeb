const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    Usuario.autenticar(email, senha, (err, results) => {
        if (err) return res.status(500).send('Erro no banco de dados');
        if (results.length > 0) {
            req.session.usuario = results[0];
            return res.redirect('/principal');
        }
        return res.status(400).send('Credenciais inválidas');
    });
});

router.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

router.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;

    Usuario.verificarEmail(email, (err, results) => {
        if (err) return res.status(500).send('Erro no banco de dados');

        if (results.length > 0) {
            return res.status(400).send('Email já registrado');
        }

        Usuario.criar(nome, email, senha, (err, results) => {
            if (err) return res.status(500).send('Erro ao criar conta');
            res.redirect('/login');
        });
    });
});



module.exports = router;
