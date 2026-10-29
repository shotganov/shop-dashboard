import React from "react";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Alert,
} from "@material-tailwind/react";
import { OrderDialog } from "@/widgets/dialogs";
import {
  createOrder,
  deleteOrder,
  getCustomers,
  getOrders,
  updateOrder,
} from "@/api";

const theme = themeQuartz.withParams({
  fontFamily: "Roboto, sans-serif",
  fontSize: 14,
  foregroundColor: "#455a64",
  accentColor: "#212121",
  wrapperBorder: false,
  headerBackgroundColor: "#fff",
  headerTextColor: "#78909c",
  headerFontSize: 11,
  headerFontWeight: 700,
  headerColumnResizeHandleColor: "transparent",
  rowBorder: { color: "#eceff1" },
  headerRowBorder: { color: "#eceff1" },
  selectedRowBackgroundColor: "#eceff1",
});

const localeText = { loadingOoo: "Загрузка...", noRowsToShow: "Нет данных" };

const formatDate = (value) =>
  value ? value.split("-").reverse().join(".") : "";
const formatNumber = (value, digits) =>
  value === undefined
    ? ""
    : value.toLocaleString("ru-RU", { minimumFractionDigits: digits });

const customerColumns = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "name", headerName: "Название", flex: 1, minWidth: 160 },
  { field: "city", headerName: "Город", flex: 1, minWidth: 160 },
  {
    field: "registered_on",
    headerName: "Дата регистрации",
    valueFormatter: (p) => formatDate(p.value),
  },
  {
    field: "rating",
    headerName: "Рейтинг",
    type: "rightAligned",
    width: 130,
    valueFormatter: (p) => formatNumber(p.value, 1),
  },
  {
    field: "founded_year",
    headerName: "Год основания",
    type: "rightAligned",
    width: 170,
  },
];

const orderColumns = [
  { field: "id", headerName: "№", width: 80 },
  { field: "product", headerName: "Товар", flex: 1, minWidth: 160 },
  { field: "quantity", headerName: "Кол-во", type: "rightAligned", width: 110 },
  {
    field: "price",
    headerName: "Цена, ₽",
    type: "rightAligned",
    valueFormatter: (p) => formatNumber(p.value, 2),
  },
  {
    headerName: "Сумма, ₽",
    type: "rightAligned",
    valueGetter: (p) => (p.data ? p.data.price * p.data.quantity : undefined),
    valueFormatter: (p) => formatNumber(p.value, 2),
  },
  {
    field: "order_date",
    headerName: "Дата",
    valueFormatter: (p) => formatDate(p.value),
  },
];

export function Customers() {
  const [customer, setCustomer] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [dialog, setDialog] = React.useState(null);
  const [error, setError] = React.useState("");

  const datasource = React.useMemo(
    () => ({
      getRows: async (params) => {
        try {
          const { rows, total } = await getCustomers(
            params.startRow,
            params.endRow - params.startRow,
          );
          params.successCallback(rows, total);
        } catch (err) {
          params.failCallback();
          setError(err.message);
        }
      },
    }),
    [],
  );

  React.useEffect(() => {
    if (!customer) return;
    let ignore = false;
    getOrders(customer.id)
      .then((data) => {
        if (!ignore) setOrders(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      });
    return () => {
      ignore = true;
    };
  }, [customer]);

  const selectCustomer = (next) => {
    setCustomer(next ?? null);
    setOrders([]);
    setSelectedOrder(null);
  };

  const saveOrder = async (data) => {
    if (dialog === "edit") {
      const updated = await updateOrder(selectedOrder.id, data);
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
      setSelectedOrder(updated);
    } else {
      const created = await createOrder(data);
      setOrders([created, ...orders]);
    }
    setDialog(null);
  };

  const removeOrder = async () => {
    if (!window.confirm(`Удалить заказ №${selectedOrder.id}?`)) return;
    try {
      await deleteOrder(selectedOrder.id);
      setOrders(orders.filter((o) => o.id !== selectedOrder.id));
      setSelectedOrder(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mb-8 mt-12 flex flex-col gap-12">
      <Alert color="red" open={!!error} onClose={() => setError("")}>
        {error}
      </Alert>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Клиенты
          </Typography>
        </CardHeader>
        <CardBody className="h-[420px] px-0 pb-2 pt-0">
          <AgGridReact
            theme={theme}
            localeText={localeText}
            columnDefs={customerColumns}
            defaultColDef={{ sortable: false }}
            rowModelType="infinite"
            datasource={datasource}
            cacheBlockSize={50}
            getRowId={(p) => String(p.data.id)}
            suppressCellFocus
            rowSelection={{
              mode: "singleRow",
              checkboxes: false,
              enableClickSelection: true,
            }}
            onSelectionChanged={(e) =>
              selectCustomer(e.api.getSelectedRows()[0])
            }
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6">
          <Typography variant="h6" color="white">
            Заказы{customer && `: ${customer.name}`}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pb-2 pt-0">
          <div className="flex flex-wrap gap-2 px-6 pb-4">
            <Button
              color="green"
              disabled={!customer}
              onClick={() => setDialog("add")}
            >
              Добавить запись
            </Button>
            <Button
              color="blue"
              disabled={!selectedOrder}
              onClick={() => setDialog("edit")}
            >
              Изменить
            </Button>
            <Button color="red" disabled={!selectedOrder} onClick={removeOrder}>
              Удалить
            </Button>
          </div>
          <div className="h-[320px]">
            <AgGridReact
              theme={theme}
              localeText={localeText}
              overlayNoRowsTemplate={
                customer ? "Нет заказов" : "Выберите клиента в таблице выше"
              }
              columnDefs={orderColumns}
              rowData={orders}
              getRowId={(p) => String(p.data.id)}
              suppressCellFocus
              rowSelection={{
                mode: "singleRow",
                checkboxes: false,
                enableClickSelection: true,
              }}
              onSelectionChanged={(e) =>
                setSelectedOrder(e.api.getSelectedRows()[0] ?? null)
              }
            />
          </div>
        </CardBody>
      </Card>
      {dialog && customer && (
        <OrderDialog
          order={dialog === "edit" ? selectedOrder : null}
          customer={customer}
          onSave={saveOrder}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}

Customers.displayName = "/src/pages/dashboard/customers.jsx";

export default Customers;
