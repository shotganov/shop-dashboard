const db = require("../db");

function findAll(customerId) {
  return db.any(
    "SELECT * FROM orders WHERE $1::int IS NULL OR customer_id = $1 ORDER BY order_date DESC, id DESC",
    [customerId ?? null],
  );
}

function findById(id) {
  return db.oneOrNone("SELECT * FROM orders WHERE id = $1", [id]);
}

function create(data) {
  return db.one(
    `INSERT INTO orders (customer_id, product, quantity, price, order_date)
     VALUES ($<customer_id>, $<product>, $<quantity>, $<price>, $<order_date>)
     RETURNING *`,
    data,
  );
}

function update(id, data) {
  return db.oneOrNone(
    `UPDATE orders
     SET customer_id = $<customer_id>, product = $<product>, quantity = $<quantity>,
         price = $<price>, order_date = $<order_date>
     WHERE id = $<id>
     RETURNING *`,
    { ...data, id },
  );
}

async function remove(id) {
  const result = await db.result("DELETE FROM orders WHERE id = $1", [id]);
  return result.rowCount > 0;
}

module.exports = { findAll, findById, create, update, remove };
