import React, { useState, useMemo } from 'react';
import Footer from '../../components/Footer';
import VendorNavbar from '../components/VendorNavbar';
import MenuCard from '../components/MenuCard';
import MenuToolbar from '../components/MenuToolbar';
import ItemForm from '../components/ItemForm';
import { SEED_ITEMS, EMPTY_FORM } from '../constants';
import '../styles/VendorMenuPage.css';

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

let nextId = SEED_ITEMS.length + 1;

const VendorMenuPage = () => {
  const [items, setItems]           = useState(SEED_ITEMS);
  const [view, setView]             = useState('list'); // 'list' | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);

  // ── Search & filter state
  const [search,     setSearch]     = useState('');
  const [filterCat,  setFilterCat]  = useState('All');
  const [filterAvail, setFilterAvail] = useState('All'); // 'All' | 'Available' | 'Sold Out'

  // ── Navigation helpers
  const goList = () => { setView('list'); setEditTarget(null); setForm(EMPTY_FORM); };
  const goAdd  = () => { setForm(EMPTY_FORM); setView('add'); };
  const goEdit = (item) => {
    setEditTarget(item.id);
    setForm({ name: item.name, type: item.type, price: item.price, desc: item.desc, image: item.image });
    setView('edit');
  };

  // ── Form field change
  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  // ── Add Item
  const handlePublish = () => {
    if (!form.name || !form.price) return;
    setItems(prev => [...prev, {
      id: nextId++,
      ...form,
      price: Number(form.price),
      available: true,
      image: form.image || 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=300&fit=crop',
    }]);
    goList();
  };

  // ── Edit Item
  const handleSave = () => {
    if (!form.name || !form.price) return;
    setItems(prev => prev.map(i =>
      i.id === editTarget ? { ...i, ...form, price: Number(form.price) } : i
    ));
    goList();
  };

  // ── Delete Item
  const handleDelete = (id) => setItems(prev => prev.filter(i => i.id !== id));

  // ── Toggle Availability
  const handleToggle = (id) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));

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
        <VendorNavbar />
        <ItemForm
          title="Add Item"
          form={form}
          onChange={handleChange}
          onSave={handlePublish}
          onCancel={goList}
          saveLabel="Publish"
        />
      </>
    );
  }

  // ── Edit view
  if (view === 'edit') {
    return (
      <>
        <VendorNavbar />
        <ItemForm
          title="Edit Item"
          form={form}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={goList}
          saveLabel="Save"
        />
      </>
    );
  }

  // ── List view (default)
  return (
    <>
      <VendorNavbar />
      <div className="vendor-page">
        <div className="container">
          <div className="vendor-header">
            <h1>Menu</h1>
            <button className="add-item-btn" id="add-menu-item-btn" onClick={goAdd}>
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VendorMenuPage;

