import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';

// API base URL
const API = 'http://localhost:3000';

// Modal for adding/editing a category
const CategoryModal = ({ show, onClose, onSave, editingCategory, isLoading }) => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [categoriesType, setCategoriesType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name);
      setDescription(editingCategory.description || '');
      setImage(editingCategory.image || '');
      setPrice(editingCategory.price || '');
      setCategoriesType(editingCategory.categories || '');
    } else {
      setCategoryName('');
      setDescription('');
      setImage('');
      setPrice('');
      setCategoriesType('');
    }
    setError('');
  }, [show, editingCategory]);

  const handleSave = () => {
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }
    onSave({
      _id: editingCategory?._id,
      name: categoryName.trim(),
      description: description.trim(),
      image: image.trim(),
      price: price.trim(),
      categories: categoriesType.trim(),
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-zinc-200 dark:border-zinc-700 animate-scale-in">
        <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </h2>
        <div className="space-y-4">
          {['name', 'description', 'image', 'price', 'categoriesType'].map((field, idx) => {
            const label = field === 'categoriesType' ? 'Type' : field.charAt(0).toUpperCase() + field.slice(1);
            const value = { name: categoryName, description, image, price, categoriesType }[field];
            const setter = {
              name: setCategoryName,
              description: setDescription,
              image: setImage,
              price: setPrice,
              categoriesType: setCategoriesType
            }[field];
            const tag = field === 'description' ? 'textarea' : 'input';
            return (
              <div key={idx}>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {label}
                </label>
                {tag === 'input' ? (
                  <input
                    type={field === 'price' ? 'number' : 'text'}
                    value={value}
                    onChange={e => { setter(e.target.value); setError(''); }}
                    className="w-full border rounded-md p-2 text-sm dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={`Enter ${label.toLowerCase()}`}
                    disabled={isLoading}
                  />
                ) : (
                  <textarea
                    value={value}
                    onChange={e => setter(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter description"
                    rows={3}
                    disabled={isLoading}
                  ></textarea>
                )}
              </div>
            );
          })}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-white dark:bg-zinc-900 border text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 flex items-center"
          >
            {isLoading && <svg className="animate-spin h-4 w-4 mr-2 text-white dark:text-zinc-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>}
            {editingCategory ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const itemsPerPage = 6;

  const fetchCategories = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/getcategory`);
      if (!res.ok) throw new Error('Error loading');
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleSaveCategory = async (cat) => {
    setIsLoading(true); setError(null);
    try {
      const method = cat._id ? 'PUT' : 'POST';
      const url = cat._id ? `${API}/updatecategory/${cat._id}` : `${API}/addcategory`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Error saving');
      }
      const data = await res.json();
      if (cat._id) {
        setCategories(prev => prev.map(c => c._id === data.data._id ? data.data : c));
      } else {
        setCategories(prev => [...prev, data]);
      }
      setShowModal(false);
    } catch (e) {
      setError(`Save failed: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    setIsLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/deletecategory/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-zinc-100 dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-zinc-800 dark:text-zinc-200">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <aside className="w-64 fixed inset-y-0 left-0 bg-white dark:bg-zinc-800 shadow-md border-r border-zinc-200 dark:border-zinc-700 z-20">
        <Sidebar />
      </aside>
      <main className="flex-1 ml-64 p-6 space-y-6 text-zinc-800 dark:text-zinc-100">
        {error && (
          <div className="fixed right-4 top-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
            {error}
          </div>
        )}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Category Manager</h1>
          <button
            onClick={() => { setEditingCategory(null); setShowModal(true); }}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 disabled:opacity-50"
          >
            + Add New Category
          </button>
        </div>
        <input
          type="text"
          value={searchTerm}
          placeholder="Search by name or description..."
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          disabled={isLoading}
          className="w-full p-3 border rounded-lg dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageItems.map(cat => (
            <div key={cat._id} className="bg-zinc-50 dark:bg-zinc-700 p-6 rounded-lg border shadow-md flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{cat.name}</h2>
                {cat.image && <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover rounded-md mb-3 border" />}
                <p className="text-sm mb-2">{cat.description || 'No description.'}</p>
                <p className="text-sm font-medium text-green-600 mb-1">Price: ₹{cat.price}</p>
                <p className="text-sm text-blue-600">Type: {cat.categories}</p>
                {cat.createdAt && (
                  <p className="text-xs text-zinc-500 mt-2">Created: {new Date(cat.createdAt).toLocaleString()}</p>
                )}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => { setEditingCategory(cat); setShowModal(true); }}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      <CategoryModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Categories;
