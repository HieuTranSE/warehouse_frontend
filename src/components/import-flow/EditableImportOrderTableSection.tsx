import React, { useEffect, useState } from "react";
import { Input, Alert, TablePaginationConfig, Card, Table } from "antd";
import { usePaginationViewTracker } from "@/hooks/usePaginationViewTracker";

export interface ImportOrderDetailRow {
  itemId: number;
  itemName: string;
  expectQuantity: number;
  orderedQuantity: number;
  plannedQuantity: number;
  actualQuantity: number;
  importRequestProviderId: number;
}

export interface ProviderOption {
  id: number;
  name: string;
}

interface EditableImportOrderTableSectionProps {
  data: ImportOrderDetailRow[];
  onChange: (rows: ImportOrderDetailRow[]) => void;
  loading?: boolean;
  title?: string;
  emptyText?: string;
  alertNode?: React.ReactNode;
  excelImported?: boolean;
  setIsAllPagesViewed?: (value: boolean) => void;
}

const EditableImportOrderTableSection: React.FC<EditableImportOrderTableSectionProps> = ({
  data,
  onChange,
  loading,
  title,
  emptyText,
  setIsAllPagesViewed,
}) => {

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: data.length,
  });

  const { allPagesViewed } = usePaginationViewTracker(
    data.length,
    pagination.pageSize,
    pagination.current
  );

  useEffect(() => {
    if (allPagesViewed) {
      setIsAllPagesViewed?.(true);
    } else {
      setIsAllPagesViewed?.(false);
    }
  }, [allPagesViewed, setIsAllPagesViewed]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      ...pagination,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    });
  };


  const handlePlannedQuantityChange = (value: number | null, record: ImportOrderDetailRow) => {
    const newData = data.map(row =>
      row.itemId === record.itemId ? { ...row, plannedQuantity: value ?? 0 } : row
    );
    onChange(newData);
  };

  const columns = [
    {
      width: "12%",
      title: "Mã hàng",
      dataIndex: "itemId",
      key: "itemId",
      render: (id: number) => `#${id}`,
      align: "left" as const,
      onHeaderCell: () => ({
        style: { textAlign: 'center' as const }
      }),
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
      title: "Đã lên đơn",
      dataIndex: "orderedQuantity",
      key: "orderedQuantity",
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
      }),
      render: (_: any, record: ImportOrderDetailRow) => {
        let maxAllowed = 0;
        if (record.actualQuantity === 0) {
          maxAllowed = record.expectQuantity - record.orderedQuantity;
        }
        else {
          maxAllowed = record.expectQuantity - record.actualQuantity;
        }
        const isInvalid = record.plannedQuantity > maxAllowed;
        return (
          <Input
            inputMode="numeric"
            pattern="[0-9]*"
            max={maxAllowed}
            value={record.plannedQuantity}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '');
              handlePlannedQuantityChange(val ? Number(val) : 0, record);
            }}
            style={{ textAlign: 'right', width: 100, color: 'blue' }}
            status={isInvalid ? 'error' : undefined}
          />
        );
      },
    },
  ];

  // Tổng hợp lỗi
  const invalidRows = data
    .map((row, idx) => {
      let maxAllowed = 0;
      if (row.actualQuantity === 0) {
        maxAllowed = row.expectQuantity - row.orderedQuantity;
      }
      else {
        maxAllowed = row.expectQuantity - row.actualQuantity;
      }
      if (row.plannedQuantity > maxAllowed) {
        return `Dòng ${idx + 1}: Số lượng nhập vượt quá cho phép (tối đa ${maxAllowed})`;
      }

      if (row.plannedQuantity < 0) {
        return `Dòng ${idx + 1}: Số lượng nhập phải lớn hơn hoặc bằng 0`;
      }
      return null;
    })
    .filter(Boolean);

  const validationAlertNode = invalidRows.length > 0 ? (
    <Alert
      type="error"
      showIcon
      message="Có lỗi trong bảng nhập liệu:"
      description={
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {invalidRows.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      }
      style={{ marginBottom: 16 }}
    />
  ) : null;

  return (
    <Card title={title!}>
      {validationAlertNode}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="itemId"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          locale: {
            items_per_page: "/ trang"
          },
          showTotal: (total: number) => `Tổng ${total} mục`,
          hideOnSinglePage: true,
        }}
        locale={{ emptyText: emptyText || "Không có dữ liệu" }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default EditableImportOrderTableSection;
