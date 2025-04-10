exports.checkCsrfToken = (err, req, res, next) => {
    if (err && err.code === 'EBADCSRFTOKEN') {
      // Verifica se é uma requisição AJAX ou JSON
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(403).json({ error: 'Token CSRF inválido' });
      }
  
      // Caso não seja requisição JSON/AJAX, renderiza a página de erro
      return res.status(403).render('404', { mensagem: 'Token CSRF inválido' });
    }
  
    // Se não for erro CSRF, passa para o próximo middleware
    return next(err);
  };
  