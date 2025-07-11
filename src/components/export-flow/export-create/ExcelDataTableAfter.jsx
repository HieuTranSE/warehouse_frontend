import React from "react";
import { Table } from "antd";
import PropTypes from "prop-types";
import { InfoCircleFilled } from "@ant-design/icons";

/**
 * Gộp số lượng các dòng có cùng itemId & providerId
 */
function getConsolidatedData(data = []) {
  const grouped = {};
  data.forEach((row) => {
    // Nếu không có providerId (với các loại xuất không phải RETURN) thì chỉ group theo itemId
    const key = row.providerId
      ? `${row.itemId}-${row.providerId}`
      : `${row.itemId}`;
    if (grouped[key]) {
      grouped[key] = {
        ...grouped[key],
        quantity:
          Number(grouped[key].quantity || 0) + Number(row.quantity || 0),
      };
    } else {
      grouped[key] = { ...row };
    }
  });
  return Object.values(grouped);
}

const ExcelDataTableAfter = ({
  data,
  exportType,
  items = [],
  providers = [],
  pagination = { pageSize: 10 },
  onPaginationChange,
}) => {
  // ✅ ĐƠN GIẢN HÓA: Lấy provider đầu tiên trong mảng cho RETURN type
  const getProviderNameForReturn = () => {
    if (exportType === "RETURN" && providers.length > 0) {
      return providers[0].name || "";
    }
    return "";
  };

  // Helper lấy tên item (nếu thiếu trong record)
  const getItemName = (record) => {
    return (
      record.itemName ||
      items.find((i) => String(i.id) === String(record.itemId))?.name ||
      "Không xác định"
    );
  };

  // Helper lấy các thông tin từ items
  const getItemInfo = (record, field) => {
    const itemMeta = items.find((i) => String(i.id) === String(record.itemId));
    return record[field] || itemMeta?.[field] || "";
  };

  // ✅ ĐƠN GIẢN HÓA: Không cần sort vì chỉ có 1 provider
  const consolidatedData = React.useMemo(
    () => getConsolidatedData(data),
    [data]
  );

  // Cột động giống logic ExcelDataTable
  const columns = [
    {
      width: "12%",
      title: "Mã hàng",
      dataIndex: "itemId",
      key: "itemId",
      render: (text) => <div>{text}</div>,
    },
    {
      width: "16%",
      title: "Tên hàng",
      dataIndex: "itemName",
      key: "itemName",
      render: (_, record) => <span>{getItemName(record)}</span>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: "9%",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      width: "12%",
      title: <span className="font-semibold">Đơn vị tính</span>,
      dataIndex: "unitType",
      key: "unitType",
      onHeaderCell: () => ({
        style: { textAlign: "center" },
      }),
      render: (_, record) => (
        <span style={{ display: "block", textAlign: "center" }}>
          {getItemInfo(record, "unitType")}
        </span>
      ),
    },
    {
      width: "18%",
      title: <span className="font-semibold">Quy cách</span>,
      dataIndex: "specification",
      key: "specification",
      align: "center",
      onHeaderCell: () => ({
        style: { textAlign: "center" },
      }),
      render: (_, record) => {
        const measurementValue = getItemInfo(record, "measurementValue");
        const measurementUnit = getItemInfo(record, "measurementUnit");
        const unitType = getItemInfo(record, "unitType");
        return (
          <span>
            {measurementValue} {measurementUnit} / {unitType}
          </span>
        );
      },
    },
    // Điều kiện column Quy cách cho các loại đặc biệt
    ["PRODUCTION", "BORROWING", "LIQUIDATION"].includes(exportType)
      ? {
          title: "Quy cách",
          dataIndex: "measurementValue",
          key: "measurementValue",
          render: (text) => <span>{text || ""}</span>,
        }
      : null,
    // ✅ ĐƠN GIẢN HÓA: Nhà cung cấp cho RETURN - hiển thị cùng 1 tên cho tất cả rows
    exportType === "RETURN"
      ? {
          width: "35%",
          title: "Nhà cung cấp",
          dataIndex: "providerName",
          key: "providerName",
          render: () => <span>{getProviderNameForReturn()}</span>,
          // ✅ BỎ: onCell rowSpan vì không cần thiết nữa
        }
      : null,
  ].filter(Boolean);

  return (
    <>
      {/* Thông tin xuất kho */}
      <div
        style={{
          backgroundColor: "#e6f7ff",
          border: "1px solid #91d5ff",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          <InfoCircleFilled
            style={{ color: "#1677ff", fontSize: 22, marginRight: 8 }}
          />
          Thông tin xuất kho
        </div>
        <div style={{ marginTop: 4 }}>
          Tổng số mặt hàng xuất: {consolidatedData.length}
          {/* ✅ THÊM: Hiển thị thông tin nhà cung cấp */}
          {exportType === "RETURN" && providers.length > 0 && (
            <div style={{ marginTop: 4, fontSize: 14, color: "#666" }}>
              Nhà cung cấp: <strong>{getProviderNameForReturn()}</strong>
            </div>
          )}
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={consolidatedData}
        rowKey={(record, idx) =>
          exportType === "RETURN"
            ? `${record.itemId}-${idx}`
            : String(record.itemId)
        }
        pagination={pagination.total > pagination.pageSize ? pagination : false}
        onChange={onPaginationChange}
      />
    </>
  );
};

ExcelDataTableAfter.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      itemName: PropTypes.string,
      quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      measurementValue: PropTypes.string,
      providerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      providerName: PropTypes.string,
      measurementUnit: PropTypes.string,
      unitType: PropTypes.string,
    })
  ).isRequired,
  exportType: PropTypes.string.isRequired,
  items: PropTypes.array,
  providers: PropTypes.array,
  pagination: PropTypes.object,
  onPaginationChange: PropTypes.func,
};

export default ExcelDataTableAfter;
