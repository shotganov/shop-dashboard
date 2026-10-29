function notFound(req, res) {
  res.status(404).json({ message: "Не найдено" });
}

function errorHandler(err, req, res, next) {
  // 23503 - нарушение внешнего ключа, остальные 22xxx/23xxx - некорректные данные
  if (err.code === "23503") {
    res.status(400).json({ message: "Связанная запись не найдена" });
    return;
  }
  if (
    typeof err.code === "string" &&
    (err.code.startsWith("22") || err.code.startsWith("23"))
  ) {
    res.status(400).json({ message: "Некорректные данные" });
    return;
  }
  if (err instanceof SyntaxError) {
    res.status(400).json({ message: "Некорректный JSON" });
    return;
  }
  // остальные ошибки express.json(): слишком большое тело (413), неверная кодировка (415)
  if (err.status && err.status < 500) {
    res.status(err.status).json({ message: "Некорректный запрос" });
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Внутренняя ошибка сервера" });
}

module.exports = { notFound, errorHandler };
