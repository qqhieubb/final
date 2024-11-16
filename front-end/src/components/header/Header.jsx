import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Typography, Button, Space, Badge, Drawer } from "antd";
import { HomeOutlined, BookOutlined, InfoCircleOutlined, UserOutlined, LoginOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useCart } from "../../context/CartContext";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = ({ isAuth, user }) => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const cartCount = cartItems.length;

  // Open/close the drawer
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  // Remove item from cart
  const handleRemoveItem = (courseId) => {
    removeFromCart(courseId);
  };

const handlePayment = async () => {
  try {
    const orderResponse = await fetch("http://localhost:5000/api/order-courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        courseIds: cartItems.map((item) => item._id),
      }),
    });

    if (!orderResponse.ok) {
      throw new Error("Order API call failed");
    }

    const orderData = await orderResponse.json();
    const orderId = orderData.order_id;

    const paymentResponse = await fetch("http://localhost:5000/api/payment-courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        userId: user._id,
      }),
    });

    if (!paymentResponse.ok) {
      throw new Error("Payment API call failed");
    }

    clearCart(); // Clear all items from cart at once

    const paymentData = await paymentResponse.json();
    const { url } = paymentData;

    window.location.href = url;
  } catch (error) {
    console.error(error);
    alert("An error occurred during the payment process.");
  }
};


  const sendEmailInstructor = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/become_instructor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          from: user.email
        }),
      });

      // Check if payment API was successful
      if (!res.ok) {
        throw new Error("Send require failure");
      }
    } catch (error) {
      // Handle errors (e.g., network issues, API failures)
      console.error(error);
      alert("An error occurred during the payment process.");
    }
  };

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 50px",
        backgroundColor: "#001529",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo Section */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            E-Learning
          </Link>
        </Title>
      </div>

      {/* Menu Items */}
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]} style={{ backgroundColor: "transparent", flex: 2 }}>
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/" style={{ color: "#fff", fontWeight: "500" }}>Home</Link>
        </Menu.Item>
        <Menu.Item key="courses" icon={<BookOutlined />}>
          <Link to="/courses" style={{ color: "#fff", fontWeight: "500" }}>Courses</Link>
        </Menu.Item>
        <Menu.Item key="about" icon={<InfoCircleOutlined />}>
          <Link to="/about" style={{ color: "#fff", fontWeight: "500" }}>About</Link>
        </Menu.Item>
      </Menu>

      {user.role === "User" && <Button
        type="primary"
        shape="round"
        style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
        onClick={sendEmailInstructor}
      >
        Become A Instructor
      </Button>}
      {/* Cart and Auth Buttons */}
      <Space>
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          shape="round"
          style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
          onClick={showDrawer}
        >
          <Badge count={cartCount} showZero />
        </Button>

        {isAuth ? (
          <Button type="primary" icon={<UserOutlined />} shape="round" style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}>
            <Link to="/account" style={{ color: "#fff" }}>Account</Link>
          </Button>
        ) : (
          <Button type="primary" icon={<LoginOutlined />} shape="round" style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}>
            <Link to="/login" style={{ color: "#fff" }}>Login</Link>
          </Button>
        )}
      </Space>

      {/* Drawer for Cart */}
      <Drawer
        title="Your Cart"
        placement="right"
        visible={drawerVisible}
        onClose={onClose}
        width={350}
      >
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
              <span>{item.title}</span>
              <span>${item.price}</span>
            </div>
          ))
        )}
        {cartItems.length > 0 && (
          <Button
            type="primary"
            onClick={handlePayment}
            style={{ width: "100%", marginTop: "10px" }}
          >
            Proceed to Payment
          </Button>
        )}
      </Drawer>

    </AntHeader>
  );
};

export default Header;
