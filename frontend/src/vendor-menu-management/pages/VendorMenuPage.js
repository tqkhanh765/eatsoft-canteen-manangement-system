import React, { useState, useMemo, useEffect } from 'react';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import MenuCard from '../components/MenuCard';
import MenuToolbar from '../components/MenuToolbar';
import ItemForm from '../components/ItemForm';
import productService from '../services/productService';
import { EMPTY_FORM } from '../constants';
import '../styles/VendorMenuPage.css';

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const VendorMenuPage = ({ user, onLogout }) => {
  const storeId = user?.stores?.[0]?.storeId;
  const [items, setItems]           = useState([]);
  const [view, setView]             = useState('list'); // 'list' | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);

  // ── Loading & error states
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [saving, setSaving]         = useState(false);

  // ── Search & filter state
  const [search,     setSearch]     = useState('');
  const [filterCat,  setFilterCat]  = useState('All');
  const [filterAvail, setFilterAvail] = useState('All'); // 'All' | 'Available' | 'Sold Out'

  // ── Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [storeId]);

  const fetchProducts = async () => {
    if (!storeId) return;
    setLoading(true);
    setError(null);
    try {
      const products = await productService.getProductsByStore(storeId);
      setItems(products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load menu items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Navigation helpers
  const goList = () => { setView('list'); setEditTarget(null); setForm(EMPTY_FORM); };
  const goAdd  = () => { setForm(EMPTY_FORM); setView('add'); };
  const goEdit = (item) => {
    setEditTarget(item.id);
    setForm({
      name: item.name,
      type: item.type,
      price: item.price,
      desc: item.desc,
      image: item.image,
      available: item.available,
      categoryId: item.categoryId,
    });
    setView('edit');
  };

  // ── Form field change
  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  // ── Add Item
  const handlePublish = async () => {
    if (!form.name || !form.price || !storeId) return;
    setSaving(true);
    try {
      const newProduct = await productService.createProduct(form, storeId, form.categoryId);
      setItems(prev => [...prev, newProduct]);
      goList();
    } catch (err) {
      console.error('Failed to create product:', err);
      alert('Failed to create product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Edit Item
  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      const updatedProduct = await productService.updateProduct(editTarget, form, form.categoryId);
      setItems(prev => prev.map(i => i.id === editTarget ? updatedProduct : i));
      goList();
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete Item
  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  // ── Toggle Availability
  const handleToggle = async (id) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const newAvailability = !item.available;
    // Optimistic update
    setItems(prev => prev.map(i => i.id === id ? { ...i, available: newAvailability } : i));

    try {
      await productService.updateAvailability(id, newAvailability);
    } catch (err) {
      console.error('Failed to toggle availability:', err);
      // Revert on error
      setItems(prev => prev.map(i => i.id === id ? { ...i, available: item.available } : i));
      alert('Failed to update availability. Please try again.');
    }
  };

  // ── Derived filtered list
  const filteredItems = useMemo(() => {
    return items
      .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
      .filter(i => filterCat  === 'All' || i.type === filterCat)
      .filter(i => filterAvail === 'All' ||
                   (filterAvail === 'Available' ? i.available : !i.available));
  }, [items, search, filterCat, filterAvail]);

  // ── Add view
  if (view === 'add') {
    return (
      <>
        <Navbar user={user} onLogout={onLogout} />
        <ItemForm
          title="Add Item"
          form={form}
          onChange={handleChange}
          onSave={handlePublish}
          onCancel={goList}
          saveLabel="Publish"
          isSaving={saving}
        />
      </>
    );
  }

  // ── Edit view
  if (view === 'edit') {
    return (
      <>
        <Navbar user={user} onLogout={onLogout} />
        <ItemForm
          title="Edit Item"
          form={form}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={goList}
          saveLabel="Save"
          isSaving={saving}
        />
      </>
    );
  }

  // ── List view (default)
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <div className="vendor-page">
        <div className="container">
          <div className="vendor-header">
            <h1>Menu</h1>
            <button className="add-item-btn" id="add-menu-item-btn" onClick={goAdd} disabled={loading}>
              <PlusIcon /> Add item
            </button>
          </div>

          {/* ── Search & Filter bar ── */}
          <MenuToolbar
            search={search}
            filterCat={filterCat}
            filterAvail={filterAvail}
            onSearch={setSearch}
            onFilterCat={setFilterCat}
            onFilterAvail={setFilterAvail}
          />

          {/* ── Error message ── */}
          {error && (
            <div className="error-banner">
              <p>{error}</p>
              <button onClick={fetchProducts}>Retry</button>
            </div>
          )}

          {/* ── Loading state ── */}
          {loading ? (
            <div className="loading-state">
              <p>Loading menu items...</p>
            </div>
          ) : (
            <>
              {/* ── Results count ── */}
              <p className="results-count">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
              </p>

              {/* ── Grid ── */}
              {filteredItems.length > 0 ? (
                <div className="menu-grid">
                  {filteredItems.map(item => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      onEdit={goEdit}
                      onDelete={handleDelete}
                      onToggle={handleToggle}
                    />
                  ))}
                </div>
              ) : (
                <div className="menu-empty">
                  <p>No items match your search or filters.</p>
                  <button className="menu-empty-reset" onClick={() => { setSearch(''); setFilterCat('All'); setFilterAvail('All'); }}>
                    Reset filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VendorMenuPage;

