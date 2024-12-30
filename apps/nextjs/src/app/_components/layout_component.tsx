"use client";

import { createElement, useState } from "react";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/navigation";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BarChartOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Space, theme, Typography } from "antd";
import { AuthShowcase } from "./auth-showcase";

const { Text } = Typography;

const { Header, Sider, Content } = Layout;

function LayoutComponent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} hidden={false}>
        <div
          className={`flex gap-4 p-5 text-white ${
            collapsed && "justify-center"
          }`}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {createElement(collapsed ? ArrowRightOutlined : ArrowLeftOutlined, {
            className: "trigger",
          })}
          {!collapsed && <Text className="text-white">Close</Text>}
        </div>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          // defaultSelectedKeys={[breadCrumb?.key ?? "/"]}
          onClick={(e) => router.push(e.key)}
          items={[
            {
              key: "/",
              icon: <BarChartOutlined />,
              label: "Home",
            },
            {
              key: "/userTable",
              icon: <UserOutlined />,
              label: "User Table",
            },
            {
              key: "/gradingTemplates",
              icon: <VideoCameraOutlined />,
              label: "Grading Templates",
            },
            {
              key: "/pieceCounting",
              icon: <UploadOutlined />,
              label: "Piece Counting",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0px 32px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            {/* <div>
                  <Image src={Logo} alt="company logo" />
                </div> */}
            <Text>HSCo Company</Text>
          </Space>
          {/* <Space>
                <Text>{user?.username}</Text>
                <UserButton />
              </Space> */}
        </Header>
        {/* <BreadCrumbs /> */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflow: "scroll",
          }}
        >
          {/* {isSignedIn ? (
                <CheckForAdmin key={"wrapper"}>{children}</CheckForAdmin>
              ) : (
                {children}
              )} */}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default LayoutComponent;
