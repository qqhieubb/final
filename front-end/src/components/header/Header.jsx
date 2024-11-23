// src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Typography, Button, Badge, Drawer, message } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, BookOutlined, InfoCircleOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { useCart } from '../../context/CartContext';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = ({ isAuth, user }) => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cartCount = cartItems.length;

  const showDrawer = () => setDrawerVisible(true);
  const onClose = () => setDrawerVisible(false);

  const handleRemoveItem = (courseId) => {
    removeFromCart(courseId);
    message.success('Removed from cart.');
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      message.warning('Your cart is empty.');
      return;
    }

    setIsLoading(true);
    try {
      const orderResponse = await fetch('http://localhost:5000/api/order-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          courseIds: cartItems.map((item) => item._id),
        }),
      });

      if (!orderResponse.ok) throw new Error('Order failed.');

      const orderData = await orderResponse.json();
      const { order_id } = orderData;

      const paymentResponse = await fetch('http://localhost:5000/api/payment-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order_id, userId: user._id }),
      });

      if (!paymentResponse.ok) throw new Error('Payment failed.');

      clearCart();
      const paymentData = await paymentResponse.json();
      window.location.href = paymentData.url;
    } catch (error) {
      message.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AntHeader style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
      <Title level={3} style={{ color: '#fff', margin: 0 }}>
        <Link to="/" style={{ color: '#fff' }}>E-Learning</Link>
      </Title>

      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="courses" icon={<BookOutlined />}>
          <Link to="/courses">Courses</Link>
        </Menu.Item>
        <Menu.Item key="about" icon={<InfoCircleOutlined />}>
          <Link to="/about">About</Link>
        </Menu.Item>
      </Menu>

      <div>
        <Button type="primary" shape="round" icon={<ShoppingCartOutlined />} onClick={showDrawer}>
          <Badge count={cartCount} />
        </Button>
        {isAuth ? (
          <Button type="primary" shape="round" icon={<UserOutlined />}>
            <Link to="/account">Account</Link>
          </Button>
        ) : (
          <Button type="primary" shape="round" icon={<LoginOutlined />}>
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>

      <Drawer
        title="Your Cart"
        placement="right"
        onClose={onClose}
        visible={drawerVisible}
        width={350}
      >
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>{item.title}</span>
                <span>${item.price}</span>
                <Button type="link" onClick={() => handleRemoveItem(item._id)}>Remove</Button>
              </div>
            ))}
            <Button
              type="primary"
              onClick={handlePayment}
              loading={isLoading}
              style={{ width: '100%' }}
            >
              Proceed to Payment
            </Button>
          </>
        )}
      </Drawer>
    </AntHeader>
  );
};

export default Header;
