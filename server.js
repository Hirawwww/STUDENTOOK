const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');




const app = express();
const port = 3000;






// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Configurar o body-parser para processar requisições JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// Gerar um token
const token = crypto.randomBytes(20).toString('hex');


// Decodificar um token
const decodedToken = decodeURIComponent(token);




// Configurar o multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// Conectar ao banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'STUDENTOOK'
});


db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});


// Servir arquivos estáticos da pasta public
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));


// Rota para servir a tela de início (HTML)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// Rota para a próxima tela (HTML)
app.get('/next', (req, res) => {
    res.sendFile(__dirname + '/tela_2.html');
});


// Rota para servir a tela de cadastro (HTML)
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/registrar.html');
});


// Rota para servir a tela de recuperação de senha (HTML)
app.get('/recover', (req, res) => {
    res.sendFile(__dirname + '/recuperar_senha.html');
});


// Rota para servir a tela de sucesso de login (HTML)
app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/success.html');
});


// Rota para servir a tela do menu (HTML)
app.get('/menu', (req, res) => {
    res.sendFile(__dirname + '/menu.html');
});


// Rota para obter livros por categoria
app.get('/api/books', (req, res) => {
    const category = req.params.category;
    const query = 'SELECT titulo FROM livros WHERE categoria = ?';


    db.query(query, [category], (err, results) => {
        if (err) {
            console.error('Erro ao obter livros:', err);
            res.status(500).send('Erro ao obter livros');
            return;
        }
        res.json(results);
    });
});


// Rota para processar o login
app.post('/login', (req, res) => {
    const { username, password } = req.body;


    const query = 'SELECT * FROM usuarios WHERE nome = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            res.status(500).send('Erro ao consultar o banco de dados');
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.senha, (err, result) => {
                if (result) {
                    res.redirect('/menu');
                } else {
                    res.send('Nome de usuário ou senha incorretos');
                }
            });
        } else {
            // Se o usuário não existe, insira-o no banco de dados
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.error('Erro ao criptografar a senha:', err);
                    res.status(500).send('Erro ao criptografar a senha');
                    return;
                }
                const insertQuery = 'INSERT INTO usuarios (nome, senha, email) VALUES (?, ?, ?)';
                db.query(insertQuery, [username, hash, 'email@example.com'], (err, results) => {
                    if (err) {
                        console.error('Erro ao realizar o cadastro:', err);
                        res.status(500).send('Erro ao realizar o cadastro');
                        return;
                    }
                    res.redirect('/menu');
                });
            });
        }
    });
});


// Rota para processar o cadastro de novos usuários
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;


    const query = 'SELECT * FROM usuarios WHERE nome = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Erro ao realizar o cadastro:', err);
            res.status(500).send('Erro ao realizar o cadastro');
            return;
        }
        if (results.length > 0) {
            res.send('Nome de usuário já existe');
        } else {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.error('Erro ao criptografar a senha:', err);
                    res.status(500).send('Erro ao criptografar a senha');
                    return;
                }
                const insertQuery = 'INSERT INTO usuarios (nome, senha, email) VALUES (?, ?, ?)';
                db.query(insertQuery, [username, hash, email], (err, results) => {
                    if (err) {
                        console.error('Erro ao realizar o cadastro:', err);
                        res.status(500).send('Erro ao realizar o cadastro');
                        return;
                    }
                    res.send('Usuário registrado com sucesso');
                });
            });
        }
    });
});




// Rota para servir o arquivo HTML
app.get('/books', (req, res) => {
    res.sendFile(path.join(__dirname, 'livros.html'));
});





// Configuração do Nodemailer para enviar emails
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true, // true for 465, false for other ports
    port: 465,
    auth: {
      user: 'studentookcedup@gmail.com',
      pass: 'djsw jbui mkjn wraz',
    },
  });


// Rota para solicitar recuperação de senha
app.post('/recover', (req, res) => {
    const { email } = req.body;


    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Erro ao requisitar recuperação de senha:', err);
            res.status(500).send('Erro ao requisitar recuperação de senha');
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            const token = crypto.randomBytes(20).toString('hex');


            const expireTime = Date.now() + 3600000; // 1 hora


            const updateQuery = 'UPDATE usuarios SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?';
            db.query(updateQuery, [token, expireTime, email], (err, results) => {
                if (err) {
                    console.error('Erro ao atualizar token no banco de dados:', err);
                    res.status(500).send('Erro ao atualizar token no banco de dados');
                    return;
                }


                const mailOptions = {
                    to: email,
                    from: 'studentookcedup@gmail.com',
                    subject: 'Recuperação de Senha',
                    text: `Você está recebendo isso porque você (ou alguém mais) solicitou a recuperação da senha da sua conta.\n\n` +
                          `Clique no link a seguir, ou copie e cole no seu navegador para completar o processo:\n\n` +
                          `http://${req.headers.host}/reset/${token}\n\n` +
                          `Se você não solicitou isso, por favor, ignore este email e sua senha permanecerá inalterada.\n`
                };


                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        console.error('Erro ao enviar email:', err);
                        res.status(500).send('Erro ao enviar email');
                        return;
                    }
                    res.send('Um email foi enviado para ' + email + ' com mais instruções.');
                });
            });
        } else {
            res.send('Nenhuma conta com esse email foi encontrada.');
        }
    });
});








// Rota para atualizar a senha no banco de dados
app.post('/reset/:token', (req, res) => {
    const { token } = req.params;
    const { password } = req.body;


    const query = 'SELECT * FROM usuarios WHERE resetPasswordToken = ? AND resetPasswordExpires > ?';
    db.query(query, [token, Date.now()], (err, results) => {
        if (err) {
            console.error('Erro ao redefinir senha:', err);
            res.status(500).send('Erro ao redefinir senha');
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            const saltRounds = 10;


            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.error('Erro ao criptografar a senha:', err);
                    res.status(500).send('Erro ao criptografar a senha');
                    return;
                }


                const updateQuery = 'UPDATE usuarios SET senha = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE email = ?';
                db.query(updateQuery, [hash, user.email], (err, results) => {
                    if (err) {
                        console.error('Erro ao atualizar a senha no banco de dados:', err);
                        res.status(500).send('Erro ao atualizar a senha no banco de dados');
                        return;
                    }
                    res.send('Senha atualizada com sucesso!');
                });
            });
        } else {
            res.send('Token de recuperação de senha é inválido ou expirou.');
        }
    });
});


// Rota para resetar a senha usando o token
app.get('/reset/:token', (req, res) => {
    const { token } = req.params;

    console.log('Procurando a view resetar_senha no diretório de views');

    const query = 'SELECT * FROM usuarios WHERE resetPasswordToken = ? AND resetPasswordExpires > ?';
    db.query(query, [token, Date.now()], (err, results) => {
        if (err) {
            console.error('Erro ao redefinir senha:', err);
            res.status(500).send('Erro ao redefinir senha');
            return;
        }
        if (results.length > 0) {
            console.log('Token válido. Renderizando view resetar_senha.');
            res.render('resetar_senha', { token });
        } else {
            res.send('Token de recuperação de senha é inválido ou expirou.');
        }
    });
});

// Rota para obter o link do PDF de um livro pelo título
app.get('/api/book-link', (req, res) => {
    const titulo = req.query.titulo;
    const query = 'SELECT pdf FROM livros WHERE titulo = ?';

    db.query(query, [titulo], (err, results) => {
        if (err) {
            console.error('Erro ao obter link do livro:', err);
            res.status(500).send('Erro ao obter link do livro');
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Livro não encontrado');
        }
    });
});

// Rota pras atividade
app.get('/activities', (req, res) => {
    res.sendFile(path.join(__dirname, '/atividades.html'));
});
// Rota pras atividade
app.get('/conjuntos', (req, res) => {
    res.sendFile(path.join(__dirname, '/Conjuntos.html'));
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});



