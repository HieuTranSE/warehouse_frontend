import React from "react";
import * as XLSX from "xlsx";
import { Button } from "antd";
import PropTypes from "prop-types";

const DownloadTemplateButton = ({ exportType }) => {
  const handleDownload = () => {
    let template = [];
    if (exportType === "SELLING") {
      template = [
        {
          itemId: "{Mã hàng}",
          quantity: "{Số lượng - Ví dụ: 10}",
        },
      ];
    } else if (exportType === "RETURN") {
      template = [
        {
          itemId: "{Mã hàng}",
          quantity: "{Số lượng - Ví dụ: 10}",
          providerId: "{Mã Nhà cung cấp}",
        },
      ];
    } else {
      // Các loại khác để sau, hiện tại default theo SELLING
      template = [
        {
          itemId: "{Mã hàng}",
          quantity: "{Số lượng - Ví dụ: 10}",
        },
      ];
    }

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "export_request_template.xlsx");
  };

  return (
    <Button onClick={handleDownload} type="dashed">
      Tải file mẫu
    </Button>
  );
};

DownloadTemplateButton.propTypes = {
  exportType: PropTypes.string.isRequired,
};

export default DownloadTemplateButton;
