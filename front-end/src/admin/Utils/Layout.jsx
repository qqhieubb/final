import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";


const { Sider, Content } = Layout;

const CustomLayout = ({ children }) => {
  return (
    <Layout className="dashboard-admin">
      <Sider
        width={250}
        className="sidebar"
        style={{ backgroundColor: "#001529", color: "#fff" }}
      >
        <Sidebar />
      </Sider>
      <Layout>
        <Content className="content" style={{ padding: '24px', minHeight: '100vh', backgroundColor: "#f0f2f5" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
