-- Inserir dados na tabela tb_user
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Rebekah Olivia', 'rebekah@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Miriã Aquino', 'miria@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Julio Coutinho', 'julio@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Priscila Coutinho', 'priscila@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 0, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Carlos Santos', 'carlos@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Ana Beatriz', 'ana@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Lucas Oliveira', 'lucas@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Mariana Costa', 'mariana@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Pedro Souza', 'pedro@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Fernanda Lima', 'fernanda@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 0, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Roberto Alves', 'roberto@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Camila Pereira', 'camila@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());

-- Inserir dados na tabela tb_role
INSERT INTO tb_role (authority) VALUES ('ROLE_OPERATOR');
INSERT INTO tb_role (authority) VALUES ('ROLE_ADMIN');

-- Inserir dados na tabela tb_user_role
INSERT INTO tb_user_role (user_id, role_id) VALUES (1, 1); -- Rebekah Coutinho como OPERATOR
INSERT INTO tb_user_role (user_id, role_id) VALUES (2, 2); -- Miria Coutinho como OPERATOR
INSERT INTO tb_user_role (user_id, role_id) VALUES (3, 2); -- Julio Coutinho como OPERATOR
INSERT INTO tb_user_role (user_id, role_id) VALUES (4, 1); -- Priscila Coutinho como OPERATOR
INSERT INTO tb_user_role (user_id, role_id) VALUES (5, 1); -- Carlos Santos como OPERATOR
INSERT INTO tb_user_role (user_id, role_id) VALUES (6, 1); -- Ana Beatriz como OPERATOR
INSERT INTO tb_user_role (user_id, role_id) VALUES (7, 2); -- Lucas Oliveira como ADMIN
INSERT INTO tb_user_role (user_id, role_id) VALUES (8, 1); -- Mariana Costa como OPERATOR
INSERT INTO tb_user_role (user_id, role_id) VALUES (9, 2); -- Pedro Souza como ADMIN
INSERT INTO tb_user_role (user_id, role_id) VALUES (10, 1); -- Fernanda Lima como OPERATOR
INSERT INTO tb_user_role (user_id, role_id) VALUES (11, 2); -- Roberto Alves como ADMIN
INSERT INTO tb_user_role (user_id, role_id) VALUES (12, 1); -- Camila Pereira como OPERATOR

-- Inserir dados na tabela tb_user_profile
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('123.456.789-00', '1990-05-15', '(14) 99999-9999', 'Ana Silva', 'José Silva', 1);    -- Perfil para Rebekah Olivia
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('987.654.321-00', '1985-10-25', '(14) 98888-8888', 'Clara Green', 'Pedro Green', 2); -- Perfil para Miriã Aquino
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('456.789.123-00', '1995-03-10', '(14) 97777-7777', 'Fernanda Coutinho', 'Paulo Coutinho', 3); -- Perfil para Julio Coutinho
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('111.222.333-44', '1988-07-20', '(14) 96666-6666', 'Marina Santos', 'João Santos', 4); -- Perfil para Priscila Coutinho
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('222.333.444-55', '1992-11-05', '(11) 95555-5555', 'Lucia Santos', 'Roberto Santos', 5); -- Perfil para Carlos Santos
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('333.444.555-66', '1980-02-15', '(11) 94444-4444', 'Marta Beatriz', 'Antônio Beatriz', 6); -- Perfil para Ana Beatriz
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('444.555.666-77', '1993-09-28', '(21) 93333-3333', 'Regina Oliveira', 'Carlos Oliveira', 7); -- Perfil para Lucas Oliveira
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('555.666.777-88', '1987-06-12', '(21) 92222-2222', 'Laura Costa', 'Marcos Costa', 8); -- Perfil para Mariana Costa
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('666.777.888-99', '1991-04-30', '(19) 91111-1111', 'Teresa Souza', 'Ricardo Souza', 9); -- Perfil para Pedro Souza
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('777.888.999-00', '1983-12-08', '(19) 90000-0000', 'Julia Lima', 'André Lima', 10); -- Perfil para Fernanda Lima
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('888.999.000-11', '1978-08-18', '(31) 99999-0000', 'Cristina Alves', 'Paulo Alves', 11); -- Perfil para Roberto Alves
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('999.000.111-22', '1996-01-25', '(31) 98888-0000', 'Sandra Pereira', 'Fernando Pereira', 12); -- Perfil para Camila Pereira
    
-- Inserir dados na tabela address
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('12345-678', 'Rua 1', 'São Paulo', '123', 'Apto 101', 'Centro', 'SP', 1);  -- Endereço para Rebekah Olivia
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('12345-678', 'Rua 2', 'São Paulo', '1234', 'Apto 102', 'Centro', 'SP', 2); -- Endereço para Miriã Aquino
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('17012-345', 'Rua das Flores', 'Bauru', '456', 'Casa 2', 'Jardim América', 'SP', 3); -- Endereço para Julio Coutinho
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('17012-346', 'Rua dos Lírios', 'Bauru', '789', 'Casa 3', 'Jardim Europa', 'SP', 4); -- Endereço para Priscila Coutinho
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('01234-567', 'Avenida Paulista', 'São Paulo', '1000', 'Apto 501', 'Bela Vista', 'SP', 5); -- Endereço para Carlos Santos
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('01234-568', 'Rua Augusta', 'São Paulo', '500', 'Apto 303', 'Consolação', 'SP', 6); -- Endereço para Ana Beatriz
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('20000-001', 'Avenida Atlântica', 'Rio de Janeiro', '2000', 'Apto 1001', 'Copacabana', 'RJ', 7); -- Endereço para Lucas Oliveira
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('20000-002', 'Rua Barata Ribeiro', 'Rio de Janeiro', '300', 'Apto 804', 'Copacabana', 'RJ', 8); -- Endereço para Mariana Costa
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('13000-001', 'Avenida Norte Sul', 'Campinas', '1500', 'Casa 5', 'Cambuí', 'SP', 9); -- Endereço para Pedro Souza
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('13000-002', 'Rua Carlos Gomes', 'Campinas', '400', 'Apto 205', 'Cambuí', 'SP', 10); -- Endereço para Fernanda Lima
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('30000-001', 'Avenida Afonso Pena', 'Belo Horizonte', '2500', 'Apto 1202', 'Centro', 'MG', 11); -- Endereço para Roberto Alves
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('30000-002', 'Rua da Bahia', 'Belo Horizonte', '800', 'Sala 301', 'Centro', 'MG', 12); -- Endereço para Camila Pereira
    
