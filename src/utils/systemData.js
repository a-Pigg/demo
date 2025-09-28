import { i18n } from "@/i18n/index";

import { countTableHeaderWidth } from "./basic-methods";
let lang = localStorage.getItem("lang");
// 资产来源
export const sourceListData = [
  // { value: "自建", label: "自建" },
  // { value: "购置", label: "购置" },
  // { value: "租赁", label: "租赁" },
  // { value: "捐赠", label: "捐赠" },
  // { value: "自产", label: "自产" },
  // { value: "其他", label: "其他" },
  { value: i18n.t('h.selfBuilt'), label: i18n.t('h.selfBuilt') },
  { value: i18n.t('h.purchased'), label: i18n.t('h.purchased') },
  { value: i18n.t('h.lease'), label: i18n.t('h.lease') },
  { value: i18n.t('h.donated'), label: i18n.t('h.donated') },
  { value: i18n.t('h.selfProduction'), label: i18n.t('h.selfProduction') },
  { value: i18n.t('h.other'), label: i18n.t('h.other') },
];
// 上下架状态
export const listingStateList = [
  { value: "0", label: i18n.t('h.columns24') },
  { value: "1", label: i18n.t('h.columns25') },
  { value: "2", label: i18n.t('h.columns26') },
]
// 资产状态
// export const stateListData = [
//   { _id: 0, label: "闲置中" },
//   { _id: 1, label: "使用中" },
//   { _id: 2, label: "已借出" },
//   { _id: 3, label: "维修中" },
//   { _id: 4, label: "已报废" },
//   { _id: 5, label: "转移中" },
// ];
// 单据状态
export const statusListData = [
  { value: "-2", label: i18n.t('h.rejectBtn') },
  { value: "-1", label: i18n.t('h.pending') },
  { value: "0", label: i18n.t('h.agree') },
];
export const levels = [
  {
    value: "1",
    label: i18n.t('h.auditStaffName6'),
  },
  {
    value: "2",
    label: i18n.t('h.auditStaffName7'),
  },
  {
    value: "3",
    label: i18n.t('h.auditStaffName8'),
  },
  {
    value: "4",
    label: i18n.t('h.auditStaffName9'),
  },
  {
    value: "5",
    label: i18n.t('h.auditStaffName10'),
  },
];
export const levels2 = [
  {
    value: "1",
    label: i18n.t('h.auditStaffName1'),
  },
  {
    value: "2",
    label: i18n.t('h.auditStaffName2'),
  },
  {
    value: "3",
    label: i18n.t('h.auditStaffName3'),
  },
  {
    value: "4",
    label: i18n.t('h.auditStaffName4'),
  },
  {
    value: "5",
    label: i18n.t('h.auditStaffName5'),
  },
];
// 转移单据表格表头
export const alloctionBillsColumns = [
  {
    type: "billState",
    prop: "status",
    // label: "审核状态",
    label: i18n.t('h.auditStatus'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.auditStatus')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.rejectBtn');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    // label: "转移单号",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentNo')),
    showOverflowTooltip: true,
  },
  {
    type: "image",
    prop: "image",
    // label: "单据凭证",
    label: i18n.t('h.invoicesAndVouchers'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.invoicesAndVouchers')),
  },
  {
    prop: "assetNames",
    // label: "资产名称",
    label: i18n.t('h.assetName'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.assetName')),
  },
  {
    prop: "deptName",
    // label: "转i18n.t('h.department'),
    label: i18n.t('h.transferDepartment'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.transferDepartment')),
    showOverflowTooltip: true,
  },
  {
    prop: "staffName",
    // label: "使用人",
    label: i18n.t('h.user'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.user')),
    showOverflowTooltip: true,
  },
  {
    prop: "date",
    // label: "调出日期",
    label: i18n.t('h.transferDate'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.transferDate')),
    showOverflowTooltip: true,
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "100",
    fixed: "right",
  },
];
// 入库单据表格表头
export const receivedBillsColumns = [
  {
    type: "billState",
    prop: "status",
    // label: "审核状态",
    label: i18n.t('h.auditStatus'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.auditStatus')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.rejectBtn');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    // label: "入库单号",
    label: i18n.t("h.doucmentNo"),
    fixed: false,
    width: countTableHeaderWidth(i18n.t("h.doucmentNo")),
    showOverflowTooltip: true,
  },
  {
    type: "image",
    prop: "image",
    // label: "单据凭证",
    label: i18n.t('h.invoicesAndVouchers'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.invoicesAndVouchers')),
  },
  {
    prop: "deptName",
    // label: "创建部门",
    label: i18n.t('h.department'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.department')),
  },
  {
    prop: "staffName",
    // label: "创建人",
    label: i18n.t('h.creator'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.creator')),
  },
  {
    prop: "date",
    // label: "入库日期",
    label: i18n.t('h.enteringWarehouseDate'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.enteringWarehouseDate')),
  },
  {
    prop: "estaDate",
    // label: "创建日期",
    label: i18n.t('h.creationDate'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.creationDate')),
  },
  {
    prop: "source",
    // label: "来源",
    label: i18n.t('h.source'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.source')),
  },
  {
    prop: "assertBeizhu",
    // label: "备注",
    label: i18n.t('h.comment'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.comment')),
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "100",
    fixed: "right",
  },
];
// 资产履历表头
export const assetHistoryColumns = [
  {
    prop: "typeName",
    // label: "所属业务",
    label: i18n.t('h.business'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.business')),
  },
  {
    prop: "userName",
    // label: "业务操作人",
    label: i18n.t('h.operator'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.operator')),
  },
  {
    prop: "date",
    // label: "处理日期",
    label: i18n.t('h.processingDate'),
    fixed: false,
    showOverflowTooltip: true,
    width: "160px",
  },
  {
    prop: "content",
    // label: "处理详情",
    label: i18n.t('h.processingDetails'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.processingDetails')),
  },
];
// 资产履历单据信息
export const historyTypeData = [
  {
    _id: 1,
    name: i18n.t('h.Using'),
  },
  {
    _id: 2,
    name: i18n.t('h.Revert'),
  },
  {
    _id: 3,
    name: i18n.t('h.Borrow'),
  },
  {
    _id: 5,
    name: i18n.t('h.Allocation'),
  },
  {
    _id: 6,
    name: i18n.t('h.Repair'),
  },
  {
    _id: 7,
    name: i18n.t('h.Scrap'),
  },
  {
    _id: 8,
    name: i18n.t('h.Received'),
  },
  {
    _id: 9,
    name: i18n.t('h.Check'),
  },
  {
    _id: 10,
    name: i18n.t('h.assetDeletion'),
  },
  {
    _id: 11,
    name: i18n.t('h.assetModification'),
  },
  {
    _id: 12,
    name: i18n.t('h.Return'),
  },
];
// 领用单据表格表头
export const usingBillsColumns = [
  {
    type: "billState",
    prop: "status",
    // label: "审核状态",
    label: i18n.t('h.auditStatus'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.auditStatus')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.rejectBtn');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    // label: "领用单号",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentNo')),
    showOverflowTooltip: true,
  },
  {
    type: "image",
    prop: "image",
    // label: "单据凭证",
    label: i18n.t('h.invoicesAndVouchers'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.invoicesAndVouchers')),
  },
  {
    prop: "receiveOpera",
    // label: "操办人",
    label: i18n.t('h.operator'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.operator')),
  },
  {
    prop: "staffName",
    // label: "领用人",
    label: i18n.t('h.recipient'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.recipient')),
    showOverflowTooltip: true,
  },
  {
    prop: "assetNames",
    // label: "资产名称",
    label: i18n.t('h.assetName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.assetName')),
    showOverflowTooltip: true,
  },
  {
    prop: "receiveData",
    // label: "领用日期",
    label: i18n.t('h.collectionDate'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.collectionDate')),
    showOverflowTooltip: true,
  },
  {
    prop: "region",
    // label: "领用后放置区域",
    label: i18n.t('h.placementArea'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.placementArea')),
    showOverflowTooltip: true,
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "120",
    fixed: "right",
  },
];
// 退库单据表格表头
export const revertBillsColumns = [
  {
    type: "billState",
    prop: "status",
    // label: "审核状态",
    label: i18n.t('h.auditStatus'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.auditStatus')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.rejectBtn');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    // label: "退库单号",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentNo')),
    showOverflowTooltip: true,
  },
  {
    type: "image",
    prop: "image",
    // label: "单据凭证",
    label: i18n.t('h.invoicesAndVouchers'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.invoicesAndVouchers')),
  },
  {
    prop: "deptName",
    // label: "退库部门",
    label: i18n.t('h.revertDepartment'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.revertDepartment')),
  },
  {
    prop: "staffName",
    // label: "退库人",
    label: i18n.t('h.personWhoReturned'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.personWhoReturned')),
  },
  {
    prop: "assetNames",
    // label: "资产名称",
    label: i18n.t('h.assetName'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.assetName')),
  },
  {
    prop: "date",
    // label: "退库日期",
    label: i18n.t('h.revertDate'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.revertDate')),
  },
  {
    prop: "warehouseName",
    // label: "退库后放置区域",
    label: i18n.t('h.placementArea'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.placementArea')),
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "120",
    fixed: "right",
  },
];
// 借用单据表格表头
export const borrowAndReturnBillsColumns = [
  {
    type: "billState",
    prop: "status",
    // label: "审核状态",
    label: i18n.t('h.auditStatus'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.auditStatus')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.rejectBtn');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    // label: "借用单号",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentNo')),
    showOverflowTooltip: true,
  },
  {
    type: "image",
    prop: "image",
    // label: "单据凭证",
    label: i18n.t('h.invoicesAndVouchers'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.invoicesAndVouchers')),
  },
  {
    prop: "deptName",
    // label: "借用部门",
    label: i18n.t('h.borrowingDepartment'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.borrowingDepartment')),
  },
  {
    prop: "staffName",
    // label: "借用人",
    label: i18n.t('h.borrower'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.borrower')),
  },
  {
    prop: "assetNames",
    // label: "资产名称",
    label: i18n.t('h.assetName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.assetName')),
    showOverflowTooltip: true,
  },
  {
    prop: "borrowData",
    // label: "借用日期",
    label: i18n.t('h.borrowingDate'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.borrowingDate')),
  },
  {
    prop: "borrowBackData",
    // label: "预计归还时间",
    label: i18n.t('h.estimatedReturnDate'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.estimatedReturnDate')),
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "180",
    fixed: "right",
  },
];
// 归还单据表格表头
export const returnBillsColumns = [
  {
    type: "billState",
    prop: "status",
    // label: "审核状态",
    label: i18n.t('h.auditStatus'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.auditStatus')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.rejectBtn');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    // label: "归还单号",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentNo')),
    showOverflowTooltip: true,
  },
  {
    type: "image",
    prop: "image",
    // label: "单据凭证",
    label: i18n.t('h.invoicesAndVouchers'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.invoicesAndVouchers')),
  },
  {
    prop: "deptName",
    // label: "归还部门",
    label: i18n.t('h.returnDepartment'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.returnDepartment')),
  },
  {
    prop: "staffName",
    // label: "归还人",
    label: i18n.t('h.personWhoReturnAsset'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.personWhoReturnAsset')),
  },
  {
    prop: "assetNames",
    // label: "资产名称",
    label: i18n.t('h.assetName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.assetName')),
    showOverflowTooltip: true,
  },
  {
    prop: "date",
    // label: "归还日期",
    label: i18n.t('h.returnDate'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.returnDate')),
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "100",
    fixed: "right",
  },
];
// 盘点单据表头
export const checkColumns = [
  {
    type: "billState",
    prop: "queryState",
    // label: "状态",
    label: i18n.t('h.state'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.state')),
    formatter: (row) => {
      switch (row["queryState"]) {
        case "0":
          return i18n.t('h.incomplete');
        case "1":
          return i18n.t('h.completed');
        default:
          return i18n.t('h.sterrorCodeate');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    // label: "盘点编号",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.doucmentNo')),
  },
  {
    prop: "queryName",
    // label: "盘点单名称",
    label: i18n.t('h.stocktakingSheetName'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.stocktakingSheetName')),
  },
  {
    prop: "deptName",
    // label: "盘点部门",
    label: i18n.t('h.stocktakingDepartment'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.stocktakingDepartment')),
  },
  {
    prop: "queryCreater",
    // label: "盘点人",
    label: i18n.t('h.inventoryChecker'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.inventoryChecker')),
  },
  {
    prop: "createDate",
    // label: "创建时间",
    label: i18n.t('h.creationDate'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.creationDate')),
  },
  {
    prop: "completeDate",
    // label: "完成时间",
    label: i18n.t('h.finishDate'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.finishDate')),
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "330",
    fixed: "right",
  },
];
//  盘点单据状态
export const checkStatusListData = [
  { value: "1", label: i18n.t('h.completed') },
  { value: "0", label: i18n.t('h.incomplete') },
];
// 报废单据表格表头
export const scrapBillsColumns = [
  {
    type: "billState",
    prop: "status",
    // label: "审核状态",
    label: i18n.t('h.auditStatus'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.auditStatus')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.rejectBtn');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    // label: "报废单号",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentNo')),
    showOverflowTooltip: true,
  },
  {
    type: "image",
    prop: "image",
    // label: "单据凭证",
    label: i18n.t('h.invoicesAndVouchers'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.invoicesAndVouchers')),
  },
  {
    prop: "assetNames",
    // label: "资产名称",
    label: i18n.t('h.assetName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.assetName')),
    showOverflowTooltip: true,
  },
  {
    prop: "destroyData",
    // label: "报废日期",
    label: i18n.t('h.liquidationDate'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.liquidationDate')),
    showOverflowTooltip: true,
  },
  {
    prop: "destroyReason",
    // label: "报废原因",
    label: i18n.t('h.scrapReason'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.scrapReason')),
    showOverflowTooltip: true,
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "100",
    fixed: "right",
  },
];
// 维修单据表格表头
export const repairBillsColumns = [
  {
    type: "billState",
    prop: "status",
    // label: "审核状态",
    label: i18n.t('h.auditStatus'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.auditStatus')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.rejectBtn');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    // label: "维修单号",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentNo')),
    showOverflowTooltip: true,
  },
  {
    type: "image",
    prop: "image",
    // label: "单据凭证",
    label: i18n.t('h.invoicesAndVouchers'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.invoicesAndVouchers')),
  },
  {
    prop: "assetNames",
    // label: "维修资产名称",
    label: i18n.t('h.assetName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.assetName')),
    showOverflowTooltip: true,
  },
  {
    prop: "staffName",
    // label: "报修人",
    label: i18n.t('h.repairApplicant'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.repairApplicant')),
    showOverflowTooltip: true,
  },
  {
    prop: "receiveData",
    // label: "报修日期",
    label: i18n.t('h.reportDate'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.reportDate')),
    showOverflowTooltip: true,
  },
  {
    prop: "maintainMoney",
    // label: "预估费用",
    label: i18n.t('h.estimatedAmount'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.estimatedAmount')),
    showOverflowTooltip: true,
  },
  {
    prop: "repairCompany",
    // label: "维修接收公司",
    label: i18n.t('h.repairServiceCompany'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.repairServiceCompany')),
    showOverflowTooltip: true,
  },
  {
    prop: "repairName",
    // label: "维修接收人",
    label: i18n.t('h.repairRecipient'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.repairRecipient')),
    showOverflowTooltip: true,
  },
  {
    prop: "repairTel",
    // label: "维修接收人电话",
    label: i18n.t('h.repairRecipientPhoneNumber'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.repairRecipientPhoneNumber')),
    showOverflowTooltip: true,
  },
  {
    prop: "maintainPerson",
    // label: "维修技工",
    label: i18n.t('h.maintenanceStaff'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.maintenanceStaff')),
    showOverflowTooltip: true,
  },
  {
    prop: "repairBackData",
    // label: "完成维修日期",
    label: i18n.t('h.completionDateOfRepairs'),
    fixed: "right",
    width: countTableHeaderWidth(i18n.t('h.completionDateOfRepairs')),
    showOverflowTooltip: true,
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "100",
    fixed: "right",
  },
];
// 删除资产错误表格
export const deleteAssetErrorColumns = [
  {
    prop: "status",
    label: i18n.t('h.columns1'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.columns1')),
    showOverflowTooltip: true,
    formatter: () => {
      return i18n.t('h.columns2');
    },
  },
  {
    prop: "code",
    label: "资产编码",
    fixed: false,
    width: countTableHeaderWidth("资产编码"),
    showOverflowTooltip: true,
  },
  {
    prop: "name",
    label: "资产名称",
    fixed: false,
    width: countTableHeaderWidth("资产名称"),
    showOverflowTooltip: true,
  },
  {
    prop: "reason",
    label: "失败原因",
    fixed: false,
    minWidth: countTableHeaderWidth("失败原因"),
    showOverflowTooltip: true,
  },
];
// 导入模版表头
export const templateBillsColumns = [
  {
    prop: "name",
    // label: "模板",
    label: i18n.t('h.templateName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.templateName')),
    showOverflowTooltip: true,
  },
];
// 导入模版新建table
export const loaclExcelColumns = [
  {
    prop: "colName",
    label: i18n.t('h.columns10'),
    fixed: false,
    minWidth: "150px",
    showOverflowTooltip: true,
  },
  {
    label: i18n.t('h.columns11'),
    slotName: "system",
    width: "140",
    fixed: false,
  },
  {
    label: i18n.t('h.tips49'),
    slotName: "type",
    width: "140",
    fixed: false,
  },
  {
    label: i18n.t('h.columns12'),
    slotName: "character",
    width: "180",
    fixed: false,
  },
  {
    label: i18n.t('h.columns13'),
    slotName: "default",
    width: "160",
    fixed: false,
  },
  {
    label: i18n.t('h.title91'),
    slotName: "range",
    width: "160",
    fixed: false,
  },
  {
    label: i18n.t('h.columns14'),
    slotName: "format",
    width: "160",
    fixed: false,
  },
  {
    label: i18n.t('h.columns15'),
    slotName: "rule",
    width: "160",
    fixed: false,
  },
];
// 分类使用情况表格表头
export const usedTableColumns = [
  {
    prop: "idle",
    label: i18n.t('h.columns3'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.columns3')),
    showOverflowTooltip: true,
  },
  {
    prop: "use",
    label: i18n.t('h.columns4'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.columns4')),
    showOverflowTooltip: true,
  },
  {
    prop: "loan",
    label: i18n.t('h.columns5'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.columns5')),
    showOverflowTooltip: true,
  },
  {
    prop: "maintain",
    label: i18n.t('h.columns6'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.columns6')),
    showOverflowTooltip: true,
  },
  {
    prop: "scrap",
    label: i18n.t('h.columns7'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.columns7')),
    showOverflowTooltip: true,
  },
  {
    prop: "sum",
    label: i18n.t('h.columns8'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.columns8')),
    showOverflowTooltip: true,
  },
];
// 数据备份表格表头
export const backupTableColumns = [
  {
    prop: "name",
    // label: "数据库名称",
    label: i18n.t('h.databaseName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.databaseName')),
    showOverflowTooltip: true,
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: countTableHeaderWidth(i18n.t('h.action')),
    fixed: "right",
  },
];
// 放置区域表格表头
export const wareBillsColumns = [
  {
    prop: "code",
    // label: "放置区域编码",
    label: i18n.t('h.areaCode'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.areaCode')),
    showOverflowTooltip: true,
  },
  {
    prop: "warehouseName",
    label: i18n.t('h.areaName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.areaName')),
    showOverflowTooltip: true,
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "220px",
    fixed: "right",
  },
];
export const deleteAreaErrorColumns = [
  {
    prop: "status",
    label: i18n.t('h.columns1'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.columns1')),
    showOverflowTooltip: true,
    formatter: () => {
      return i18n.t('h.columns2');
    },
  },
  {
    prop: "code",
    label: i18n.t('h.areaCode'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.areaCode')),
    showOverflowTooltip: true,
  },
  {
    prop: "warehouseName",
    label: i18n.t('h.areaName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.areaName')),
    showOverflowTooltip: true,
  },
  {
    prop: "reason",
    label: i18n.t('h.reasonForFailure'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.reasonForFailure')),
    showOverflowTooltip: true,
  },
];
// 角色表格表头
export const rolesBillsColumns = [
  {
    prop: "roleName",
    // label: "角色名",
    label: i18n.t('h.roleName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.roleName')),
    showOverflowTooltip: true,
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "150px",
    fixed: "right",
  },
];
export const deleteRolesErrorColumns = [
  {
    prop: "status",
    label: i18n.t('h.columns1'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.columns1')),
    showOverflowTooltip: true,
    formatter: () => {
      return i18n.t('h.columns2');
    },
  },
  {
    prop: "roleName",
    label: i18n.t('h.roleName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.roleName')),
    showOverflowTooltip: true,
  },
  {
    prop: "reason",
    label: i18n.t('h.reasonForFailure'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.reasonForFailure')),
    showOverflowTooltip: true,
  },
];
// 员工表格表头
export const staffBillsColumns = [
  {
    prop: "code",
    // label: "工号",
    label: i18n.t('h.workNumber'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.workNumber')),
    showOverflowTooltip: true,
  },
  {
    prop: "name",
    // label: "职工名称",
    label: i18n.t('h.employeeName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.employeeName')),
    showOverflowTooltip: true,
  },
  {
    prop: "roleName",
    // label: "担任角色",
    label: i18n.t('h.permission'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.permission')),
    showOverflowTooltip: true,
  },
  {
    prop: "phone",
    // label: "手机号码",
    label: i18n.t('h.userName'),
    // label: i18n.t('h.phoneNumber'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.userName')),
    // minWidth: countTableHeaderWidth(i18n.t('h.phoneNumber')),
    showOverflowTooltip: true,
  },
  {
    prop: "deptName",
    // label: "部门名称",
    label: i18n.t('h.department'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.department')),
    showOverflowTooltip: true,
  },
  {
    prop: "workStatus",
    // label: "在职状态",
    label: i18n.t('h.positionStatus'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.positionStatus')),
    showOverflowTooltip: true,
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    // width: "100px",
    width: countTableHeaderWidth(i18n.t('h.action')),
    fixed: "right",
  },
];
export const deleteStaffErrorColumns = [
  {
    prop: "status",
    label: i18n.t('h.columns1'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.columns1')),
    showOverflowTooltip: true,
    formatter: () => {
      return i18n.t('h.columns2');
    },
  },
  {
    prop: "code",
    label: i18n.t('h.workNumber'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.workNumber')),
    showOverflowTooltip: true,
  },
  {
    prop: "name",
    label: i18n.t('h.employeeName'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.employeeName')),
    showOverflowTooltip: true,
  },
  {
    prop: "reason",
    label: i18n.t('h.reasonForFailure'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.reasonForFailure')),
    showOverflowTooltip: true,
  },
];
export const staffState = [
  // { value: "在职", label: "在职" },
  // { value: "离职", label: "离职" },
  { value: i18n.t('h.incumbent'), label: i18n.t('h.incumbent') },
  { value: i18n.t('h.dimission'), label: i18n.t('h.dimission') },
];
// 设备信息表格表头
export const deviceColumns = [
  {
    prop: "cloudNumber",
    label: i18n.t('h.title139'),
    fixed: false,
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    prop: "name",
    label: i18n.t('h.formTips30'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.formTips30')),
    showOverflowTooltip: true,
  },
  {
    prop: "type",
    label: i18n.t('h.formTips37'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.formTips37')),
    showOverflowTooltip: true,
    formatter: (row) => {
      switch (row["type"]) {
        case "0":
          return i18n.t('h.title128');
        case "1":
          return i18n.t('h.title129');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    prop: "model",
    label: i18n.t('h.tips48'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.tips48')),
    showOverflowTooltip: true,
  },
  {
    prop: "warehouseName",
    label: i18n.t('h.formTips36'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.formTips36')),
    showOverflowTooltip: true,
  },
  {
    label: i18n.t('h.title138'),
    slotName: "ant",
    // width: 150,
    minWidth: countTableHeaderWidth(i18n.t('h.title138')),
    fixed: false,
  },
  {
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "150px",
    fixed: "right",
  },
]
// 设备天线
export const deviceAntenna = [
  {
    label: "1号天线",
    value: 1,
    disabled: false
  }, {
    label: "2号天线",
    value: 2,
    disabled: false
  }, {
    label: "3号天线",
    value: 3,
    disabled: false
  }, {
    label: "4号天线",
    value: 4,
    disabled: false
  }, {
    label: "5号天线",
    value: 5,
    disabled: false
  }, {
    label: "6号天线",
    value: 6
  }, {
    label: "7号天线",
    value: 7,
    disabled: false
  }, {
    label: "8号天线",
    value: 8
  }, {
    label: "9号天线",
    value: 9,
    disabled: false
  }, {
    label: "10号天线",
    value: 10,
    disabled: false
  }, {
    label: "11号天线",
    value: 11,
    disabled: false
  }, {
    label: "12号天线",
    value: 12,
    disabled: false
  }, {
    label: "13号天线",
    value: 13,
    disabled: false
  }, {
    label: "14号天线",
    value: 14,
    disabled: false
  }, {
    label: "15号天线",
    value: 15,
    disabled: false
  }, {
    label: "16号天线",
    value: 16,
    disabled: false
  }, {
    label: "17号天线",
    value: 17,
    disabled: false
  }, {
    label: "18号天线",
    value: 18,
    disabled: false
  }, {
    label: "19号天线",
    value: 19
  }, {
    label: "20号天线",
    value: 20,
    disabled: false
  }, {
    label: "21号天线",
    value: 21,
    disabled: false
  }, {
    label: "22号天线",
    value: 22,
    disabled: false
  }, {
    label: "23号天线",
    value: 23,
    disabled: false
  }, {
    label: "24号天线",
    value: 24,
    disabled: false
  }, {
    label: "25号天线",
    value: 25,
    disabled: false
  }, {
    label: "26号天线",
    value: 26,
    disabled: false
  }, {
    label: "27号天线",
    value: 27,
    disabled: false
  }, {
    label: "28号天线",
    value: 28,
    disabled: false
  }, {
    label: "29号天线",
    value: 29,
    disabled: false
  }, {
    label: "30号天线",
    value: 30,
    disabled: false
  }, {
    label: "31号天线",
    value: 31,
    disabled: false
  }, {
    label: "32号天线",
    value: 32,
    disabled: false
  },
]
// 绑定设备表格表头
export const antennaColumns = [
  {
    prop: "warehouse_name",
    label: i18n.t('h.area'),
    fixed: false,
    minWidth: 150,
    showOverflowTooltip: true,
  },
  {
    prop: "ant",
    label: i18n.t('h.title138'),
    fixed: false,
    minWidth: 150,
    showOverflowTooltip: true,
  },
]
// 待审核单据
export const billTypes = [
  {
    value: "0",
    label: i18n.t('h.allApplicationDocuments'),
  },
  {
    value: "1",
    label: i18n.t('h.collectionApplicationDoucments'),
  },
  {
    value: "2",
    label: i18n.t('h.returnToWarehouseApplicationDoucments'),
  },
  {
    value: "3",
    label: i18n.t('h.borrowingApplicationDoucments'),
  },
  {
    value: "4",
    label: i18n.t('h.scrapApplicationDoucments'),
  },
  {
    value: "5",
    label: i18n.t('h.repairApplicationDoucments'),
  },
  {
    value: "6",
    label: i18n.t('h.transferApplicationDoucments'),
  },
  {
    value: "7",
    label: i18n.t('h.stocktakingApplicationDoucments'),
  },
  {
    value: "8",
    label: i18n.t('h.returnApplicationDoucments'),
  },
];
export const approvalBillsColumns = [
  {
    type: "billState",
    prop: "status",
    // label: "审核状态",
    label: i18n.t('h.auditStatus'),
    fixed: false,
    width: "130px",
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.rejectBtn');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    // label: "单据单号",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentNo')),
    showOverflowTooltip: true,
  },
  {
    prop: "type",
    // label: "单据类型",
    label: i18n.t('h.doucmentType'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentType')),
    showOverflowTooltip: true,
  },
  {
    prop: "applyDate",
    // label: "申请日期",
    label: i18n.t('h.applicationDate'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.applicationDate')),
    showOverflowTooltip: true,
  },
  {
    prop: "staffName",
    // label: "申请人",
    label: i18n.t('h.applicant'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.applicant')),
    showOverflowTooltip: true,
  },
  {
    prop: "assetNames",
    // label: "资产详情",
    label: i18n.t('h.assetDetails'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.assetDetails')),
    showOverflowTooltip: true,
  },
];
export const deletePendingErrorColumns = [
  {
    prop: "status",
    label: "审批状态",
    fixed: false,
    width: countTableHeaderWidth("审批状态"),
    showOverflowTooltip: true,
    formatter: () => {
      return "审批失败";
    },
  },
  {
    prop: "type",
    label: "单据类型",
    fixed: false,
    width: countTableHeaderWidth("单据类型"),
    formatter: (row) => {
      switch (row["type"]) {
        case "1":
          return "领用单据";
        case "2":
          return "退库单据";
        case "3":
          return "借用单据";
        case "4":
          return "报废单据";
        case "5":
          return "维修单据";
        case "6":
          return "转移单据";
        case "7":
          return "入库单据";
        default:
          return "错误编码";
      }
    },
  },
  {
    prop: "reason",
    label: "失败原因",
    fixed: false,
    minWidth: countTableHeaderWidth("失败原因"),
    showOverflowTooltip: true,
  },
];
// 查看单据详情
// repair
export function repairDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: i18n.t('h.doucmentNo') },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: i18n.t('h.reportDepartment') },
    { span: 5, class: "col-content", val: val.deptName },
    { span: 3, class: "col-title", val: i18n.t('h.repairApplicant') },
    { span: 5, class: "col-content", val: val.staffName },
    { span: 3, class: "col-title", val: i18n.t('h.operator') },
    { span: 5, class: "col-content", val: val.repairOpera },
    { span: 3, class: "col-title", val: i18n.t('h.estimatedAmount') },
    { span: 5, class: "col-content", val: val.maintainMoney },
    { span: 3, class: "col-title", val: i18n.t('h.reasonForRepair') },
    { span: 5, class: "col-content", val: val.maintainReason },
    { span: 3, class: "col-title", val: i18n.t('h.repairServiceCompany') },
    { span: 5, class: "col-content", val: val.repairCompany },
    { span: 3, class: "col-title", val: i18n.t('h.repairRecipient') },
    { span: 5, class: "col-content", val: val.repairName },
    { span: 3, class: "col-title", val: i18n.t('h.repairRecipientPhoneNumber') },
    { span: 5, class: "col-content", val: val.repairTel },
    { span: 3, class: "col-title", val: i18n.t('h.maintenanceStaff') },
    { span: 5, class: "col-content", val: val.maintainPerson },
    { span: 3, class: "col-title", val: i18n.t('h.reportDate') },
    { span: 5, class: "col-content", val: val.receiveData },
    { span: 3, class: "col-title", val: i18n.t('h.completionDateOfRepairs') },
    { span: 5, class: "col-content", val: val.repairBackData },
    { span: 3, class: "col-title", val: i18n.t('h.repairNote') },
    { span: 5, class: "col-content", val: val.repairBeizhu },
  ];
}
export function revertDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: i18n.t('h.doucmentNo') },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: i18n.t('h.revertDepartment') },
    { span: 5, class: "col-content", val: val.deptName },
    { span: 3, class: "col-title", val: i18n.t('h.personWhoReturned') },
    { span: 5, class: "col-content", val: val.staffName },
    { span: 3, class: "col-title", val: i18n.t('h.revertDate') },
    { span: 5, class: "col-content", val: val.date },
    { span: 3, class: "col-title", val: i18n.t('h.placementArea') },
    { span: 5, class: "col-content", val: val.warehouseName },
  ];
}
export function scrapDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: i18n.t('h.doucmentNo') },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: i18n.t('h.liquidationDepartment') },
    { span: 5, class: "col-content", val: val.deptName },
    { span: 3, class: "col-title", val: i18n.t('h.responsiblePerson') },
    { span: 5, class: "col-content", val: val.staffName },
    { span: 3, class: "col-title", val: i18n.t('h.operator') },
    { span: 5, class: "col-content", val: val.destroyOpera },
    { span: 3, class: "col-title", val: i18n.t('h.liquidationDate') },
    { span: 5, class: "col-content", val: val.destroyData },
    { span: 3, class: "col-title", val: i18n.t('h.scrapReason') },
    { span: 5, class: "col-content", val: val.destroyReason },
    { span: 3, class: "col-title", val: i18n.t('h.comment') },
    { span: 5, class: "col-content", val: val.destroyBeizhu },
  ];
}
export function usingDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: "领用单号" },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: "领用部门" },
    { span: 5, class: "col-content", val: val.deptName },
    { span: 3, class: "col-title", val: "领用人" },
    { span: 5, class: "col-content", val: val.staffName },
    { span: 3, class: "col-title", val: "操办人" },
    { span: 5, class: "col-content", val: val.receiveOpera },
    { span: 3, class: "col-title", val: "领用日期" },
    { span: 5, class: "col-content", val: val.receiveData },
    { span: 3, class: "col-title", val: "领用后放置区域" },
    { span: 5, class: "col-content", val: val.region },
    { span: 3, class: "col-title", val: "备注" },
    { span: 5, class: "col-content", val: val.userBeizhu },
  ];
}
export function allocationDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: i18n.t('h.doucmentNo') },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: i18n.t('h.transferDate') },
    { span: 5, class: "col-content", val: val.date },
    { span: 3, class: "col-title", val: i18n.t('h.transferDepartment') },
    { span: 5, class: "col-content", val: val.deptName },
    { span: 3, class: "col-title", val: i18n.t('h.transferEmployees') },
    { span: 5, class: "col-content", val: val.staffName },
  ];
}
export function receivedDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: i18n.t('h.warehouseEntryNumber') },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: i18n.t('h.enteringWarehouseDate') },
    { span: 5, class: "col-content", val: val.date },
    { span: 3, class: "col-title", val: i18n.t('h.creationDate') },
    { span: 5, class: "col-content", val: val.estaDate },
    { span: 3, class: "col-title", val: i18n.t('h.createDepartment') },
    { span: 5, class: "col-content", val: val.deptName },
    { span: 3, class: "col-title", val: i18n.t('h.creator') },
    { span: 5, class: "col-content", val: val.staffName },
    { span: 3, class: "col-title", val: i18n.t('h.source') },
    { span: 5, class: "col-content", val: val.source },
    { span: 3, class: "col-title", val: i18n.t('h.comment') },
    { span: 5, class: "col-content", val: val.assertBeizhu },
  ];
}
export function borrowDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: i18n.t('h.doucmentNo') },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: i18n.t('h.borrowingDepartment') },
    { span: 5, class: "col-content", val: val.deptName },
    { span: 3, class: "col-title", val: i18n.t('h.borrower') },
    { span: 5, class: "col-content", val: val.staffName },
    { span: 3, class: "col-title", val: i18n.t('h.borrowStaffPhone') },
    { span: 5, class: "col-content", val: val.borrowTel },
    { span: 3, class: "col-title", val: i18n.t('h.borrowingDate') },
    { span: 5, class: "col-content", val: val.borrowData },
    { span: 3, class: "col-title", val: i18n.t('h.estimatedReturnDate') },
    { span: 5, class: "col-content", val: val.borrowBackData },
    { span: 3, class: "col-title", val: i18n.t('h.operator') },
    { span: 5, class: "col-content", val: val.borrowOpera },
    { span: 3, class: "col-title", val: i18n.t('h.comment') },
    { span: 5, class: "col-content", val: val.borrowBeizhu },
  ];
}
export function returnDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: i18n.t('h.doucmentNo') },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: i18n.t('h.returnDepartment') },
    { span: 5, class: "col-content", val: val.deptName },
    { span: 3, class: "col-title", val: i18n.t('h.personWhoReturnAsset') },
    { span: 5, class: "col-content", val: val.staffName },
    { span: 3, class: "col-title", val: i18n.t('h.returnDate') },
    { span: 5, class: "col-content", val: val.date },
  ];
}
// 字典详情
export function dictDetailCell(val) {
  return [
    { span: 5, class: "col-title", val: i18n.t('h.dictionaryName') },
    { span: 7, class: "col-content", val: val.name },
    { span: 5, class: "col-title", val: i18n.t('h.supportMultipleLevels') },
    { span: 7, class: "col-content", val: val.cascade == true ? i18n.t('h.tips73') : i18n.t('h.tips74') },
    { span: 5, class: "col-title", val: i18n.t('h.allowDeletion') },
    { span: 7, class: "col-content", val: val.delete == true ? i18n.t('h.tips73') : i18n.t('h.tips74') },
    { span: 5, class: "col-title", val: i18n.t('h.allowDisabling') },
    { span: 7, class: "col-content", val: val.disabled == true ? i18n.t('h.tips73') : i18n.t('h.tips74') },
    { span: 5, class: "col-title", val: i18n.t('h.comment') },
    { span: 7, class: "col-content", val: val.comment },
  ]
}
// 报废原因表格表头
export const scrapReasonBillsColumns = [
  {
    prop: "scrapResult",
    // label: "报废原因",
    label: i18n.t('h.scrapReason'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.scrapReason')),
    showOverflowTooltip: true,
  },
  {
    // label: "操作",
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "150px",
    fixed: "right",
  },
];
export const deleteReasonErrorColumns = [
  {
    prop: "status",
    label: i18n.t('h.auditStatus'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.auditStatus')),
    showOverflowTooltip: true,
    formatter: () => {
      return i18n.t('h.columns2');
    },
  },
  {
    prop: "scrapResult",
    label: i18n.t('h.scrapReason'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.scrapReason')),
    showOverflowTooltip: true,
  },
  {
    prop: "reason",
    label: i18n.t('h.reasonForFailure'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.reasonForFailure')),
    showOverflowTooltip: true,
  },
];
// 单据删除表格表头
export const deleteBillsErrorColumns = [
  {
    prop: "status",
    label: i18n.t('h.columns1'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.columns1')),
    showOverflowTooltip: true,
    formatter: () => {
      return i18n.t('h.columns2');
    },
  },
  {
    prop: "roleRule",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentNo')),
    showOverflowTooltip: true,
  },
  {
    prop: "assetNames",
    label: i18n.t('h.asset'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.asset')),
    showOverflowTooltip: true,
  },
  {
    prop: "reason",
    label: i18n.t('h.reasonForFailure'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.reasonForFailure')),
    showOverflowTooltip: true,
  },
];
export const completedRepairErrorColumns = [
  {
    prop: "status",
    label: i18n.t('h.completedMaintenanceStatus'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.completedMaintenanceStatus')),
    showOverflowTooltip: true,
    formatter: () => {
      return i18n.t('h.repairFailed');
    },
  },
  {
    prop: "roleRule",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentNo')),
    showOverflowTooltip: true,
  },
  {
    prop: "assetNames",
    label: i18n.t('h.asset'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.asset')),
    showOverflowTooltip: true,
  },
  {
    prop: "reason",
    label: i18n.t('h.reasonForFailure'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.reasonForFailure')),
    showOverflowTooltip: true,
  },
];
export const regainScrapErrorColumns = [
  {
    prop: "status",
    label: i18n.t('h.restoreState'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.restoreState')),
    showOverflowTooltip: true,
    formatter: () => {
      return i18n.t('h.restoreFailed');
    },
  },
  {
    prop: "roleRule",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentNo')),
    showOverflowTooltip: true,
  },
  {
    prop: "assetNames",
    label: i18n.t('h.asset'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.asset')),
    showOverflowTooltip: true,
  },
  {
    prop: "reason",
    label: i18n.t('h.reasonForFailure'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.reasonForFailure')),
    showOverflowTooltip: true,
  },
];
// 采购管理表头
export const orderBillsColumns = [
  {
    type: "billState",
    prop: "status",
    label: i18n.t('h.state'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.state')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.reject');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        case 1:
          return i18n.t('h.completed');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    label: i18n.t('h.documentNumber'),
    fixed: false,
    // width: 150,
    width: countTableHeaderWidth(i18n.t('h.documentNumber')),
    showOverflowTooltip: true,
  },
  {
    prop: "date",
    label: i18n.t('h.applicationTime'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.applicationTime')),
  },
  {
    prop: "staffName",
    label: i18n.t('h.applicant'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.applicant')),
  },
  // {
  //   prop: "deptName",
  //   label: "申请部门",
  //   fixed: false,
  //   width: countTableHeaderWidth("申请部门"),
  //   showOverflowTooltip: true,
  // },
  {
    prop: "vendorName",
    label: i18n.t('h.supplier'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.supplier')),
    showOverflowTooltip: true,
  },
  {
    prop: "receiveAddress",
    label: i18n.t('h.receivingInformation'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.receivingInformation')),
    showOverflowTooltip: true,
  },
  {
    prop: "desireDate",
    label: i18n.t('h.formTips43'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.formTips43')),
    showOverflowTooltip: true,
  },
  {
    prop: "coment",
    label: i18n.t('h.formTips44'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.formTips44')),
    showOverflowTooltip: true,
  },
  {
    prop: "goodDetails",
    label: i18n.t('h.formTips45'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.formTips45')),
    showOverflowTooltip: true,
  },
];
// 订单变更单据表头
export const orderChangeBillsColumns = [
  {
    type: "billState",
    prop: "status",
    label: i18n.t('h.state'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.state')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.reject');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    label: i18n.t('h.documentNumber'),
    fixed: false,
    // width: 160,
    width: countTableHeaderWidth(i18n.t('h.documentNumber')),
    showOverflowTooltip: true,
  },
  {
    prop: "date",
    label: i18n.t('h.changeTime'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.changeTime')),
  },
  {
    prop: "staffName",
    label: i18n.t('h.changePerson'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.changePerson')),
  },
  {
    prop: "purchasingRule",
    label: i18n.t('h.orderNumber'),
    fixed: false,
    showOverflowTooltip: true,
    // width: 160,
    width: countTableHeaderWidth(i18n.t('h.orderNumber')),
  },
  {
    prop: "vendorName",
    label: i18n.t('h.supplier'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.supplier')),
    showOverflowTooltip: true,
  },
  {
    prop: "coment",
    label: i18n.t('h.changeDescription'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.changeDescription')),
    showOverflowTooltip: true,
  },
  {
    prop: "goodDetails",
    label: i18n.t('h.formTips45'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.formTips45')),
    showOverflowTooltip: true,
  },
];
export const changeGoodsColumns = [
  {
    prop: "skuName",
    label: i18n.t('h.assetName'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.assetName')),
  },
  {
    prop: "skuType",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "skuUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  // 订货数量
  {
    prop: "frontQuantity",
    label: i18n.t('h.columns35'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns35')),
  },
  // 订单价格
  {
    prop: "price",
    label: i18n.t('h.columns36'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns36')),
  },
  // 订单总额
  {
    prop: "frontAmount",
    label: i18n.t('h.columns37'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns37')),
  },
  // 变更后数量
  {
    prop: "quantity",
    label: i18n.t('h.columns38'),
    fixed: false,
    slotName: "quantity",
    showOverflowTooltip: true,
    minWidth: 160,
  },
  // 变更后金额
  {
    prop: "amount",
    label: i18n.t('h.columns39'),
    fixed: false,
    slotName: "amount",
    showOverflowTooltip: true,
    minWidth: 160,
  },
];
// 采购管理物品申请表头
export const orderGoodsColumns = [
  {
    prop: "assetTemplateName",
    label: i18n.t('h.assetName'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.assetName')),
  },
  {
    prop: "specification",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "measureUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  {
    prop: "price",
    label: i18n.t('h.price'),
    fixed: false,
    showOverflowTooltip: true,
    slotName: "price",
    minWidth: 160,
  },
  {
    prop: "requisitionQuantity",
    label: i18n.t('h.columns29'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns29')),
  },
  // 采购数量
  {
    prop: "quantity",
    label: i18n.t('h.columns30'),
    fixed: false,
    slotName: "quantity",
    showOverflowTooltip: true,
    minWidth: 160,
  },
  {
    prop: "taxRate",
    label: i18n.t('h.columns31'),
    fixed: false,
    showOverflowTooltip: true,
    slotName: "taxRate",
    minWidth: 160,
  },
  {
    prop: "noTaxAmount",
    label: i18n.t('h.columns32'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns32')),
  },
  {
    prop: "amount",
    label: i18n.t('h.columns33'),
    fixed: false,
    showOverflowTooltip: true,
    slotName: "amount",
    minWidth: 160,
  },
  {
    prop: "taxPrint",
    label: i18n.t('h.columns34'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns34')),
  },
  // 申请编号
  {
    prop: "roleRule",
    label: i18n.t('h.applicationNumber'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: 160,
  },
];
// 采购物品单据表头
export const assetsColumns = [
  {
    label: i18n.t('h.action'),
    slotName: "operation",
    width: "100",
    fixed: "left",
    minWidth: countTableHeaderWidth(i18n.t('h.action')),
  },
  {
    prop: "assetTypeName",
    label: i18n.t('h.assetCategory'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.assetCategory')),
  },
  {
    prop: "assetTemplateName",
    label: i18n.t('h.assetName'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.assetName')),
  },
  {
    prop: "specification",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "measureUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  {
    prop: "createdDate",
    label: i18n.t('h.creationTime'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.creationTime')),
  },
  {
    prop: "amount",
    label: i18n.t('h.originalValue'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.originalValue')),
  },
];
// 采购申请单据表格表头
export const requisitionBillsColumns = [
  {
    type: "billState",
    prop: "status",
    label: i18n.t('h.state'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.state')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.reject');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    label: i18n.t('h.applicationNumber'),
    fixed: false,
    // width: 150,
    width: countTableHeaderWidth(i18n.t('h.applicationNumber')),
    showOverflowTooltip: true,
  },
  {
    prop: "date",
    label: i18n.t('h.applicationTime'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.applicationTime')),
  },
  {
    prop: "staffName",
    label: i18n.t('h.applicant'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.applicant')),
  },
  {
    prop: "deptName",
    label: i18n.t('h.applicationDepartment'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.applicationDepartment')),
    showOverflowTooltip: true,
  },
  {
    prop: "receiveAddress",
    label: i18n.t('h.receivingInformation'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.receivingInformation')),
    showOverflowTooltip: true,
  },
  {
    prop: "desireDate",
    label: i18n.t('h.formTips43'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.formTips43')),
    showOverflowTooltip: true,
  },
  {
    prop: "coment",
    label: i18n.t('h.formTips44'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.formTips44')),
    showOverflowTooltip: true,
  },
  {
    prop: "goodDetails",
    label: i18n.t('h.formTips45'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.formTips45')),
    showOverflowTooltip: true,
  },
];
export const requstDetailColumns = [
  {
    prop: "skuName",
    label: i18n.t('h.name'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: 150,
  },
  {
    prop: "skuType",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "skuUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: 100,
  },
  {
    prop: "quantity",
    label: i18n.t('h.columns29'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: 100,
  },
];
// 付款申请单据表头
export const paymentBillsColumns = [
  {
    type: "billState",
    prop: "status",
    label: i18n.t('h.state'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.state')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.reject');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.approved');
        case 1:
          return i18n.t('h.completed');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    label: i18n.t('h.documentNumber'),
    fixed: false,
    // width: 160,
    width: countTableHeaderWidth(i18n.t('h.documentNumber')),
    showOverflowTooltip: true,
  },
  {
    prop: "date",
    label: i18n.t('h.applicationDate'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.applicationDate')),
  },
  {
    prop: "staffName",
    label: i18n.t('h.applicant'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.applicant')),
  },
  {
    prop: "vendorName",
    label: i18n.t('h.supplier'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.supplier')),
    showOverflowTooltip: true,
  },
  {
    prop: "totalAmount",
    label: i18n.t('h.totalPaymentAmount'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.totalPaymentAmount')),
    showOverflowTooltip: true,
  },
  {
    prop: "coment",
    label: i18n.t('h.PaymentInstructions'),
    fixed: false,
    minwidth: countTableHeaderWidth(i18n.t('h.PaymentInstructions')),
    showOverflowTooltip: true,
  },
];
export const paymentGoodsColumns = [
  // 单据编号
  {
    prop: "roleRule",
    label: i18n.t('h.documentNumber'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: 160,
  },
  //  订单总额
  {
    prop: "totalAmount",
    label: i18n.t('h.columns37'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns37')),
  },
  // 已到货
  {
    prop: "arrivalAmount",
    label: i18n.t('h.columns40'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns40')),
  },
  // 未到货
  {
    prop: "noArrivalAmount",
    label: i18n.t('h.columns41'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns41')),
  },
  // 已支付
  {
    prop: "paidAmount",
    label: i18n.t('h.columns42'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns42')),
  },
  // 付款额 1
  {
    prop: "amount",
    label: i18n.t('h.columns43'),
    fixed: false,
    slotName: "amount",
    showOverflowTooltip: true,
    minWidth: 160,
  },
];
// 付款登记单据表头
export const paymentRecordBillsColumns = [
  {
    type: "detail",
    prop: "roleRule",
    label: i18n.t('h.documentNumber'),
    fixed: false,
    // width: 160,
    width: countTableHeaderWidth(i18n.t('h.paymentDate')),
    showOverflowTooltip: true,
  },
  {
    prop: "paidDate",
    label: i18n.t('h.paymentDate'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.paymentDate')),
  },
  {
    prop: "staffName",
    label: i18n.t('h.applicant'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.applicant')),
  },
  {
    prop: "vendorName",
    label: i18n.t('h.supplier'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.supplier')),
    showOverflowTooltip: true,
  },
  {
    prop: "totalAmount",
    label: i18n.t('h.totalPaymentAmount'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.totalPaymentAmount')),
    showOverflowTooltip: true,
  },
  {
    prop: "coment",
    label: i18n.t('h.PaymentInstructions'),
    fixed: false,
    minwidth: countTableHeaderWidth(i18n.t('h.PaymentInstructions')),
    showOverflowTooltip: true,
  },
];
export const paymentRecordGoodsColumns = [
  {
    prop: "roleRule",
    label: i18n.t('h.documentNumber'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: 160,
  },
  //  订单总额
  {
    prop: "totalAmount",
    label: i18n.t('h.columns37'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns37')),
  },
  {
    prop: "paidAmount",
    label: i18n.t('h.columns42'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns42')),
  },
];
// 收货管理单据表头
export const receivingBillsColumns = [
  {
    type: "billState",
    prop: "status",
    label: i18n.t('h.state'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.state')),
    formatter: (row) => {
      switch (row["status"]) {
        case -2:
          return i18n.t('h.reject');
        case -1:
          return i18n.t('h.pending');
        case 0:
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    label: i18n.t('h.documentNumber'),
    fixed: false,
    // width: 160,
    width: countTableHeaderWidth(i18n.t('h.documentNumber')),
    showOverflowTooltip: true,
  },
  {
    prop: "date",
    label: i18n.t('h.deliveryDate'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.deliveryDate')),
  },
  {
    prop: "staffName",
    label: i18n.t('h.consignee'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.consignee')),
  },
  {
    prop: "vendorName",
    label: i18n.t('h.supplier'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.supplier')),
    showOverflowTooltip: true,
  },
  {
    prop: "coment",
    label: i18n.t('h.receivingInstructions'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.receivingInstructions')),
    showOverflowTooltip: true,
  },
  {
    prop: "goodDetails",
    label: i18n.t('h.formTips45'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.formTips45')),
    showOverflowTooltip: true,
  },
];
export const receivingGoodsColumns = [
  {
    prop: "skuName",
    label: i18n.t('h.assetName'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.assetName')),
  },
  {
    prop: "skuType",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "skuUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  // 订货数量 quantity
  {
    prop: "quantity",
    label: i18n.t('h.columns35'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns35')),
  },
  // 到货数量 tatolQuantity 1
  {
    prop: "tatolQuantity",
    label: i18n.t('h.columns44'),
    fixed: false,
    slotName: "tatolQuantity",
    showOverflowTooltip: true,
    minWidth: 160,
  },
  // 单价 price
  {
    prop: "price",
    label: i18n.t('h.price'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.price')),
  },
  // 税率 taxRate 1
  {
    prop: "taxRate",
    label: i18n.t('h.columns31'),
    fixed: false,
    slotName: "taxRate",
    showOverflowTooltip: true,
    minWidth: 160,
  },
  // 扣税额 taxPrint
  {
    prop: "taxPrint",
    label: i18n.t('h.columns45'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns45')),
  },
  // 税后总金额 noTaxAmount
  {
    prop: "noTaxAmount",
    label: i18n.t('h.columns46'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns46')),
  },
  // 总额 amount 1
  {
    prop: "amount",
    label: i18n.t('h.columns47'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: 160,
  },
];
// 物品申请表头
export const applyGoodsColumns = [
  {
    prop: "assetTemplateName",
    label: i18n.t('h.assetName'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.assetName')),
  },
  {
    prop: "specification",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "measureUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  {
    prop: "price",
    label: i18n.t('h.price'),
    fixed: false,
    showOverflowTooltip: true,
    slotName: "price",
    minWidth: countTableHeaderWidth(i18n.t('h.price')),
  },
  {
    prop: "quantity",
    label: i18n.t('h.columns29'),
    fixed: false,
    slotName: "quantity",
    showOverflowTooltip: true,
    minWidth: 150,
  },
  {
    prop: "amount",
    label: i18n.t('h.columns33'),
    fixed: false,
    showOverflowTooltip: true,
    slotName: "amount",
    minWidth: countTableHeaderWidth(i18n.t('h.columns33')),
  },
];
// 供应商表格表头
export const vendorsColumns = [
  {
    prop: "name",
    label: i18n.t('h.supplier'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.supplier')),
  },
  {
    prop: "contacts",
    label: i18n.t('h.formTips48'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips48')),
  },
  {
    prop: "phone",
    label: i18n.t('h.formTips49'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips49')),
  },
  {
    prop: "email",
    label: i18n.t('h.formTips50'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.formTips50')),
  },
  {
    prop: "bankName",
    label: i18n.t('h.formTips53'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.formTips53')),
  },
  {
    prop: "bankAccount",
    label: i18n.t('h.bankAccount'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.bankAccount')),
  },
];
// 生产厂家表格表头
export const manufacturersColumns = [
  {
    prop: "fullName",
    label: i18n.t('h.manufacturerFullName'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.manufacturerFullName')),
  },
  {
    prop: "abbreviation",
    label: i18n.t('h.formTips87'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.formTips87')),
  },
  //  注册编码
  {
    prop: "registrationCode",
    label: i18n.t('h.formTips88'),
    fixed: false,
    showOverflowTooltip: true,
    minWidth: countTableHeaderWidth(i18n.t('h.formTips88')),
  },
  // {
  //   prop: "email",
  //   label: i18n.t('h.formTips50'),
  //   fixed: false,
  //   showOverflowTooltip: true,
  //   minWidth: countTableHeaderWidth(i18n.t('h.formTips50')),
  // },
  // {
  //   prop: "bankName",
  //   label: i18n.t('h.formTips53'),
  //   fixed: false,
  //   showOverflowTooltip: true,
  //   minWidth: countTableHeaderWidth(i18n.t('h.formTips53')),
  // },
  // {
  //   prop: "bankAccount",
  //   label: i18n.t('h.bankAccount'),
  //   fixed: false,
  //   showOverflowTooltip: true,
  //   minWidth: countTableHeaderWidth(i18n.t('h.bankAccount')),
  // },
]
export const filterCondtionData = [
  { value: "IS", label: i18n.t('h.equal') },
  { value: "NIS", label: i18n.t('h.Notequal') },
  { value: "ANDLIKE", label: i18n.t('h.contain') },
];
export const ClassificationStatistics = [
  {
    prop: "sortingName",
    label: i18n.t('h.formTips55'),
    fixed: false,
    showOverflowTooltip: true,
    // width: "250",
    width: countTableHeaderWidth(i18n.t('h.formTips55')),
  },
  {
    prop: "amount",
    label: i18n.t('h.formTips56'),
    fixed: false,
    showOverflowTooltip: true,
    // width: "250",
    width: countTableHeaderWidth(i18n.t('h.formTips56')),
  },
  {
    prop: "money",
    label: i18n.t('h.formTips57'),
    fixed: false,
    showOverflowTooltip: true,
    // width: "200",
    width: countTableHeaderWidth(i18n.t('h.formTips57')),
  },
  {
    prop: "inAmount",
    label: i18n.t('h.formTips58'),
    fixed: false,
    showOverflowTooltip: true,
    // width: "200",
    width: countTableHeaderWidth(i18n.t('h.formTips58')),
  },
  {
    prop: "inMoney",
    label: i18n.t('h.formTips59'),
    fixed: false,
    showOverflowTooltip: true,
    // width: "200",
    width: countTableHeaderWidth(i18n.t('h.formTips59')),
  },
  {
    prop: "outAmount",
    label: i18n.t('h.formTips60'),
    fixed: false,
    showOverflowTooltip: true,
    // width: "250",
    width: countTableHeaderWidth(i18n.t('h.formTips60')),
  },
  {
    prop: "outMoney",
    label: i18n.t('h.formTips61'),
    fixed: false,
    showOverflowTooltip: true,
    // width: "200",
    width: countTableHeaderWidth(i18n.t('h.formTips61')),
  },
];
// 库存管理 调拨 物品明细表头
export const conTransferArticleDetailsColumns = [
  {
    prop: "image",
    type: "image",
    label: i18n.t('h.formTips62'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips62')),
  },
  {
    prop: "code",
    label: i18n.t('h.title166'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title166')),
  },
  {
    prop: "name",
    label: i18n.t('h.formTips38'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips38')),
  },
  {
    prop: "amount",
    label: "*" + i18n.t('h.columns54'),
    fixed: false,
    slotName: "amount",
    showOverflowTooltip: true,
    // width: "190",
    width: countTableHeaderWidth("*" + i18n.t('h.columns54')),
  },
  {
    prop: "price",
    label: i18n.t('h.columns55'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns55')),
  },
  {
    prop: "money",
    label: i18n.t('h.columns56'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns56')),
  },
  {
    prop: "barCode",
    label: i18n.t('h.formTips63'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips63')),
  },
  {
    prop: "specification",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "measureUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  {
    prop: "remark",
    label: i18n.t('h.comment'),
    fixed: false,
    slotName: "remark",
    showOverflowTooltip: true,
    // width: "100",
    width: countTableHeaderWidth(i18n.t('h.comment')),
  },
  {
    prop: "lowerSize",
    label: i18n.t('h.columns57'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns57')),
  },
  {
    prop: "upperSize",
    label: i18n.t('h.columns58'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns58')),
  },
];
// 库存管理 盘点单 盘点结果表头
export const inventoryResultsColumns = [
  {
    prop: "statusName",
    label: i18n.t('h.state'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.state')),
  },
  {
    prop: "image",
    label: i18n.t('h.formTips62'),
    type: "image",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips62')),
  },
  {
    prop: "sortingName",
    label: i18n.t('h.formTips55'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns58')),
  },
  // {
  //   prop: "countedAmount",
  //   label: "已盘数量",
  //   fixed: false,
  //   showOverflowTooltip: true,
  //   width: countTableHeaderWidth("已盘数量"),
  // },
  // {
  //   prop: "countedMoney",
  //   label: "已盘金额",
  //   fixed: false,
  //   showOverflowTooltip: true,
  //   width: countTableHeaderWidth("已盘金额"),
  // },
  // {
  //   prop: "unpackedAmount",
  //   label: "待盘数量",
  //   fixed: false,
  //   showOverflowTooltip: true,
  //   width: countTableHeaderWidth("待盘数量"),
  // },
  // {
  //   prop: "unpackedMoney",
  //   label: "待盘金额",
  //   fixed: false,
  //   showOverflowTooltip: true,
  //   width: countTableHeaderWidth("待盘金额"),
  // },
  // {
  //   prop: "invertoryAmount",
  //   label: "盘亏数量",
  //   fixed: false,
  //   showOverflowTooltip: true,
  //   width: countTableHeaderWidth("盘亏数量"),
  // },
  {
    prop: "code",
    label: i18n.t('h.title166'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title166')),
  },
  {
    prop: "substanceName",
    label: i18n.t('h.formTips38'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips38')),
  },
  {
    prop: "barCode",
    label: i18n.t('h.formTips63'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips63')),
  },
  {
    prop: "specification",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "measureUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  {
    prop: "unpackedAmount",
    label: i18n.t('h.quantityToBeOffered'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.quantityToBeOffered')),
  },
  {
    prop: "price",
    label: i18n.t('h.price'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.price')),
  },
  {
    prop: "unpackedMoney",
    label: i18n.t('h.columns47'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns47')),
  },
  {
    prop: "countedAmount",
    label: i18n.t('h.actualQuantityOffered'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.actualQuantityOffered')),
  },
  {
    prop: "countedMoney",
    label: i18n.t('h.title187'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title187')),
  },
  {
    prop: "inventoryAmount",
    label: i18n.t('h.inventoryLossQuantity'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.inventoryLossQuantity')),
  },
  {
    prop: "remark",
    label: i18n.t('h.title188'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title188')),
  },
  {
    prop: "useDate",
    label: i18n.t('h.title189'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title189')),
  },
  {
    prop: "staffName",
    label: i18n.t('h.inventoryChecker'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.inventoryChecker')),
  },
];
// 库存管理 库存调整 主表格表头
export const adjustferColumns = [
  {
    type: "billState",
    prop: "status",
    label: i18n.t('h.columns48'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns48')),
    formatter: (row) => {
      switch (row["status"]) {
        case "-2":
          return i18n.t('h.rejectBtn');
        case "-1":
          return i18n.t('h.pending');
        case "0":
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    prop: "roleRule",
    label: i18n.t('h.documentNumber'),
    slotName: "roleRule",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.documentNumber')),
  },
  {
    prop: "houseName",
    label: i18n.t('h.formTips79'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips79')),
  },
  {
    prop: "useDate",
    label: i18n.t('h.formTips80'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips80')),
  },
  {
    prop: "staffName",
    label: i18n.t('h.creator'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.creator')),
  },
  {
    prop: "createDate",
    label: i18n.t('h.creationDate'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.creationDate')),
  },
  {
    prop: "remark",
    label: i18n.t('h.columns59'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns59')),
  },
  //   {
  //     label: "调拨明细",
  //     slotName: "detail",
  //     fixed: false,
  //     showOverflowTooltip: true,
  //     width: countTableHeaderWidth("调拨明细--"),
  //   },
];
// 库存管理 库存调整 物品明细表头
export const adjustArticleDetailsColumns = [
  {
    prop: "image",
    type: "image",
    label: i18n.t('h.formTips62'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips62')),
  },
  {
    prop: "code",
    label: i18n.t('h.title166'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title166')),
  },
  {
    prop: "name",
    label: i18n.t('h.formTips38'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips38')),
  },
  {
    prop: "afterAmount",
    label: "*" + i18n.t('h.columns60'),
    fixed: false,
    slotName: "afterAmount",
    showOverflowTooltip: true,
    width: "190",
  },
  {
    prop: "afterPrice",
    label: i18n.t('h.columns61'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns61')),
  },
  {
    prop: "afterMoney",
    label: "*" + i18n.t('h.columns62'),
    fixed: false,
    slotName: "afterMoney",
    showOverflowTooltip: true,
    width: "190",
  },
  {
    prop: "contrastAmount",
    label: i18n.t('h.columns63'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns63')),
  },
  {
    prop: "contrastPrice",
    label: i18n.t('h.columns64'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns64')),
  },
  {
    prop: "contrastMoney",
    label: i18n.t('h.columns65'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns65')),
  },
  {
    prop: "amount",
    label: i18n.t('h.columns66'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns66')),
  },
  {
    prop: "price",
    label: i18n.t('h.columns67'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns67')),
  },
  {
    prop: "money",
    label: i18n.t('h.columns68'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns68')),
  },
  {
    prop: "barCode",
    label: i18n.t('h.formTips63'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips63')),
  },
  {
    prop: "specification",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "measureUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  {
    prop: "remark",
    label: i18n.t('h.comment'),
    fixed: false,
    showOverflowTooltip: true,
    width: "100",
  },
];
//库存出库表头
export const OutboundColumns = [
  {
    type: "billState",
    prop: "status",
    label: i18n.t('h.columns48'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns48')),
    formatter: (row) => {
      switch (row["status"]) {
        case "-2":
          return i18n.t('h.rejectBtn');
        case "-1":
          return i18n.t('h.pending');
        case "0":
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    prop: "typeName",
    label: i18n.t('h.doucmentType'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.doucmentType')),
  },
  {
    prop: "roleRule",
    label: i18n.t('h.title218'),
    slotName: "roleRule",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title218')),
  },
  {
    prop: "houseName",
    label: i18n.t('h.title220'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title220')),
  },
  {
    prop: "useDate",
    label: i18n.t('h.collectionDate'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.collectionDate')),
  },
  {
    prop: "deptName",
    label: i18n.t('h.collectionDepartment'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.collectionDepartment')),
  },
  {
    prop: "useStaffName",
    label: i18n.t('h.recipient'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.recipient')),
  },
  {
    prop: "staffName",
    label: i18n.t('h.formTips67'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips67')),
  },
  {
    prop: "createDate",
    label: i18n.t('h.formTips68'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips68')),
  },
  {
    prop: "remark",
    label: i18n.t('h.columns69'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns69')),
  },
];
//库存出库 物品列表表头
export const outboundDetailsColumns = [
  {
    prop: "image",
    type: "image",
    label: i18n.t('h.formTips62'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips62')),
  },
  {
    prop: "code",
    label: i18n.t('h.title166'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title166')),
  },
  {
    prop: "name",
    label: i18n.t('h.formTips38'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips38')),
  },
  {
    prop: "amount",
    label: "*" + i18n.t('h.number'),
    slotName: "amount",
    fixed: false,
    showOverflowTooltip: true,
    width: "190",
  },
  {
    prop: "price",
    label: i18n.t('h.price'),
    slotName: "price",
    fixed: false,
    showOverflowTooltip: true,
    width: "190",
  },
  {
    prop: "money",
    label: "*" + i18n.t('h.columns47'),
    slotName: "money",
    fixed: false,
    showOverflowTooltip: true,
    width: "100",
  },
  {
    prop: "barCode",
    label: i18n.t('h.formTips63'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips63')),
  },
  {
    prop: "specification",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "sortingName",
    label: i18n.t('h.formTips55'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips55')),
  },
  {
    prop: "measureUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  {
    prop: "remark",
    label: i18n.t('h.comment'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.comment')),
  },
  {
    prop: "lowerSize",
    label: i18n.t('h.columns57'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns57')),
  },
  {
    prop: "upperSize",
    label: i18n.t('h.columns58'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns58')),
  },
];
//库存入库表头
export const inventoryColumns = [
  {
    type: "billState",
    prop: "status",
    label: i18n.t('h.columns48'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns48')),
    formatter: (row) => {
      switch (row["status"]) {
        case "-2":
          return i18n.t('h.rejectBtn');
        case "-1":
          return i18n.t('h.pending');
        case "0":
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    prop: "typeName",
    label: i18n.t('h.doucmentType'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.doucmentType')),
  },
  {
    prop: "roleRule",
    label: i18n.t('h.warehouseEntryNumber'),
    slotName: "roleRule",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.warehouseEntryNumber')),
  },
  {
    prop: "houseName",
    label: i18n.t('h.columns50'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns50')),
  },
  {
    prop: "useDate",
    label: i18n.t('h.formTips80'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips80')),
  },
  {
    prop: "vendName",
    label: i18n.t('h.supplier'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.supplier')),
  },
  {
    prop: "staffName",
    label: i18n.t('h.formTips67'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips67')),
  },
  {
    prop: "createDate",
    label: i18n.t('h.enteringWarehouseDate'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.enteringWarehouseDate')),
  },
  //验收结论
  {
    prop: "acceptanceConclusion",
    label: i18n.t('h.formTips85'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips85')),
  },
  //入库方式
  {
    prop: "receivingMethodId",
    label: i18n.t('h.formTips86'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips86')),
    formatter: (row) => {
      switch (row["receivingMethodId"]) {
        case "58f7fa4784234f4db04fff53ad54b781":
          return i18n.t('h.columns72');
        case "58f7fa4784234f4db04fff53ad54b782":
          return i18n.t('h.columns73');
        case "58f7fa4784234f4db04fff53ad54b783":
          return i18n.t('h.columns74');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    prop: "receiptNumber",
    label: i18n.t('h.title227'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title227')),
  },
  {
    prop: "remark",
    label: i18n.t('h.title228'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title228')),
  },
];
//库存入库 物品列表表头
export const articleDetailsColumns = [
  {
    prop: "image",
    label: i18n.t('h.formTips62'),
    type: "image",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips62')),
  },
  {
    prop: "code",
    label: i18n.t('h.title166'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title166')),
  },
  {
    prop: "name",
    label: i18n.t('h.formTips38'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips38')),
  },
  {
    prop: "amount",
    label: i18n.t('h.formTips58'),
    slotName: "amount",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips58')),
  },
  {
    prop: "price",
    label: "*" + i18n.t('h.title229'),
    slotName: "price",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title229')),
  },
  {
    prop: "money",
    label: "*" + i18n.t('h.formTips59'),
    slotName: "money",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips59')),
  },
  {
    prop: "barCode",
    label: i18n.t('h.formTips63'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips63')),
  },
  {
    prop: "specification",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "sortingName",
    label: i18n.t('h.formTips55'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips55')),
  },
  {
    prop: "measureUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  {
    prop: "remark",
    label: i18n.t('h.comment'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.comment')),
  },
  {
    prop: "lowerSize",
    label: i18n.t('h.columns57'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns57')),
  },
  {
    prop: "upperSize",
    label: i18n.t('h.columns58'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns58')),
  },
];
// 用于库存入库 无操作
export const newItemFileColumns = [
  {
    prop: "code",
    label: i18n.t('h.title166'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title166')),
  },
  {
    prop: "name",
    label: i18n.t('h.formTips38'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips38')),
  },
  {
    prop: "barCode",
    label: i18n.t('h.formTips63'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips63')),
  },
  {
    prop: "sortingName",
    label: i18n.t('h.formTips55'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips55')),
  },
  {
    prop: "logo",
    label: i18n.t('h.title198'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title198')),
  },
  {
    prop: "specification",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "measureUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  {
    prop: "price",
    label: i18n.t('h.columns70'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns70')),
  },
  {
    prop: "lowerSize",
    label: i18n.t('h.columns57'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns57')),
  },
  {
    prop: "upperSize",
    label: i18n.t('h.columns58'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns58')),
  },
  {
    prop: "remark",
    label: i18n.t('h.comment'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.comment')),
  },
  {
    prop: "image",
    label: i18n.t('h.uploadImages'),
    type: "image",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.uploadImages')),
  },
];
//物品档案表格表头
export const itemFileColumns = [
  {
    prop: "code",
    label: i18n.t('h.title166'),
    // label: i18n.t('h.title166up'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title166')),
    // width: countTableHeaderWidth(i18n.t('h.title166up')),
  },
  {
    prop: "status",
    label: i18n.t('h.state'),
    slotName: "status",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.state')),
  },
  {
    prop: "name",
    label: i18n.t('h.formTips38'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips38')),
  },
  {
    prop: "productionDate",
    label: '生产日期',
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth('生产日期'),
  },
  {
    prop: "expirationDate",
    label: '失效日期',
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth('失效日期'),
  },
  {
    prop: "acquisitionStatus",
    label: '是否采集',
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth('是否采集'),
  },
  {
    prop: "barCode",
    label: i18n.t('h.formTips63'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips63')),
  },
  {
    prop: "sorting",
    label: i18n.t('h.formTips55'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips55')),
  },
  {
    prop: "logo",
    label: i18n.t('h.title198'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title198')),
  },
  {
    prop: "specification",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "measureUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  {
    prop: "price",
    label: i18n.t('h.price'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.price')),
  },
  {
    prop: "lowerSize",
    label: i18n.t('h.columns57'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns57')),
  },
  {
    prop: "upperSize",
    label: i18n.t('h.columns58'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns58')),
  },
  {
    prop: "remark",
    label: i18n.t('h.comment'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.comment')),
  },
  {
    prop: "image",
    label: i18n.t('h.uploadImages'),
    type: "image",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.uploadImages')),
  },
  {
    label: i18n.t('h.action'),
    slotName: "operation",
    width: lang == "EN" ? '330' : '220',
    fixed: "right",
  },
];
// 库存管理 调拨||出库||库存调整 选择物品表头
export const conTransferArticleColumns = [
  {
    prop: "image",
    type: "image",
    label: i18n.t('h.formTips62'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips62')),
  },
  {
    prop: "code",
    label: i18n.t('h.title166'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title166')),
  },
  {
    prop: "name",
    label: i18n.t('h.formTips38'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips38')),
  },
  {
    prop: "barCode",
    label: i18n.t('h.formTips63'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips63')),
  },
  {
    prop: "specification",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "measureUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  {
    prop: "amount",
    label: i18n.t('h.number'),
    fixed: false,
    showOverflowTooltip: true,
    // width: "190",
    width: countTableHeaderWidth(i18n.t('h.number')),
  },
  {
    prop: "price",
    label: i18n.t('h.price'),
    fixed: false,
    showOverflowTooltip: true,
    // width: "190",
    width: countTableHeaderWidth(i18n.t('h.price')),
  },
  {
    prop: "money",
    label: i18n.t('h.columns47'),
    fixed: false,
    showOverflowTooltip: true,
    // width: "100",
    width: countTableHeaderWidth(i18n.t('h.columns47')),
  },
  {
    prop: "houseName",
    label: i18n.t('h.formTips54'),
    fixed: false,
    showOverflowTooltip: true,
    // width: "100",
    width: countTableHeaderWidth(i18n.t('h.formTips54')),
  },
  {
    prop: "lowerSize",
    label: i18n.t('h.columns57'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns57')),
  },
  {
    prop: "upperSize",
    label: i18n.t('h.columns58'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns58')),
  },
];
// 库存管理 调拨 主表格表头
export const conTransferColumns = [
  {
    type: "billState",
    prop: "status",
    label: i18n.t('h.columns48'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns48')),
    formatter: (row) => {
      switch (row["status"]) {
        case "3":
          return i18n.t('h.draft');
        case "-2":
          return i18n.t('h.rejectBtn');
        case "-1":
          return i18n.t('h.pending');
        case "0":
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    prop: "roleRule",
    label: i18n.t('h.title173'),
    slotName: "roleRule",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title173')),
  },
  {
    prop: "outHouseName",
    label: i18n.t('h.columns49'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns49')),
  },
  {
    prop: "inHouseName",
    label: i18n.t('h.columns50'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns50')),
  },
  {
    prop: "staffName",
    label: i18n.t('h.columns51'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns51')),
  },
  {
    prop: "createDate",
    label: i18n.t('h.transferDate'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.transferDate')),
  },
  {
    prop: "remark",
    label: i18n.t('h.formTips69'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips69')),
  },
  {
    prop: "useStaffName",
    label: i18n.t('h.columns52'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns52')),
  },
  {
    prop: "useDate",
    label: i18n.t('h.columns53'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns53')),
  },
];
//物资待审核单据
export const articleBillTypes = [
  {
    value: "ALL",
    label: i18n.t('h.allApplicationDocuments'),
  },
  {
    value: "TK",
    label: i18n.t('h.returnToWarehouseApplicationDoucments'),
  },
  {
    value: "RK",
    label: i18n.t('h.stocktakingApplicationDoucments'),
  },
  {
    value: "CK",
    label: i18n.t('h.outboundApplicationDocuments'),
  },
  {
    value: "TZ",
    label: i18n.t('h.adjustmentApplicationDocuments'),
  },
  {
    value: "DB",
    label: i18n.t('h.transferApplicationDocuments'),
  },
];
export const articleApprovalBillsColumns = [
  {
    type: "billState",
    prop: "status",
    label: i18n.t('h.auditStatus'),
    fixed: false,
    // width: "100px",
    width: countTableHeaderWidth(i18n.t('h.auditStatus')),
    formatter: (row) => {
      switch (row["status"]) {
        case "-2":
          return i18n.t('h.reject');
        case "-1":
          return i18n.t('h.pending');
        case "0":
          return i18n.t('h.agree');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    type: "detail",
    prop: "roleRule",
    label: i18n.t('h.doucmentNo'),
    fixed: false,
    // width: "180px",
    width: countTableHeaderWidth(i18n.t('h.doucmentNo')),
    showOverflowTooltip: true,
  },
  {
    prop: "type",
    label: i18n.t('h.doucmentType'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentType')),
    formatter: (row) => {
      if (row) {
        switch (row["roleRule"].slice(0, 3)) {
          case "CIS":
            return i18n.t('h.title222');
          case "CRE":
            return i18n.t('h.title223');
          case "CYS":
            return i18n.t('h.title224');
          case "CTR":
            return i18n.t('h.title230');
          case "CAS":
            return i18n.t('h.title231');
          default:
            return i18n.t('h.errorCode');
        }
        //   switch (row["type"]) {
        //   case "0":
        //     return i18n.t('h.title222');
        //   case "1":
        //     return i18n.t('h.title223');
        //   case "2":
        //     return i18n.t('h.title224');
        //   default:
        //     return i18n.t('h.errorCode');
        // }
      }
    },
  },
  // {
  //   prop: "deptName",
  //   label: "申请部门",
  //   fixed: false,
  //   width: countTableHeaderWidth("申请部门"),
  //   showOverflowTooltip: true,
  // },
  {
    prop: "createDate",
    label: i18n.t('h.applicationDate'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.applicationDate')),
    showOverflowTooltip: true,
  },
  {
    prop: "staffName",
    label: i18n.t('h.applicant'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.applicant')),
    showOverflowTooltip: true,
  },
  {
    prop: "materialNames",
    label: i18n.t('h.title232'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.title232')),
    showOverflowTooltip: true,
  },
];
export const articleDeletePendingErrorColumns = [
  {
    prop: "status",
    label: i18n.t('h.auditStatus'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.auditStatus')),
    showOverflowTooltip: true,
    formatter: () => {
      return i18n.t('h.title233');
    },
  },
  {
    prop: "type",
    label: i18n.t('h.doucmentType'),
    fixed: false,
    width: countTableHeaderWidth(i18n.t('h.doucmentType')),
    formatter: (row) => {
      switch (row["type"]) {
        case "TK":
          return i18n.t('h.title234');
        case "RK":
          return i18n.t('h.title235');
        case "CK":
          return i18n.t('h.title236');
        case "TZ":
          return i18n.t('h.title237');
        case "DB":
          return i18n.t('h.title238');
        default:
          return i18n.t('h.errorCode');
      }
    },
  },
  {
    prop: "reason",
    label: i18n.t('h.reasonForFailure'),
    fixed: false,
    minWidth: countTableHeaderWidth(i18n.t('h.reasonForFailure')),
    showOverflowTooltip: true,
  },
];
// 库存管理 物品列表 主表格表头
export const articleListColumns = [
  {
    prop: "image",
    label: i18n.t('h.formTips62'),
    type: "image",
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips62')),
  },
  {
    prop: "code",
    label: i18n.t('h.title166'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title166')),
  },
  {
    prop: "name",
    label: i18n.t('h.formTips38'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips38')),
  },
  {
    prop: "sortingName",
    label: i18n.t('h.categoryName'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.categoryName')),
  },
  {
    prop: "barCode",
    label: i18n.t('h.formTips63'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips63')),
  },
  {
    prop: "specification",
    label: i18n.t('h.columns27'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns27')),
  },
  {
    prop: "logo",
    label: i18n.t('h.title198'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.title198')),
  },
  {
    prop: "measureUnit",
    label: i18n.t('h.columns28'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns28')),
  },
  {
    prop: "houseName",
    label: i18n.t('h.formTips54'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.formTips54')),
  },
  {
    prop: "amount",
    label: i18n.t('h.number'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.number')),
  },
  {
    prop: "price",
    label: i18n.t('h.price'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.price')),
  },
  {
    prop: "money",
    label: i18n.t('h.columns47'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns47')),
  },
  {
    prop: "lowerSize",
    label: i18n.t('h.columns57'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns57')),
  },
  {
    prop: "upperSize",
    label: i18n.t('h.columns58'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.columns58')),
  },
  {
    prop: "remark",
    label: i18n.t('h.comment'),
    fixed: false,
    showOverflowTooltip: true,
    width: countTableHeaderWidth(i18n.t('h.comment')),
  },
];
export function articleOutboundTkDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: i18n.t('h.doucmentNo') },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: i18n.t('h.department') },
    { span: 5, class: "col-content", val: val.deptName },
    { span: 3, class: "col-title", val: i18n.t('h.formTips67') },
    { span: 5, class: "col-content", val: val.staffName },
    { span: 3, class: "col-title", val: i18n.t('h.recipient') },
    { span: 5, class: "col-content", val: val.useStaffName },
    { span: 3, class: "col-title", val: i18n.t('h.creationDate') },
    { span: 5, class: "col-content", val: val.createDate },
    { span: 3, class: "col-title", val: i18n.t('h.comment') },
    { span: 5, class: "col-content", val: val.remark },
  ];
}
export function articleWarehousingDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: i18n.t('h.doucmentNo') },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: i18n.t('h.department') },
    { span: 5, class: "col-content", val: val.deptName },
    { span: 3, class: "col-title", val: i18n.t('h.formTips67') },
    { span: 5, class: "col-content", val: val.staffName },
    { span: 3, class: "col-title", val: i18n.t('h.supplier') },
    { span: 5, class: "col-content", val: val.vendName },
    { span: 3, class: "col-title", val: i18n.t('h.creationDate') },
    { span: 5, class: "col-content", val: val.createDate },
    { span: 3, class: "col-title", val: i18n.t('h.comment') },
    { span: 5, class: "col-content", val: val.remark },
  ];
}
export function articleOutboundCkDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: i18n.t('h.doucmentNo') },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: i18n.t('h.department') },
    { span: 5, class: "col-content", val: val.deptName },
    { span: 3, class: "col-title", val: i18n.t('h.formTips67') },
    { span: 5, class: "col-content", val: val.staffName },
    { span: 3, class: "col-title", val: i18n.t('h.recipient') },
    { span: 5, class: "col-content", val: val.useStaffName },
    { span: 3, class: "col-title", val: i18n.t('h.creationDate') },
    { span: 5, class: "col-content", val: val.createDate },
    { span: 3, class: "col-title", val: i18n.t('h.comment') },
    { span: 5, class: "col-content", val: val.remark },
  ];
}
export function articleInventoryAdjustmentDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: i18n.t('h.doucmentNo') },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: i18n.t('h.formTips54') },
    { span: 5, class: "col-content", val: val.houseName },
    { span: 3, class: "col-title", val: i18n.t('h.formTips67') },
    { span: 5, class: "col-content", val: val.staffName },
    { span: 3, class: "col-title", val: i18n.t('h.creationDate') },
    { span: 5, class: "col-content", val: val.createDate },
    { span: 3, class: "col-title", val: i18n.t('h.title239') },
    { span: 5, class: "col-content", val: val.useDate },
    { span: 3, class: "col-title", val: i18n.t('h.comment') },
    { span: 5, class: "col-content", val: val.remark },
  ];
}
export function articleConTransferDetailCell(val) {
  return [
    { span: 3, class: "col-title", val: i18n.t('h.doucmentNo') },
    { span: 5, class: "col-content", val: val.roleRule },
    { span: 3, class: "col-title", val: i18n.t('h.formTips64') },
    { span: 5, class: "col-content", val: val.outHouseName },
    { span: 3, class: "col-title", val: i18n.t('h.formTips65') },
    { span: 5, class: "col-content", val: val.inHouseName },
    { span: 3, class: "col-title", val: i18n.t('h.formTips67') },
    { span: 5, class: "col-content", val: val.staffName },
    { span: 3, class: "col-title", val: i18n.t('h.creationDate') },
    { span: 5, class: "col-content", val: val.createDate },
    { span: 3, class: "col-title", val: i18n.t('h.title239') },
    { span: 5, class: "col-content", val: val.useDate },
    { span: 3, class: "col-title", val: i18n.t('h.comment') },
    { span: 5, class: "col-content", val: val.remark },
  ];
}