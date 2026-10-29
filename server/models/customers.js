const db = require("../db");

async function findPage(offset, limit) {
  const rows = await db.any(
    "SELECT * FROM customers ORDER BY id LIMIT $1 OFFSET $2",
    [limit, offset],
  );
  const { total } = await db.one(
    "SELECT count(*)::int AS total FROM customers",
  );
  return { rows, total };
}

function findById(id) {
  return db.oneOrNone("SELECT * FROM customers WHERE id = $1", [id]);
}

function create(data) {
  return db.one(
    `INSERT INTO customers (name, city, registered_on, rating, founded_year)
     VALUES ($<name>, $<city>, $<registered_on>, $<rating>, $<founded_year>)
     RETURNING *`,
    data,
  );
}

function update(id, data) {
  return db.oneOrNone(
    `UPDATE customers
     SET name = $<name>, city = $<city>, registered_on = $<registered_on>,
         rating = $<rating>, founded_year = $<founded_year>
     WHERE id = $<id>
     RETURNING *`,
    { ...data, id },
  );
}

async function remove(id) {
  const result = await db.result("DELETE FROM customers WHERE id = $1", [id]);
  return result.rowCount > 0;
}

module.exports = { findPage, findById, create, update, remove };
