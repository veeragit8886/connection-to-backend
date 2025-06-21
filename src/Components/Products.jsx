import React, { useState, useEffect } from 'react';
import {
  Button, Card, Form, InputNumber, Input, Modal, message, Spin, Row, Col, Typography
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const API = 'http://localhost:3000';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data);
    } catch {
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const method = editProduct ? 'PUT' : 'POST';
      const url = editProduct ? `${API}/product/${editProduct._id}` : `${API}/addProduct`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error();

      const updated = editProduct
        ? products.map((p) => (p._id === editProduct._id ? result : p))
        : [...products, result];

      setProducts(updated);
      message.success(editProduct ? 'Product updated' : 'Product added');
      setOpen(false);
    } catch {
      message.error('Error saving Product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id) => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/product/${_id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setProducts(products.filter(p => p._id !== _id));
      message.success('Product deleted');
    } catch {
      message.error('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    form.resetFields();
    setEditProduct(product);
    setOpen(true);
    if (product) form.setFieldsValue(product);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!mb-0">Product Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          loading={loading}
          className="rounded-md"
        >
          Add Product
        </Button>
      </div>

      {loading && !products.length ? (
        <div className="flex justify-center mt-20"><Spin size="large" /></div>
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((product) => {
            const { _id, name, price, image, description, quantity, category } = product;
            return (
              <Col
                key={_id}
                xs={24} sm={12} md={8} lg={6}
                onClick={() => navigate(`/product/${_id}`)}
              >
                <div className="bg-white rounded-xl shadow-md border hover:shadow-lg transition duration-300 flex flex-col h-full">
                  <img
                    src={image}
                    alt={name}
                    className="h-48 w-full object-cover rounded-t-xl"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">{name}</h2>
                      <p className="text-sm text-gray-600 mb-1"><strong>Price:</strong> ₹{price}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Qty:</strong> {quantity}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Category:</strong> {category}</p>
                      <p className="text-sm text-gray-500">{description.slice(0, 60)}...</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation(); // prevent card click
                          openModal(product);
                        }}
                      />
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={(e) => {
                          e.stopPropagation(); // prevent card click
                          handleDelete(_id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Modal for Add/Edit */}
      <Modal
        open={open}
        title={editProduct ? 'Edit Product' : 'Add Product'}
        onCancel={() => setOpen(false)}
        onOk={handleSave}
        confirmLoading={loading}
        okText={editProduct ? 'Update' : 'Add'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber placeholder="Enter price" className="w-full" min={0} />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Enter description" rows={3} />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <Input placeholder="Enter quantity" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input placeholder="Enter category" />
          </Form.Item>
          <Form.Item name="image" label="Image URL" rules={[{ required: true }]}>
            <Input placeholder="Enter image URL" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
