import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Modal, message, Spin, Row, Col, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const API = 'http://localhost:3000/api';

const Content = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/users`);
      const data = await response.json();
      console.log("Fetched Users:", data); 
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const url = editingUser ? `${API}/users/${editingUser.id}` : `${API}/users`;
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          company: { name: values.companyName },
        }),
      });

      const user = await response.json();
      if (!response.ok) throw new Error();

      setUsers((prev) =>
        editingUser
          ? prev.map((u) => (u.id === editingUser.id ? user : u))
          : [...prev, user]
      );
      message.success(editingUser ? 'User updated' : 'User added');
      setIsModalVisible(false);
    } catch (error) {
      message.error(`Failed to ${editingUser ? 'update' : 'add'} user`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setUsers(users.filter((user) => user.id !== id));
      message.success('User deleted');
    } catch {
      message.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    form.resetFields();
    if (user) {
      form.setFieldsValue({
        ...user,
        companyName: user.company?.name,
      });
    }
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const validateEmail = (_, value) =>
    !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? Promise.resolve()
      : Promise.reject(new Error('Invalid email'));

  return (
    <div style={{ padding: 24 }}>
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>User Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} disabled={loading}>
          Add User
        </Button>
      </div>

      {loading && users.length === 0 ? (
        <div className="flex justify-center mt-20">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {users.map((user) => (
            <Col key={user.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={user.name}
                actions={[
                  <EditOutlined key="edit" onClick={() => openModal(user)} />,
                  <DeleteOutlined key="delete" onClick={() => handleDelete(user.id)} />,
                ]}
              >
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        okText={editingUser ? 'Update' : 'Add'}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="userName" label="Username" rules={[{ required: true }]}>
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }, { validator: validateEmail }]}>
            <Input type="email" placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Content;
