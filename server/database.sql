CREATE DATABASE tododb;

CREATE TABLE todoitems (
    id VARCHAR PRIMARY KEY,
    todo_item VARCHAR(255),
     is_completed BOOLEAN,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, 
    email VARCHAR(255) UNIQUE NOT NULL,  
    pass TEXT NOT NULL
);
ALTER TABLE users
ADD COLUMN first_name VARCHAR(255),
ADD COLUMN last_name VARCHAR(255);


CREATE TABLE usersAlternate (
    row_id SERIAL PRIMARY KEY,
    alternate_user_id VARCHAR(255),
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
);



INSERT INTO users (email, pass)
VALUES 
('omran.jamal@gmail.com', 'omranpassword'),
('shafin.ashraf@gmail.com', 'shafinpassword'),
('mominul.rasel@gmail.com', 'mominulpassword'),
('hasin.anjum@gmail.com', 'hasinpassword'),
('fariha.tasneem@gmail.com', 'farihapassword'),
('pantho.haque@gmail.com', 'panthopassword'),
('mahedi.shawon@gmail.com', 'shawonpassword');






DELETE FROM todo WHERE id = '123934rye4578';
INSERT INTO todo (id, todo_item, is_completed) VALUES ('abc123783874283', 'Learn PostgreSQL', false);

 