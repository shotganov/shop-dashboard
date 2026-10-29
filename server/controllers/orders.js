const Orders = require("../models/orders");

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validate(body) {
  const { customer_id, product, quantity, price, order_date } = body;
  if (!Number.isInteger(customer_id)) return "Не указан клиент";
  if (typeof product !== "string" || !product.trim()) return "Укажите товар";
  if (!Number.isInteger(quantity) || quantity < 1) {
    return "Количество должно быть целым числом больше нуля";
  }
  if (typeof price !== "number" || price < 0) return "Некорректная цена";
  if (
    typeof order_date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(order_date)
  ) {
    return "Дата заказа должна быть в формате ГГГГ-ММ-ДД";
  }
  return null;
}

async function list(req, res, next) {
  try {
    let customerId;
    if (req.query.customerId !== undefined) {
      customerId = parseId(req.query.customerId);
      if (!customerId) {
        res.status(400).json({ message: "Некорректный customerId" });
        return;
      }
    }
    res.json(await Orders.findAll(customerId));
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
    const order = await Orders.findById(id);
    if (!order) {
      res.status(404).json({ message: "Заказ не найден" });
      return;
    }
    res.json(order);
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
    const { customer_id, product, quantity, price, order_date } = req.body;
    const order = await Orders.create({
      customer_id,
      product,
      quantity,
      price,
      order_date,
    });
    res.status(201).json(order);
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
    const { customer_id, product, quantity, price, order_date } = req.body;
    const order = await Orders.update(id, {
      customer_id,
      product,
      quantity,
      price,
      order_date,
    });
    if (!order) {
      res.status(404).json({ message: "Заказ не найден" });
      return;
    }
    res.json(order);
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
    if (!(await Orders.remove(id))) {
      res.status(404).json({ message: "Заказ не найден" });
      return;
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
