DROP DATABASE IF EXISTS shop;
CREATE DATABASE shop;

\c shop
SET client_encoding = 'UTF8';

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  registered_on DATE NOT NULL,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
  founded_year INTEGER NOT NULL CHECK (founded_year >= 1900)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  product VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  order_date DATE NOT NULL
);

CREATE INDEX orders_customer_id_idx ON orders (customer_id);

INSERT INTO customers (name, city, registered_on, rating, founded_year)
SELECT
  (ARRAY['Альфа', 'Вектор', 'Гранит', 'Дельта', 'Зенит', 'Орион', 'Сигма', 'Титан', 'Феникс', 'Эталон'])[1 + i % 10]
    || (ARRAY['Трейд', 'Строй', 'Сервис', 'Логистик', 'Маркет', 'Тех', 'Пром'])[1 + i % 7],
  (ARRAY['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 'Екатеринбург', 'Самара'])[1 + i % 6],
  DATE '2020-01-01' + (i * 5),
  (ARRAY[4.8, 4.2, 3.9, 4.5, 3.6, 4.9, 4.1, 4.7])[1 + i % 8],
  1992 + i * 11 % 28
FROM generate_series(1, 300) AS i;

INSERT INTO orders (customer_id, product, quantity, price, order_date)
SELECT
  c.id,
  (ARRAY['Ноутбук', 'Монитор', 'Клавиатура', 'Мышь', 'Принтер', 'Наушники', 'Веб-камера'])[1 + (c.id + n) % 7],
  1 + (c.id * n) % 5,
  (ARRAY[54990, 18990, 2490, 1290, 15990, 6990, 3490])[1 + (c.id + n) % 7],
  c.registered_on + n * 30
FROM customers c
CROSS JOIN generate_series(1, 1 + c.id % 3) AS n;
