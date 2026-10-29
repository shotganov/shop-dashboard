const { Router } = require("express");
const orders = require("../controllers/orders");

const router = Router();

router.get("/", orders.list);
router.get("/:id", orders.getOne);
router.post("/", orders.create);
router.put("/:id", orders.update);
router.delete("/:id", orders.remove);

module.exports = router;
