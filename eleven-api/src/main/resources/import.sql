-- Inserir dados na tabela tb_user
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Rebekah Olivia', 'rebekah@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Miriã Aquino', 'miria@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Julio Coutinho', 'julio@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 1, NOW(), NOW());
INSERT INTO tb_user (name, email, password, active, created_at, updated_at) VALUES ('Priscila Coutinho', 'priscila@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 0, NOW(), NOW());

-- Inserir dados na tabela tb_role
INSERT INTO tb_role (authority) VALUES ('ROLE_OPERATOR');
INSERT INTO tb_role (authority) VALUES ('ROLE_ADMIN');

-- Inserir dados na tabela tb_user_role
INSERT INTO tb_user_role (user_id, role_id) VALUES (1, 1); -- Rebekah Coutinho como OPERATOR
INSERT INTO tb_user_role (user_id, role_id) VALUES (2, 2); -- Miria Coutinho como OPERATOR
INSERT INTO tb_user_role (user_id, role_id) VALUES (3, 2); -- Julio Coutinho como OPERATOR
INSERT INTO tb_user_role (user_id, role_id) VALUES (4, 1); -- Priscila Coutinho como OPERATOR

-- Inserir dados na tabela tb_user_profile
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('123.456.789-00', '1990-05-15', '(14) 99999-9999', 'Ana Silva', 'José Silva', 1);    -- Perfil para Alex Brown
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('987.654.321-00', '1985-10-25', '(14) 98888-8888', 'Clara Green', 'Pedro Green', 2); -- Perfil para Maria Green
INSERT INTO tb_user_profile (cpf, birth_date, phone, mother_name, father_name, user_id) VALUES ('456.789.123-00', '1995-03-10', '(14) 97777-7777', 'Fernanda Coutinho', 'Paulo Coutinho', 3); -- Perfil para Julio Coutinho
    
-- Inserir dados na tabela address
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('12345-678', 'Rua 1', 'São Paulo', '123', 'Apto 101', 'Centro', 'SP', 1);  -- Endereço para Alex Brown
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('12345-678', 'Rua 2', 'São Paulo', '1234', 'Apto 102', 'Centro', 'SP', 2); -- Endereço para Maria Green
INSERT INTO tb_address (zip_code, street, city, number, complement, district, uf, user_profile_id) VALUES ('17012-345', 'Rua das Flores', 'Bauru', '456', 'Casa 2', 'Jardim América', 'SP', 3); -- Endereço para Julio Coutinho
    
