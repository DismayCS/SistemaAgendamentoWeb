const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config(); // Para ler as variáveis do arquivo .env

// Inicializando o aplicativo Express
const app = express();

// Configuração do servidor para usar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para analisar os dados do corpo da requisição (POST)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuração de sessões para o login
app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo_do_sistema', // Usando variável de ambiente
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Define cookies seguros para produção
}));

// Importando as rotas
const authRoute = require('./routes/auth');
const serviceRoutes = require('./routes/service');
const clientRoutes = require('./routes/client');
const agendamentoRoutes = require('./routes/agendamentos');

// Usando as rotas
app.use('/', authRoute);  // Rota de login e cadastro
app.use('/servicos', serviceRoutes);  // Rota de serviços
app.use('/clientes', clientRoutes);  // Rota de clientes
app.use('/agendamentos', agendamentoRoutes);  // Rota de agendamentos

// Rota para página inicial (caso queira)
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Middleware de erro (captura erros não tratados)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado! Tente novamente mais tarde.' });
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
