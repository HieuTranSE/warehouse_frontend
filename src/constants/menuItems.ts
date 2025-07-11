import { AccountRole } from "@/utils/enums";
import { ROUTES } from "./routes";
import {
  AiOutlineHome,
  AiOutlineImport,
  AiOutlineExport,
  AiOutlineInbox,
  AiOutlineSetting,
  AiOutlineHistory,
  AiOutlineCompass
} from "react-icons/ai";
import { MenuItem } from "@/utils/interfaces";

type RoleMenuConfig = {
  [K in AccountRole]?: MenuItem[];
};

// Base menu items that are common across roles
const baseMenuItems: MenuItem[] = [
  {
    key: "overview",
    icon: AiOutlineHome,
    label: "Tổng quan",
    path: ROUTES.PROTECTED.OVERVIEW,
  },
];

// Import related menu items
const importMenuItems: MenuItem[] = [
  {
    key: "import",
    icon: AiOutlineImport,
    label: "Quản lý nhập kho",
    path: "",
    children: [
      {
        key: "import-request",
        label: "Danh sách phiếu nhập",
        path: ROUTES.PROTECTED.IMPORT.REQUEST.LIST,
      },
      {
        key: "import-order",
        label: "Danh sách đơn nhập",
        path: ROUTES.PROTECTED.IMPORT.ORDER.LIST,
      }
    ],
  },
];

// Export related menu items
const exportMenuItems: MenuItem[] = [
  {
    key: "export",
    icon: AiOutlineExport,
    label: "Quản lý xuất kho",
    path: "",
    children: [
      {
        key: "export-request",
        label: "Danh sách phiếu xuất",
        path: ROUTES.PROTECTED.EXPORT.REQUEST.LIST,
      },
    ],
  },
];

// Item management menu items
const itemMenuItems: MenuItem[] = [
  {
    key: "items",
    icon: AiOutlineInbox,
    label: "Quản lý vật phẩm",
    path: ROUTES.PROTECTED.ITEM.LIST,
  },
  {
    key: "inventory-items",
    icon: AiOutlineInbox,
    label: "Quản lý hàng tồn kho",
    path: ROUTES.PROTECTED.INVENTORY_ITEM.LIST,
    children: [
      {
        key: "warehouse-section",
        icon: AiOutlineCompass,
        label: "Sơ đồ kho",
        path: ROUTES.PROTECTED.INVENTORY_ITEM.WAREHOUSE_SECTION,
      },
    ],
  },
];

// Configuration menu items
const configurationMenuItems: MenuItem[] = [
  {
    key: "configuration",
    icon: AiOutlineSetting,
    label: "Cấu hình",
    path: ROUTES.PROTECTED.CONFIGURATION.LIST,
  },
];

// Transaction Log menu items
const transactionLogMenuItems: MenuItem[] = [
  {
    key: "transaction-logs",
    icon: AiOutlineHistory,
    label: "Quản lý lịch sử xuất nhập",
    path: "",
    children: [
      {
        key: "import-history",
        label: "Lịch sử phiếu nhập",
        path: ROUTES.PROTECTED.TRANSACTION_LOGS.IMPORT,
      },
      {
        key: "export-history",
        label: "Lịch sử phiếu xuất",
        path: ROUTES.PROTECTED.TRANSACTION_LOGS.EXPORT,
      },
    ],
  },
];


// Role-based menu configuration
export const menuItems: RoleMenuConfig = {

  [AccountRole.DEPARTMENT]: [
    ...baseMenuItems,
    ...importMenuItems,
    ...exportMenuItems,
    ...transactionLogMenuItems,
    {
      key: "inventory-items",
      icon: AiOutlineInbox,
      label: "Quản lý hàng tồn kho",
      path: ROUTES.PROTECTED.INVENTORY_ITEM.LIST,
      children: [
        {
          key: "warehouse-section",
          icon: AiOutlineCompass,
          label: "Sơ đồ kho",
          path: ROUTES.PROTECTED.INVENTORY_ITEM.WAREHOUSE_SECTION,
        },
      ],
    },
  ],

  [AccountRole.STAFF]: [

  ],

  [AccountRole.WAREHOUSE_MANAGER]: [
    ...baseMenuItems,
    {
      key: "import",
      icon: AiOutlineImport,
      label: "Quản lý nhập kho",
      path: "",
      children: [
        {
          key: "import-order",
          label: "Danh sách đơn nhập",
          path: ROUTES.PROTECTED.IMPORT.ORDER.LIST,
        }
      ],
    },
    ...exportMenuItems,
    {
      key: "inventory-items",
      icon: AiOutlineInbox,
      label: "Quản lý hàng tồn kho",
      path: ROUTES.PROTECTED.INVENTORY_ITEM.LIST,
      children: [
        {
          key: "warehouse-section",
          icon: AiOutlineCompass,
          label: "Sơ đồ kho",
          path: ROUTES.PROTECTED.INVENTORY_ITEM.WAREHOUSE_SECTION,
        },
      ],
    },
  ],

  [AccountRole.ACCOUNTING]: [
    ...baseMenuItems,
  ],

  [AccountRole.ADMIN]: [
    ...baseMenuItems,
    ...configurationMenuItems
  ],
};