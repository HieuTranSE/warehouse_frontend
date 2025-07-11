import React, { useEffect, useState } from "react";
import { Modal, Typography, Descriptions, Table, Checkbox, TablePaginationConfig } from "antd";
import dayjs from "dayjs";
import { ImportOrderDetailRow } from "./EditableImportOrderTableSection";
import { usePaginationViewTracker } from "../../hooks/usePaginationViewTracker";
import { useScrollViewTracker } from "@/hooks/useScrollViewTracker";

interface ImportOrderConfirmModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  confirmLoading?: boolean;
  formData: {
    dateReceived: string;
    timeReceived: string;
    note?: string;
    importRequestId: string | null;
  };
  details: ImportOrderDetailRow[];
  importRequestProvider?: string;
}

const ImportOrderConfirmModal: React.FC<ImportOrderConfirmModalProps> = ({
  open,
  onOk,
  onCancel,
  confirmLoading,
  formData,
  details,
  importRequestProvider,
}) => {
  const [confirmCreateImportOrderChecked, setConfirmCreateImportOrderChecked] = useState(false);

  // ===== OLD PAGINATION TRACKER CODE (COMMENTED) =====
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 5,
  //   total: details.length,
  // });

  // const { allPagesViewed, markPageAsViewed, resetViewedPages } = usePaginationViewTracker(
  //   details.length,
  //   pagination.pageSize,
  //   pagination.current
  // );

  // const handleTableChange = (newPagination: TablePaginationConfig) => {
  //   setPagination({
  //     ...pagination,
  //     current: newPagination.current || 1,
  //     pageSize: newPagination.pageSize || 5,
  //   });
  //   if (newPagination.current) {
  //     markPageAsViewed(newPagination.current);
  //   }
  // };

  // useEffect(() => {
  //   if (!open) {
  //     setPagination({
  //       current: 1,
  //       pageSize: 5,
  //       total: details.length,
  //     });
  //     setConfirmCreateImportOrderChecked(false);
  //     resetViewedPages(1);
  //   }
  // }, [open, details.length, resetViewedPages]);
  // ===== END OLD PAGINATION TRACKER CODE =====

  // ===== NEW SCROLL TRACKER CODE =====
  const { scrollContainerRef, checkScrollPosition, hasScrolledToBottom, resetScrollTracking } = useScrollViewTracker(5);

  useEffect(() => {
    if (!open) {
      resetScrollTracking();
      setConfirmCreateImportOrderChecked(false);
    }
  }, [open]);

  const columns = [
    {
      title: "Mã hàng",
      dataIndex: "itemId",
      key: "itemId",
      align: "right" as const,
      onHeaderCell: () => ({
        style: { textAlign: 'center' as const }
      }),
      render: (id: number) => `#${id}`
    },
    {
      width: "30%",
      title: "Tên hàng",
      dataIndex: "itemName",
      key: "itemName",
      onHeaderCell: () => ({
        style: { textAlign: 'center' as const }
      }),
    },
    {
      title: "Dự nhập theo phiếu",
      dataIndex: "expectQuantity",
      key: "expectQuantity",
      align: "right" as const,
      onHeaderCell: () => ({
        style: { textAlign: 'center' as const }
      }),
    },
    {
      title: "Thực tế đã nhập",
      dataIndex: "actualQuantity",
      key: "actualQuantity",
      align: "right" as const,
      onHeaderCell: () => ({
        style: { textAlign: 'center' as const }
      }),
    },
    {
      title: "Dự nhập đơn này",
      dataIndex: "plannedQuantity",
      key: "plannedQuantity",
      align: "right" as const,
      onHeaderCell: () => ({
        style: { textAlign: 'center' as const }
      })
    }
  ];

  const formattedDate = formData.dateReceived
    ? dayjs(formData.dateReceived).format("DD-MM-YYYY")
    : "-";

  return (
    <Modal
      title={<Typography.Title level={4}>Xác nhận thông tin đơn nhập kho</Typography.Title>}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Xác nhận tạo đơn nhập"
      cancelText="Hủy"
      confirmLoading={confirmLoading}
      width={960}
      maskClosable={false}
      okButtonProps={{ disabled: !confirmCreateImportOrderChecked, danger: false }}
    >
      <Descriptions bordered column={2} size="small" labelStyle={{ fontWeight: "bold" }} style={{ marginBottom: 24 }} className="[&_.ant-descriptions-view]:!border-gray-400 [&_.ant-descriptions-view_table]:!border-gray-400 [&_.ant-descriptions-view_table_th]:!border-gray-400 [&_.ant-descriptions-view_table_td]:!border-gray-400 [&_.ant-descriptions-row]:!border-gray-400">
        <Descriptions.Item label="Mã phiếu nhập">#{formData.importRequestId}</Descriptions.Item>
        <Descriptions.Item label="Nhà cung cấp (theo phiếu nhập)">{importRequestProvider || "-"}</Descriptions.Item>
        <Descriptions.Item label="Ngày nhận hàng">{formattedDate}</Descriptions.Item>
        <Descriptions.Item label="Giờ nhận hàng">{formData.timeReceived || "-"}</Descriptions.Item>
        <Descriptions.Item label="Ghi chú" span={2}>{formData.note || "-"}</Descriptions.Item>
      </Descriptions>
      <Typography.Title level={5} style={{ marginBottom: 12 }}>Danh sách hàng hóa nhập kho</Typography.Title>
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollPosition}
        style={{ height: "350px", overflowY: "auto" }}
      >
        <Table
          columns={columns}
          dataSource={details}
          rowKey={(record) => `${record.itemId}`}
          // pagination={{
          //   current: pagination.current,
          //   pageSize: pagination.pageSize,
          //   total: details.length,
          //   showTotal: (total) => `Tổng ${total} mục`,
          //   hideOnSinglePage: true,
          // }}
          // onChange={handleTableChange}
          pagination={false}
          size="small"
          bordered
          className="[&_.ant-table-cell]:!border-gray-400 [&_.ant-table-thead>tr>th]:!border-gray-400 [&_.ant-table-tbody>tr>td]:!border-gray-400 [&_.ant-table-container]:!border-gray-400"
        />
      </div>
      <Checkbox
        checked={confirmCreateImportOrderChecked}
        onChange={e => setConfirmCreateImportOrderChecked(e.target.checked)}
        style={{ marginTop: 8, fontSize: 14, fontWeight: "bold" }}
        disabled={!hasScrolledToBottom}
      >
        Tôi xác nhận đơn nhập trên đúng số lượng và đồng ý tạo.
        {!hasScrolledToBottom && <span style={{ color: 'red', marginLeft: 8 }}>(Vui lòng xem hết trang)</span>}
      </Checkbox>
    </Modal>
  );
};

export default ImportOrderConfirmModal;
