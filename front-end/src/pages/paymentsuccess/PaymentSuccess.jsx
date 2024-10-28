import React from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Button, Typography, Result } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const PaymentSuccess = ({ user }) => {
  const params = useParams();

  return (
    <div className="payment-success-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {user && (
        <Card
          style={{ maxWidth: 500, width: '100%' }}
          bodyStyle={{ padding: '24px' }}
        >
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            status="success"
            title={<Title level={2}>Payment Successful</Title>}
            subTitle={
              <>
                <Paragraph>Your course subscription has been activated.</Paragraph>
                <Paragraph>Reference no - {params.id}</Paragraph>
              </>
            }
            extra={
              <Link to={`/${user._id}/dashboard`}>
                <Button type="primary" style={{ borderRadius: 5 }}>
                  Go to Dashboard
                </Button>
              </Link>
            }
          />
        </Card>
      )}
    </div>
  );
};

export default PaymentSuccess;
