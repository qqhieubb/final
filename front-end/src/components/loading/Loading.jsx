import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loading = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48, color: "#1890ff" }} spin />;

  return (
    <div className="loading-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin indicator={antIcon} />
    </div>
  );
};

export default Loading;
