const { Router } = require("express");
const customers = require("../controllers/customers");

const router = Router();

router.get("/", customers.list);
router.get("/:id", customers.getOne);
router.post("/", customers.create);
router.put("/:id", customers.update);
router.delete("/:id", customers.remove);

module.exports = router;
