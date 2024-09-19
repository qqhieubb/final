import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Body = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Title>Welcome to My LMS</Title>
      <Paragraph>
        Your one-stop solution for online learning. Start your journey today with a wide range of courses!
      </Paragraph>
    </div>
  );
};

export default Body;
