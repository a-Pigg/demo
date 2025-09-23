// 资产管理
const AssetMange = () => import("@/views/AssetMange");
const List = () => import("@/views/AssetMange/List");
const Received = () => import("@/views/AssetMange/Received");
const Using = () => import("@/views/AssetMange/Using");
const Revert = () => import("@/views/AssetMange/Revert");
// const BorrowAndReturn = () => import("@/views/AssetMange/BorrowAndReturn");
const Borrow = () => import("@/views/AssetMange/Borrow");
const Return = () => import("@/views/AssetMange/Return");
const Allocation = () => import("@/views/AssetMange/Allocation");
const Repair = () => import("@/views/AssetMange/Repair");
const Scrap = () => import("@/views/AssetMange/Scrap");
const Check = () => import("@/views/AssetMange/Check");
// 资产管理->分析报表
const Report = () => import("@/views/AssetMange/Report");
const AssetHistory = () => import("@/views/AssetMange/Report/AssetHistory");
const AssetStatement = () => import("@/views/AssetMange/Report/AssetStatement");
const AssetCategory = () => import("@/views/AssetMange/Report/AssetCategory");
const AssetCategoryUsed = () =>
  import("@/views/AssetMange/Report/AssetCategoryUsed");
const AssetDept = () => import("@/views/AssetMange/Report/AssetDept");
const ExpireAsset = () => import("@/views/AssetMange/Report/ExpireAsset");
// 资产管理->设置
const Set = () => import("@/views/AssetMange/Set");
const DefinedCode = () => import("@/views/AssetMange/Set/DefinedCode");
const ExcelInfo = () => import("@/views/AssetMange/Set/ExcelInfo");
const Label = () => import("@/views/AssetMange/Set/Label");
const ScrapReason = () => import("@/views/AssetMange/Set/ScrapReason");
const Type = () => import("@/views/AssetMange/Set/Type");
// 采购管理
const PurchaseMange = () => import("@/views/PurchaseMange");
const Requisition = () => import("@/views/PurchaseMange/Requisition");
const Order = () => import("@/views/PurchaseMange/Order");
const OrderChange = () => import("@/views/PurchaseMange/OrderChange");
const Receiving = () => import("@/views/PurchaseMange/Receiving");
const Payment = () => import("@/views/PurchaseMange/Payment");
const PaymentRecord = () => import("@/views/PurchaseMange/PaymentRecord");
const PruSetting = () => import("@/views/PurchaseMange/Settings");
const SKU = () => import("@/views/PurchaseMange/Settings/SKU");
const Vendor = () => import("@/views/PurchaseMange/Settings/Vendor");
// 系统管理
const SystemSetting = () => import("@/views/SystemSetting");
const Area = () => import("@/views/SystemSetting/Area");
const Dept = () => import("@/views/SystemSetting/Dept");
const Roles = () => import("@/views/SystemSetting/Roles");
const Staff = () => import("@/views/SystemSetting/Staff");
const Dict = () => import('@/views/SystemSetting/Dict')
// RFID管理
const RFIDMange = () => import('@/views/RFIDMange')
const Device = () => import('@/views/RFIDMange/Device');
const Record = () => import('@/views/RFIDMange/Record')
// 审核管理
const ApprovalMange = () => import("@/views/ApprovalMange");
const Flow = () => import("@/views/ApprovalMange/Flow");
const Mange = () => import("@/views/ApprovalMange/Mange");
const Task = () => import("@/views/ApprovalMange/Task");
// 数据备份
const DataBackup = () => import("@/views/DataBackup");
const BackupAndRestore = () => import("@/views/DataBackup/BackupAndRestore");
//库存管理
const InventoryManagement = () => import("@/views/InventoryManagement");
const InventorySettings = () =>
  import("@/views/InventoryManagement/InventorySettings");
const Warehousing = () => import("@/views/InventoryManagement/Warehousing");
const Outbound = () => import("@/views/InventoryManagement/Outbound");
const ConTransfer = () => import("@/views/InventoryManagement/ConTransfer");
const InventoryAdjustment = () =>
  import("@/views/InventoryManagement/InventoryAdjustment");
const Inventory = () => import("@/views/InventoryManagement/Inventory");
const ItemList = () => import("@/views/InventoryManagement/ItemList");
const AnalysisReport = () =>
  import("@/views/InventoryManagement/AnalysisReport");
//库存管理 -> 设置
const WarehouseManagement = () =>
  import("@/views/InventoryManagement/InventorySettings/WarehouseManagement");
const ItemProfile = () =>
  import("@/views/InventoryManagement/InventorySettings/ItemProfile");
//库存管理 -> 分析报表
const ClassificationStatistics = () =>
  import("@/views/InventoryManagement/AnalysisReport/ClassificationStatistics");
const RequisitionForm = () =>
  import("@/views/InventoryManagement/AnalysisReport/RequisitionForm");
const SummaryTable = () =>
  import("@/views/InventoryManagement/AnalysisReport/SummaryTable");
const TemplateManagement = () =>
  import("@/views/InventoryManagement/InventorySettings/TemplateManagement");

// 需要权限判断的路由
const dynamicRoutes = [
  {
    path: "/AssetMange",
    name: "AssetMange",
    meta: {
      name: "资产管理",
      icon: "iconfont icon-asset ",
    },
    component: AssetMange,
    children: [
      {
        path: "/AssetMange/List",
        name: "List",
        meta: {
          name: "资产列表",
          icon: "",
        },
        component: List,
      },
      {
        path: "/AssetMange/Received",
        name: "Received",
        meta: {
          name: "资产入库",
          icon: "",
        },
        component: Received,
      },
      {
        path: "/AssetMange/Using",
        name: "Using",
        meta: {
          name: "资产领用",
          icon: "",
        },
        component: Using,
      },
      {
        path: "/AssetMange/Revert",
        name: "Revert",
        meta: {
          name: "资产退库",
          icon: "",
        },
        component: Revert,
      },
      {
        path: "/AssetMange/Borrow",
        name: "Borrow",
        meta: {
          name: "资产借用",
          icon: "",
        },
        component: Borrow,
      },
      {
        path: "/AssetMange/Return",
        name: "Return",
        meta: {
          name: "资产归还",
          icon: "",
        },
        component: Return,
      },
      {
        path: "/AssetMange/Allocation",
        name: "Allocation",
        meta: {
          name: "资产转移",
          icon: "",
        },
        component: Allocation,
      },
      {
        path: "/AssetMange/Repair",
        name: "Repair",
        meta: {
          name: "资产维修",
          icon: "",
        },
        component: Repair,
      },
      {
        path: "/AssetMange/Scrap",
        name: "Scrap",
        meta: {
          name: "资产报废",
          icon: "",
        },
        component: Scrap,
      },
      {
        path: "/AssetMange/Check",
        name: "Check",
        meta: {
          name: "资产盘点",
          icon: "",
        },
        component: Check,
      },
      {
        path: "/AssetMange/Report",
        name: "Report",
        meta: {
          name: "分析报表",
          icon: "",
        },
        component: Report,
        children: [
          {
            path: "/AssetMange/Report/AssetHistory",
            name: "AssetHistory",
            meta: {
              name: "资产履历",
              icon: "",
            },
            component: AssetHistory,
          },
          {
            path: "/AssetMange/Report/AssetStatement",
            name: "AssetStatement",
            meta: {
              name: "折旧粗算表",
              icon: "",
            },
            component: AssetStatement,
          },
          {
            path: "/AssetMange/Report/AssetCategory",
            name: "AssetCategory",
            meta: {
              name: "资产分类汇总表",
              icon: "",
            },
            component: AssetCategory,
          },
          {
            path: "/AssetMange/Report/AssetCategoryUsed",
            name: "AssetCategoryUsed",
            meta: {
              name: "分类使用情况表",
              icon: "",
            },
            component: AssetCategoryUsed,
          },
          {
            path: "/AssetMange/Report/AssetDept",
            name: "AssetDept",
            meta: {
              name: "部门资产汇总表",
              icon: "",
            },
            component: AssetDept,
          },
          {
            path: "/AssetMange/Report/ExpireAsset",
            name: "ExpireAsset",
            meta: {
              name: "到期资产表",
              icon: "",
            },
            component: ExpireAsset,
          },
        ],
      },
      {
        path: "/AssetMange/Set",
        name: "Set",
        meta: {
          name: "设置",
          icon: "",
        },
        component: Set,
        children: [
          {
            path: "/AssetMange/Set/DefinedCode",
            name: "DefinedCode",
            meta: {
              name: "自定义编码",
              icon: "",
            },
            component: DefinedCode,
          },
          {
            path: "/AssetMange/Set/ExcelInfo",
            name: "ExcelInfo",
            meta: {
              name: "导入模板设置",
              icon: "",
            },
            component: ExcelInfo,
          },
          // Type 资产分类设置
          {
            path: "/AssetMange/Set/Type",
            name: "Type",
            meta: {
              name: "资产分类设置",
              icon: "",
            },
            component: Type,
          },
          // Label 资产标签设置
          {
            path: "/AssetMange/Set/Label",
            name: "Label",
            meta: {
              name: "资产标签设置",
              icon: "",
            },
            component: Label,
          },
          // ScrapReason 报废原因设置
          {
            path: "/AssetMange/Set/ScrapReason",
            name: "ScrapReason",
            meta: {
              name: "报废原因设置",
              icon: "",
            },
            component: ScrapReason,
          },
        ],
      },
    ],
  },
  {
    path: "/PurchaseMange",
    name: "PurchaseMange",
    meta: {
      name: "采购管理",
      icon: "iconfont icon-purchase ",
    },
    component: PurchaseMange,
    children: [
      {
        path: "/PurchaseMange/Requisition",
        name: "Requisition",
        meta: {
          name: "采购申请",
          icon: "",
        },
        component: Requisition,
      },
      {
        path: "/PurchaseMange/Order",
        name: "Order",
        meta: {
          name: "订单管理",
          icon: "",
        },
        component: Order,
      },
      {
        path: "/PurchaseMange/OrderChange",
        name: "OrderChange",
        meta: {
          name: "订单变更",
          icon: "",
        },
        component: OrderChange,
      },
      {
        path: "/PurchaseMange/Receiving",
        name: "Receiving",
        meta: {
          name: "收货管理",
          icon: "",
        },
        component: Receiving,
      },
      {
        path: "/PurchaseMange/Payment",
        name: "Payment",
        meta: {
          name: "付款申请",
          icon: "",
        },
        component: Payment,
      },
      {
        path: "/PurchaseMange/PaymentRecord",
        name: "PaymentRecord",
        meta: {
          name: "付款登记",
          icon: "",
        },
        component: PaymentRecord,
      },
      {
        path: "/PurchaseMange/PruSetting",
        name: "PruSetting",
        meta: {
          name: "设置",
          icon: "",
        },
        component: PruSetting,
        children: [
          {
            path: "/PurchaseMange/PruSetting/SKU",
            name: "SKU",
            meta: {
              name: "物品分类",
              icon: "",
            },
            component: SKU,
          },
          {
            path: "/PurchaseMange/PruSetting/Vendor",
            name: "Vendor",
            meta: {
              name: "供应商管理",
              icon: "",
            },
            component: Vendor,
          },
        ],
      },
    ],
  },
  {
    path: "/SystemSetting",
    name: "SystemSetting",
    meta: {
      name: "系统设置",
      icon: "iconfont icon-setting ",
    },
    component: SystemSetting,
    children: [
      {
        path: "/SystemSetting/Area",
        name: "Area",
        meta: {
          name: "区域设置",
          icon: "",
        },
        component: Area,
      },
      {
        path: "/SystemSetting/Dept",
        name: "Dept",
        meta: {
          name: "组织架构",
          icon: "",
        },
        component: Dept,
      },
      {
        path: "/SystemSetting/Roles",
        name: "Roles",
        meta: {
          name: "角色信息",
          icon: "",
        },
        component: Roles,
      },
      {
        path: "/SystemSetting/Staff",
        name: "Staff",
        meta: {
          name: "员工信息",
          icon: "",
        },
        component: Staff,
      },
      {
        path: "/SystemSetting/Dict",
        name: "Dict",
        meta: {
          name: "字典",
          icon: ""
        },
        component: Dict
      },
    ],
  },
  {
    path: "/RFIDMange",
    name: "RFIDMange",
    meta: {
      name: "RFID管理",
      icon: "iconfont icon-setting ",
    },
    component: RFIDMange,
    children: [
      {
        path: "/RFIDMange/Device",
        name: "Device",
        meta: {
          name: "设备信息",
          icon: "",
        },
        component: Device
      },
      {
        path: "/RFIDMange/Record",
        name: "Record",
        meta: {
          name: "出入记录",
          icon: "",
        },
        component: Record
      }
    ],
  },
  {
    path: "/ApprovalMange",
    name: "ApprovalMange",
    meta: {
      name: "审核管理",
      icon: "iconfont icon-audit ",
    },
    component: ApprovalMange,
    children: [
      {
        path: "/ApprovalMange/Flow",
        name: "Flow",
        meta: {
          name: "审批流程设置",
          icon: "",
        },
        component: Flow,
      },
      {
        path: "/ApprovalMange/Mange",
        name: "Mange",
        meta: {
          name: "审核人员管理",
          icon: "",
        },
        component: Mange,
      },
      {
        path: "/ApprovalMange/Task",
        name: "Task",
        meta: {
          name: "待审核任务",
          icon: "",
        },
        component: Task,
      },
    ],
  },
  {
    path: "/DataBackup",
    name: "DataBackup",
    meta: {
      name: "数据备份",
      icon: "iconfont icon-backup ",
    },
    component: DataBackup,
    children: [
      {
        path: "/DataBackup/BackupAndRestore",
        name: "BackupAndRestore",
        meta: {
          name: "数据备份与恢复",
          icon: "",
        },
        component: BackupAndRestore,
      },
    ],
  },
  {
    path: "/InventoryManagement",
    name: "InventoryManagement",
    meta: {
      name: "库存管理",
      icon: "iconfont icon-consumables ",
    },
    component: InventoryManagement,
    children: [
      {
        path: "/InventoryManagement/InventorySettings",
        name: "InventorySettings",
        meta: {
          name: "设置",
          icon: "",
        },
        component: InventorySettings,
        children: [
          {
            path: "/InventoryManagement/InventorySettings/WarehouseManagement",
            name: "WarehouseManagement",
            meta: {
              name: "仓库管理",
              icon: "",
            },
            component: WarehouseManagement,
          },
          {
            path: "/InventoryManagement/InventorySettings/ItemProfile",
            name: "ItemProfile",
            meta: {
              name: "物品档案",
              icon: "",
            },
            component: ItemProfile,
          },
          {
            path: "/InventoryManagement/InventorySettings/TemplateManagement",
            name: "TemplateManagement",
            meta: {
              name: "模板管理",
              icon: "",
            },
            component: TemplateManagement,
          },
        ],
      },
      {
        path: "/InventoryManagement/Warehousing",
        name: "Warehousing",
        meta: {
          name: "入库单",
          icon: "",
        },
        component: Warehousing,
      },
      {
        path: "/InventoryManagement/Outbound",
        name: "Outbound",
        meta: {
          name: "出库单",
          icon: "",
        },
        component: Outbound,
      },
      {
        path: "/InventoryManagement/ItemList",
        name: "ItemList",
        meta: {
          name: "库存列表",
          icon: "",
        },
        component: ItemList,
      },
      {
        path: "/InventoryManagement/ConTransfer",
        name: "ConTransfer",
        meta: {
          name: "物品调拨",
          icon: "",
        },
        component: ConTransfer,
      },
      {
        path: "/InventoryManagement/InventoryAdjustment",
        name: "InventoryAdjustment",
        meta: {
          name: "库存调整",
          icon: "",
        },
        component: InventoryAdjustment,
      },
      {
        path: "/InventoryManagement/Inventory",
        name: "Inventory",
        meta: {
          name: "盘点单",
          icon: "",
        },
        component: Inventory,
      },
      {
        path: "/InventoryManagement/AnalysisReport",
        name: "AnalysisReport",
        meta: {
          name: "分析报表",
          icon: "",
        },
        component: AnalysisReport,
        children: [
          {
            path: "/InventoryManagement/AnalysisReport/ClassificationStatistics",
            name: "ClassificationStatistics",
            meta: {
              name: "库存分类统计",
              icon: "",
            },
            component: ClassificationStatistics,
          },
          {
            path: "/InventoryManagement/AnalysisReport/SummaryTable",
            name: "SummaryTable",
            meta: {
              name: "收发存汇总表",
              icon: "",
            },
            component: SummaryTable,
          },
          {
            path: "/InventoryManagement/AnalysisReport/RequisitionForm",
            name: "RequisitionForm",
            meta: {
              name: "库存领用表",
              icon: "",
            },
            component: RequisitionForm,
          },
        ],
      },
    ],
  },
];

export default dynamicRoutes;
