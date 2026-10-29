# Shop Dashboard

Тестовое задание: Postgres + Node.js (Express, pg-promise) + React (AG Grid).

БД `shop` содержит две таблицы: `customers` (клиенты) и `orders` (заказы, связаны с клиентами по `customer_id`).
Таблица клиентов загружается частями (AG Grid Infinite Row Model, `LIMIT`/`OFFSET` на сервере).
При выборе клиента ниже показываются его заказы, их можно добавлять, изменять и удалять.

Интерфейс собран на основе [Material Tailwind Dashboard React](https://github.com/creativetimofficial/material-tailwind-dashboard-react)
от Creative Tim (лицензия MIT).

## Запуск через Docker

```
docker compose up -d --build
```

Открыть http://localhost:8080 (API — http://localhost:5000/api). База создаётся из `init-db.sql` при первом запуске.
Остановить: `docker compose down` (данные БД при этом сбрасываются к исходным).

## Запуск без Docker

Требования: Node.js 20.19+ или 22.12+, PostgreSQL 13+.

1. Создать БД и заполнить данными (скрипт удалит БД `shop`, если она уже есть):

   ```
   psql -U postgres -f init-db.sql
   ```

   Скрипт рассчитан на `psql`: для подключения к созданной БД в нём используется команда `\c`.

2. Сервер:

   ```
   cd server
   cp .env.example .env    # указать параметры подключения к Postgres
   npm install
   npm run dev
   ```

   API будет доступно на http://localhost:5000/api. Без автоперезапуска при изменениях: `npm start`.

3. Клиент (в отдельном терминале):

   ```
   cd client
   npm install
   npm run dev
   ```

   Открыть http://localhost:5173. Если сервер запущен не на `localhost:5000`, задайте адрес API
   в переменной `VITE_API_URL` (например, в `client/.env`: `VITE_API_URL=http://localhost:5000/api`).

## API

| Метод  | URL                                    | Описание                         |
|--------|----------------------------------------|----------------------------------|
| GET    | /api/customers?offset=0&limit=50       | клиенты постранично + `total`    |
| GET    | /api/customers/:id                     | клиент                           |
| POST   | /api/customers                         | создать клиента                  |
| PUT    | /api/customers/:id                     | изменить клиента                 |
| DELETE | /api/customers/:id                     | удалить клиента (вместе с заказами) |
| GET    | /api/orders?customerId=1               | заказы (все или одного клиента)  |
| GET    | /api/orders/:id                        | заказ                            |
| POST   | /api/orders                            | создать заказ                    |
| PUT    | /api/orders/:id                        | изменить заказ                   |
| DELETE | /api/orders/:id                        | удалить заказ                    |
