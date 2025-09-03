import React from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom"; // <-- import this
import "./AdminLogin.scss";

const LoginPage = () => {
  const navigate = useNavigate(); // <-- hook

  const handleLogin = (values) => {
    console.log("Login submitted", values);

    // ✅ Simulate login success
    // real app lo API call chesi success aithe redirect cheyyandi
    navigate("/admin/dashboard"); // <-- redirect to dashboard
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login Now</h2>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item name="username" className="form-item">
            <Input placeholder="Username / Mobile Number" />
          </Form.Item>

          <Form.Item name="password" className="form-item">
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Button block type="primary" htmlType="submit" className="login-btn">
            Login Now
          </Button>

          <div className="support-text">support@dream6mail.com</div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
