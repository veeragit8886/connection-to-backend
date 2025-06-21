import React, { useState, useEffect } from 'react';
import {
  Button, Card, Form, Input, Modal, message, Spin, Row, Col, Typography
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined
} from '@ant-design/icons';
import Sidebar from './Sidebar';

const { Title } = Typography;
const API = 'http://localhost:3000';

const Content = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users`);
      const data = await res.json();
      setUsers(data);
    } catch {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const method = editUser ? 'PUT' : 'POST';
      const url = editUser ? `${API}/users/${editUser.id}` : `${API}/addUsers`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error();

      const updated = editUser
        ? users.map((u) => (u.id === editUser.id ? result : u))
        : [...users, result];

      setUsers(updated);
      message.success(editUser ? 'User updated' : 'User added');
      setOpen(false);
    } catch {
      message.error('Error saving user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setUsers(users.filter(u => u.id !== id));
      message.success('User deleted');
    } catch {
      message.error('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    form.resetFields();
    setEditUser(user);
    setOpen(true);
    if (user) form.setFieldsValue(user);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 bg-white border-r border-gray-200 shadow-md z-10">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Title level={3} className="!mb-0">User Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            loading={loading}
            className="rounded-md"
          >
            Add User
          </Button>
        </div>

        {/* Loader or User Grid */}
        {loading && !users.length ? (
          <div className="flex justify-center mt-20">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {users.map(({ id, username, email, mobile }) => (
              <Col key={id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={username}
                  actions={[
                    <EditOutlined key="edit" onClick={() => openModal({ id, username, email, mobile })} />,
                    <DeleteOutlined key="delete" onClick={() => handleDelete(id)} />
                  ]}
                  className="shadow rounded-md"
                >
                  <p><strong>Email:</strong> {email}</p>
                  <p><strong>Mobile:</strong> {mobile}</p>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Add/Edit Modal */}
        <Modal
          open={open}
          title={editUser ? 'Edit User' : 'Add User'}
          onCancel={() => setOpen(false)}
          onOk={handleSave}
          confirmLoading={loading}
          okText={editUser ? 'Update' : 'Add'}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please enter username' }]}
            >
              <Input placeholder="Enter username" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Invalid email format' }
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              name="mobile"
              label="Mobile Number"
              rules={[{ required: true, message: 'Please enter mobile number' }]}
            >
              <Input placeholder="Enter mobile number" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: !editUser, message: 'Please enter password' }]}
            >
              <Input.Password placeholder={editUser ? "Leave blank to keep unchanged" : "Enter password"} />
            </Form.Item>
          </Form>
        </Modal>
      </main>
    </div>
  );
};

export default Content;
