import {
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { Customers, Placeholder } from "@/pages/dashboard";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <UsersIcon {...icon} />,
        name: "клиенты",
        path: "/customers",
        element: <Customers />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "товары",
        path: "/products",
        element: <Placeholder />,
      },
      {
        icon: <ChartBarIcon {...icon} />,
        name: "отчёты",
        path: "/reports",
        element: <Placeholder />,
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "настройки",
        path: "/settings",
        element: <Placeholder />,
      },
    ],
  },
];

export default routes;
