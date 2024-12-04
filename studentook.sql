Create database STUDENTOOK;


CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

ALTER TABLE usuarios
ADD COLUMN resetPasswordToken VARCHAR(255),
ADD COLUMN resetPasswordExpires BIGINT;

CREATE TABLE livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    pdf VARCHAR(255),
    categoria ENUM('school', 'others') NOT NULL
);



CREATE TABLE pontos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    pontos INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE pontos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    pontos INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
);


ALTER TABLE usuarios ADD pontos INT DEFAULT 0;

CREATE TABLE atividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pergunta TEXT NOT NULL,
    opcao_a VARCHAR(255),
    opcao_b VARCHAR(255),
    opcao_c VARCHAR(255),
    opcao_d VARCHAR(255),
    opcao_e VARCHAR(255),
    resposta_correta CHAR(1) NOT NULL
);


CREATE TABLE respostas_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    atividade_id INT NOT NULL,
    resposta_enviada CHAR(1) NOT NULL,
    pontos INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES usuarios(id),
    FOREIGN KEY (atividade_id) REFERENCES atividades(id)
);

select*from pontos;
select*from atividades;
select*from respostas_usuario;

INSERT INTO atividades (pergunta, opcao_a, opcao_b, opcao_c, opcao_d, opcao_e, resposta_correta) 
VALUES (
    'Observe os conjuntos a seguir e marque a alternativa correta. A = {x|x é um múltiplo positivo de 4} B = {x|x é um número par e 4 menor ou igual a x menor que 16}', 
    '145 pertence A', 
    '26 pertence A e B', 
    '11 pertence B', 
    '12 pertence A e B', 
    '12 pertence A', 
    'D'
);

INSERT INTO atividades (pergunta, opcao_a, opcao_b, opcao_c, opcao_d, opcao_e, resposta_correta) 
VALUES (
    '(Enem/2017) Durante o Estado Novo, os encarregados da propaganda procuraram aperfeiçoar-se na arte da empolgação e envolvimento das “multidões” através das mensagens políticas. Nesse tipo de discurso, o significado das palavras importa pouco, pois, como declarou Goebbels, “não falamos para dizer alguma coisa, mas para obter determinado efeito”. CAPELATO, M. H. Propaganda política e controle dos meios de comunicação. In: PANDOLFI, D. (Org.). Repensando o Estado Novo. Rio de Janeiro: FGV, 1999.  O controle sobre os meios de comunicação foi uma marca do Estado Novo, sendo fundamental à propaganda política, na medida em que visava', 
    'conquistar o apoio popular na legitimação do novo governo.', 
    'ampliar o envolvimento das multidões nas decisões políticas.', 
    'aumentar a oferta de informações públicas para a sociedade civil.', 
    'estender a participação democrática dos meios de comunicação no Brasil.', 
    'alargar o entendimento da população sobre as intenções do novo governo.', 
    'A'
);

INSERT INTO atividades (pergunta, opcao_a, opcao_b, opcao_c, opcao_d, opcao_e, resposta_correta) 
VALUES (
    '(IFPE) Assinale a alternativa correta sobre os níveis de organização ecológica dos seres vivos.', 
    'Nicho ecológico é o local onde podemos encontrar uma determinada espécie.', 
    'Populações são grupos de organismos de uma mesma espécie.', 
    'Habitat é o conjunto de atividades desempenhadas por um ser vivo em um determinado ecossistema.', 
    'As comunidades consistem no conjunto de fatores bióticos e abióticos em um determinado espaço físico.', 
    'Ecossistemas são agrupamentos de seres vivos que desempenham uma mesma função em seu habitat.', 
    'B'
);

INSERT INTO atividades (pergunta, opcao_a, opcao_b, opcao_c, opcao_d, opcao_e, resposta_correta) 
VALUES (
    '(Enem 2020) Hino à Bandeira Em teu seio formoso retratas Este céu de puríssimo azul, A verdura sem par destas matas, E o esplendor do Cruzeiro do Sul.  Contemplando o teu vulto sagrado,  Compreendemos o nosso dever,  E o Brasil por seus filhos amado,  Poderoso e feliz há de ser! Sobre a imensa Nação Brasileira,  Nos momentos de festa ou de dor, Paira sempre sagrada bandeira Pavilhão da justiça e do amor!  BILAC, O.; BRAGA, F. Disponível em: www2.planalto.gov.br. Acesso em: 10 dez. 2017 (fragmento).  No Hino à Bandeira, a descrição é um recurso utilizado para exaltar o símbolo nacional na medida em que', 
    'remete a um momento futuro.', 
    'promove a união dos cidadãos.', 
    'valoriza os seus elementos.', 
    'emprega termos religiosos.', 
    'recorre à sua história.', 
    'C'
);
SELECT * FROM pontos WHERE user_id = 1;


select*from pontos;
select*from atividades;
select*from respostas_usuario;
select*from usuarios;

delete from respostas_usuario where user_id = 1;

show tables ;

drop table atividades;

describe pontos;
describe respostas_usuario;

drop table pontos;
drop table respostas_usuario;

delete from respostas_usuario where user_id = 6;



