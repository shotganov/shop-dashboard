const Customers = require("../models/customers");

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validate(body) {
  const { name, city, registered_on, rating, founded_year } = body;
  if (typeof name !== "string" || !name.trim()) return "Укажите название";
  if (typeof city !== "string" || !city.trim()) return "Укажите город";
  if (
    typeof registered_on !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(registered_on)
  ) {
    return "Дата регистрации должна быть в формате ГГГГ-ММ-ДД";
  }
  if (typeof rating !== "number" || rating < 1 || rating > 5)
    return "Рейтинг должен быть от 1 до 5";
  if (
    !Number.isInteger(founded_year) ||
    founded_year < 1900 ||
    founded_year > new Date().getFullYear()
  ) {
    return "Некорректный год основания";
  }
  return null;
}

async function list(req, res, next) {
  try {
    const offset = Number(req.query.offset ?? 0);
    const limit = Number(req.query.limit ?? 50);
    if (
      !Number.isInteger(offset) ||
      offset < 0 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      res.status(400).json({ message: "Некорректные offset/limit" });
      return;
    }
    res.json(await Customers.findPage(offset, limit));
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ message: "Некорректный id" });
      return;
    }
    const customer = await Customers.findById(id);
    if (!customer) {
      res.status(404).json({ message: "Клиент не найден" });
      return;
    }
    res.json(customer);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const error = validate(req.body ?? {});
    if (error) {
      res.status(400).json({ message: error });
      return;
    }
    const { name, city, registered_on, rating, founded_year } = req.body;
    const customer = await Customers.create({
      name,
      city,
      registered_on,
      rating,
      founded_year,
    });
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ message: "Некорректный id" });
      return;
    }
    const error = validate(req.body ?? {});
    if (error) {
      res.status(400).json({ message: error });
      return;
    }
    const { name, city, registered_on, rating, founded_year } = req.body;
    const customer = await Customers.update(id, {
      name,
      city,
      registered_on,
      rating,
      founded_year,
    });
    if (!customer) {
      res.status(404).json({ message: "Клиент не найден" });
      return;
    }
    res.json(customer);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ message: "Некорректный id" });
      return;
    }
    if (!(await Customers.remove(id))) {
      res.status(404).json({ message: "Клиент не найден" });
      return;
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
