import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
  Alert,
} from "@material-tailwind/react";

export function OrderDialog({ order, customer, onSave, onClose }) {
  const [form, setForm] = React.useState({
    product: order ? order.product : "",
    quantity: order ? String(order.quantity) : "1",
    price: order ? String(order.price) : "",
    order_date: order ? order.order_date : "",
  });
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        customer_id: customer.id,
        product: form.product.trim(),
        quantity: Number(form.quantity),
        price: Number(form.price),
        order_date: form.order_date,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Dialog open handler={onClose} size="sm">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          {order ? `Заказ №${order.id}` : "Новый заказ"}
        </DialogHeader>
        <DialogBody className="flex flex-col gap-6">
          {error && <Alert color="red">{error}</Alert>}
          <Typography variant="small" color="blue-gray" className="font-normal">
            Клиент: <span className="font-semibold">{customer.name}</span>
          </Typography>
          <Input
            label="Товар"
            name="product"
            value={form.product}
            onChange={handleChange}
            maxLength={100}
            required
          />
          <Input
            label="Количество"
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min={1}
            step={1}
            required
          />
          <Input
            label="Цена, ₽"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min={0}
            step={0.01}
            required
          />
          <Input
            label="Дата заказа"
            type="date"
            name="order_date"
            value={form.order_date}
            onChange={handleChange}
            required
          />
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="text" color="blue-gray" onClick={onClose}>
            Отмена
          </Button>
          <Button
            variant="gradient"
            color="gray"
            type="submit"
            disabled={saving}
          >
            Сохранить
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

OrderDialog.propTypes = {
  order: PropTypes.object,
  customer: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

OrderDialog.displayName = "/src/widgets/dialogs/order-dialog.jsx";

export default OrderDialog;
