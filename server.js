//variaveis
require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const flashMsg = require('connect-flash');
const port = 3000;
const routes = require('./routes');
const path = require('path');
const {checkCsrfToken, csrfTokenMiddleware} = require('./src/middlewares/middleware');
const helmet = require('helmet');
const csrf = require('csurf');

//----------------------//

app.use(helmet());
//permite enviar formularios pra dentro da aplicação.
app.use(express.urlencoded({extended: true}));
//permite receber json para dentro da aplicação
app.use(express.json());
//settando conteudos estaticos.
app.use(express.static(path.resolve(__dirname,"public")));
app.use('/assets',express.static(path.resolve(__dirname,"frontend/assets")));

//----------------------//

//configurando session cookie's
const sessionConfig = session({
    secret:'ninguem sabe oque esta aqui!!',
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionConfig);
app.use(flashMsg());

//----------------------//

//configurando views e engine.
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs')

//----------------------//

//rotas
app.use(routes);
//middlewares
app.use(csrf());
app.use(checkCsrfToken);
app.use((err, req, res, next) => checkCsrfToken(err, req, res, next));


//----------------------//

//conexão de escuta do servidor
app.on('pronto', () => {app.listen(port, () => {console.log(`servidor rodando na porta: ${port}`)});})
app.emit('pronto');