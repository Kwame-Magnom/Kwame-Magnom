import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/src/lib/api';
import { formatGhs, GHANA_REGIONS } from '@/src/lib/utils';
import { BrandItem, CategoryItem, OrderRecord, ProductItem, UserProfile } from '@/src/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onCatalogMutated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  onCatalogMutated,
}) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenueGhs: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [customers, setCustomers] = useState<UserProfile[]>([]);

  // Add/Edit Product dialog
  const [prodDialogOpen, setProdDialogOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<ProductItem | null>(null);
  const [pName, setPName] = useState('');
  const [pCategoryGroup, setPCategoryGroup] = useState('iphones');
  const [pSubcategory, setPSubcategory] = useState('');
  const [pBrandName, setPBrandName] = useState('Apple');
  const [pPrice, setPPrice] = useState('');
  const [pCompareAt, setPCompareAt] = useState('');
  const [pStock, setPStock] = useState('10');
  const [pVariant, setPVariant] = useState('');
  const [pCondition, setPCondition] = useState('Brand New Sealed');
  const [pWarranty, setPWarranty] = useState('12 Months MAGNOM Warranty');
  const [pDesc, setPDesc] = useState('');
  const [pFeatured, setPFeatured] = useState(false);
  const [pBestSeller, setPBestSeller] = useState(false);
  const [pNewArrival, setPNewArrival] = useState(true);
  const [pSpecialOffer, setPSpecialOffer] = useState(false);

  // Add Order dialog
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [oProductId, setOProductId] = useState('');
  const [oQuantity, setOQuantity] = useState('1');
  const [oCustomerName, setOCustomerName] = useState('');
  const [oCustomerEmail, setOCustomerEmail] = useState('');
  const [oCustomerPhone, setOCustomerPhone] = useState('');
  const [oRegion, setORegion] = useState('Greater Accra');
  const [oCity, setOCity] = useState('Accra');
  const [oStreet, setOStreet] = useState('');
  const [oDeliveryMethod, setODeliveryMethod] = useState('Accra Same-Day Dispatch');
  const [oPaymentMethod, setOPaymentMethod] = useState('momo_manual');
  const [oPaymentStatus, setOPaymentStatus] = useState('paid');
  const [oOrderStatus, setOOrderStatus] = useState('confirmed');
  const [oTrackingNote, setOTrackingNote] = useState('');

  // Add Category / Brand
  const [newCatName, setNewCatName] = useState('');
  const [newCatGroup, setNewCatGroup] = useState('accessories');
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandGroup, setNewBrandGroup] = useState('android');

  const loadOverview = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<any>('/api/admin/overview');
      setStats(data.stats);
      setProducts(data.products || []);
      setOrders(data.orders || []);
      setCategories(data.categories || []);
      setBrands(data.brands || []);
      setCustomers(data.customers || []);
    } catch (err: any) {
      toast.error(err?.message || 'Unable to load admin console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const openNewProduct = () => {
    setEditingProd(null);
    setPName('');
    setPCategoryGroup('iphones');
    setPSubcategory('iPhone 16 Series');
    setPBrandName('Apple');
    setPPrice('');
    setPCompareAt('');
    setPStock('10');
    setPVariant('');
    setPCondition('Brand New Sealed');
    setPWarranty('12 Months MAGNOM PHONES HUB Warranty');
    setPDesc('');
    setPFeatured(false);
    setPBestSeller(false);
    setPNewArrival(true);
    setPSpecialOffer(false);
    setProdDialogOpen(true);
  };

  const openEditProduct = (p: ProductItem) => {
    setEditingProd(p);
    setPName(p.name);
    setPCategoryGroup(p.categoryGroup);
    setPSubcategory(p.subcategory);
    setPBrandName(p.brandName);
    setPPrice(String(p.priceGhs));
    setPCompareAt(p.compareAtGhs ? String(p.compareAtGhs) : '');
    setPStock(String(p.stockQty));
    setPVariant(p.storageOrVariant || '');
    setPCondition(p.condition);
    setPWarranty(p.warranty);
    setPDesc(p.description);
    setPFeatured(p.isFeatured);
    setPBestSeller(p.isBestSeller);
    setPNewArrival(p.isNewArrival);
    setPSpecialOffer(p.isSpecialOffer);
    setProdDialogOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        name: pName,
        categoryGroup: pCategoryGroup,
        subcategory: pSubcategory,
        brandName: pBrandName,
        priceGhs: Number(pPrice),
        compareAtGhs: pCompareAt ? Number(pCompareAt) : null,
        stockQty: Number(pStock),
        storageOrVariant: pVariant,
        condition: pCondition,
        warranty: pWarranty,
        description: pDesc,
        isFeatured: pFeatured,
        isBestSeller: pBestSeller,
        isNewArrival: pNewArrival,
        isSpecialOffer: pSpecialOffer,
      };
      if (editingProd) {
        await apiFetch(`/api/admin/products/${editingProd.id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        toast.success('Product updated.');
      } else {
        await apiFetch('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        toast.success('New product added to store.');
      }
      setProdDialogOpen(false);
      await loadOverview();
      onCatalogMutated();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save product.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      toast.success('Product removed.');
      await loadOverview();
      onCatalogMutated();
    } catch {
      toast.error('Failed to delete product.');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name: newCatName, parentGroup: newCatGroup }),
      });
      setNewCatName('');
      toast.success('Category added.');
      await loadOverview();
      onCatalogMutated();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add category.');
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/admin/brands', {
        method: 'POST',
        body: JSON.stringify({ name: newBrandName, categoryGroup: newBrandGroup }),
      });
      setNewBrandName('');
      toast.success('Brand added.');
      await loadOverview();
      onCatalogMutated();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add brand.');
    }
  };

  const handleUpdateOrder = async (
    orderId: number,
    payload: { orderStatus?: string; paymentStatus?: string; trackingNote?: string }
  ) => {
    try {
      await apiFetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      toast.success('Order updated.');
      await loadOverview();
    } catch {
      toast.error('Failed to update order.');
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      await apiFetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      toast.success('Order deleted.');
      await loadOverview();
    } catch {
      toast.error('Failed to delete order.');
    }
  };

  const openNewOrder = () => {
    if (products.length > 0 && !oProductId) {
      setOProductId(String(products[0].id));
    }
    setOQuantity('1');
    setOCustomerName('');
    setOCustomerEmail('');
    setOCustomerPhone('');
    setORegion('Greater Accra');
    setOCity('Accra');
    setOStreet('');
    setODeliveryMethod('Accra Same-Day Dispatch');
    setOPaymentMethod('momo_manual');
    setOPaymentStatus('paid');
    setOOrderStatus('confirmed');
    setOTrackingNote('Order logged by MAGNOM PHONES HUB Admin.');
    setOrderDialogOpen(true);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/admin/orders', {
        method: 'POST',
        body: JSON.stringify({
          productId: Number(oProductId),
          quantity: Number(oQuantity),
          customerName: oCustomerName,
          customerEmail: oCustomerEmail,
          customerPhone: oCustomerPhone,
          shippingRegion: oRegion,
          shippingCity: oCity,
          shippingStreet: oStreet,
          deliveryMethod: oDeliveryMethod,
          paymentMethod: oPaymentMethod,
          paymentStatus: oPaymentStatus,
          orderStatus: oOrderStatus,
          trackingNote: oTrackingNote,
        }),
      });
      setOrderDialogOpen(false);
      toast.success('Order added successfully.');
      await loadOverview();
      onCatalogMutated();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add order.');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DC0000] hover:underline mb-2 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Storefront
          </button>
          <h1 className="text-2xl font-bold text-[#001B5E] font-display">
            MAGNOM PHONES HUB Admin Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage electronics inventory, brands, categories, and Ghana customer orders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" onClick={openNewOrder}>
            <Plus className="h-4 w-4" />
            Add Order
          </Button>
          <Button variant="accent" onClick={openNewProduct}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Verified Revenue', value: formatGhs(stats.totalRevenueGhs) },
          { label: 'Total Orders', value: String(stats.totalOrders) },
          { label: 'Pending Fulfillment', value: String(stats.pendingOrders) },
          { label: 'Catalog SKUs / Low Stock', value: `${stats.totalProducts} / ${stats.lowStockCount}` },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-500">{kpi.label}</p>
            <p className="text-2xl font-bold text-[#001B5E] font-mono-nums mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500 py-8">Loading store database...</p>
      ) : (
        <Tabs defaultValue="products">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="taxonomy">Categories &amp; Brands</TabsTrigger>
            <TabsTrigger value="customers">Customers ({customers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                    <th className="py-3 px-4 font-semibold">SKU &amp; Product</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Brand</th>
                    <th className="py-3 px-4 font-semibold">Price (GHS)</th>
                    <th className="py-3 px-4 font-semibold">Stock</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-slate-400 font-mono-nums">{p.sku}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {p.categoryGroup} · {p.subcategory}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{p.brandName}</td>
                      <td className="py-3 px-4 font-mono-nums font-semibold text-[#001B5E]">
                        {formatGhs(p.priceGhs)}
                      </td>
                      <td className="py-3 px-4 font-mono-nums">
                        <span className={p.stockQty <= 5 ? 'text-amber-700 font-semibold' : 'text-slate-700'}>
                          {p.stockQty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEditProduct(p)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteProduct(p.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Add walk-in, WhatsApp (0532779339), or phone (0207581098) orders and manage fulfillment.
              </p>
              <Button size="sm" variant="accent" onClick={openNewOrder}>
                <Plus className="h-3.5 w-3.5" />
                Add Order
              </Button>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                No customer orders recorded yet. Click Add Order to log a new order.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[#001B5E] font-mono-nums">
                        {order.orderNumber} · {formatGhs(order.totalGhs)}
                      </p>
                      <p className="text-xs text-slate-600">
                        {order.customerName} ({order.customerPhone}) · {order.shippingCity},{' '}
                        {order.shippingRegion} · {order.deliveryMethod}
                      </p>
                      {order.items && order.items.length > 0 && (
                        <p className="text-xs text-slate-500">
                          Items:{' '}
                          {order.items
                            .map((i) => `${i.productName} ×${i.quantity}`)
                            .join(', ')}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400">{order.trackingNote}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        aria-label="Order Status"
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleUpdateOrder(order.id, {
                            orderStatus: e.target.value,
                            trackingNote: order.trackingNote,
                          })
                        }
                        className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-900"
                      >
                        {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                          (st) => (
                            <option key={st} value={st}>
                              Order: {st.toUpperCase()}
                            </option>
                          )
                        )}
                      </select>

                      <select
                        aria-label="Payment Status"
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handleUpdateOrder(order.id, {
                            paymentStatus: e.target.value,
                          })
                        }
                        className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-900"
                      >
                        {[
                          { val: 'pending', label: 'Pay: PENDING' },
                          { val: 'paid', label: 'Pay: PAID' },
                          { val: 'cod_pending', label: 'Pay: COD PENDING' },
                          { val: 'failed', label: 'Pay: FAILED' },
                        ].map((pst) => (
                          <option key={pst.val} value={pst.val}>
                            {pst.label}
                          </option>
                        ))}
                      </select>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="taxonomy">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
                <h3 className="text-base font-bold text-[#001B5E]">Add Subcategory</h3>
                <form onSubmit={handleAddCategory} className="flex flex-wrap gap-2">
                  <Input
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g., Gaming Laptops"
                    className="flex-1 min-w-[160px]"
                  />
                  <select
                    value={newCatGroup}
                    onChange={(e) => setNewCatGroup(e.target.value)}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  >
                    <option value="iphones">iPhones</option>
                    <option value="android">Android</option>
                    <option value="laptops">Laptops</option>
                    <option value="accessories">Accessories</option>
                  </select>
                  <Button type="submit" variant="accent">
                    Add
                  </Button>
                </form>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {categories.map((c) => (
                    <div key={c.id} className="py-2 flex items-center justify-between text-xs">
                      <span>
                        <strong className="text-slate-900">{c.name}</strong>{' '}
                        <span className="text-slate-400">({c.parentGroup})</span>
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          await apiFetch(`/api/admin/categories/${c.id}`, { method: 'DELETE' });
                          await loadOverview();
                          onCatalogMutated();
                        }}
                        className="text-slate-400 hover:text-red-600 cursor-pointer"
                        aria-label="Delete category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
                <h3 className="text-base font-bold text-[#001B5E]">Add Brand</h3>
                <form onSubmit={handleAddBrand} className="flex flex-wrap gap-2">
                  <Input
                    required
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="e.g., OnePlus"
                    className="flex-1 min-w-[160px]"
                  />
                  <select
                    value={newBrandGroup}
                    onChange={(e) => setNewBrandGroup(e.target.value)}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  >
                    <option value="iphones">iPhones</option>
                    <option value="android">Android</option>
                    <option value="laptops">Laptops</option>
                    <option value="accessories">Accessories</option>
                  </select>
                  <Button type="submit" variant="accent">
                    Add
                  </Button>
                </form>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {brands.map((b) => (
                    <div key={b.id} className="py-2 flex items-center justify-between text-xs">
                      <span>
                        <strong className="text-slate-900">{b.name}</strong>{' '}
                        <span className="text-slate-400">({b.categoryGroup})</span>
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          await apiFetch(`/api/admin/brands/${b.id}`, { method: 'DELETE' });
                          await loadOverview();
                          onCatalogMutated();
                        }}
                        className="text-slate-400 hover:text-red-600 cursor-pointer"
                        aria-label="Delete brand"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customers">
            <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Ghana Phone</th>
                    <th className="py-3 px-4 font-semibold">Verified</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100">
                      <td className="py-3 px-4 font-semibold text-slate-900">{c.fullName}</td>
                      <td className="py-3 px-4 text-slate-600">{c.email}</td>
                      <td className="py-3 px-4 font-mono-nums text-slate-600">
                        {c.phone || '—'}
                      </td>
                      <td className="py-3 px-4">
                        {c.emailVerified ? 'Verified' : 'Pending OTP'}
                      </td>
                      <td className="py-3 px-4 capitalize font-semibold text-[#001B5E]">
                        {c.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Add / Edit Product Dialog */}
      <Dialog open={prodDialogOpen} onOpenChange={setProdDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingProd ? 'Edit Product' : 'Add New Electronics Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProduct} className="space-y-3.5">
            <div className="space-y-1">
              <Label>Product Name</Label>
              <Input
                required
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                placeholder="iPhone 16 Pro Max 512GB"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Category Group</Label>
                <select
                  value={pCategoryGroup}
                  onChange={(e) => setPCategoryGroup(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="iphones">iPhones</option>
                  <option value="android">Android</option>
                  <option value="laptops">Laptops</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Subcategory / Series</Label>
                <Input
                  required
                  value={pSubcategory}
                  onChange={(e) => setPSubcategory(e.target.value)}
                  placeholder="iPhone 16 Series"
                />
              </div>
              <div className="space-y-1">
                <Label>Brand</Label>
                <Input
                  required
                  value={pBrandName}
                  onChange={(e) => setPBrandName(e.target.value)}
                  placeholder="Apple"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Price (GH₵)</Label>
                <Input
                  type="number"
                  required
                  min={1}
                  value={pPrice}
                  onChange={(e) => setPPrice(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Compare-At (GH₵)</Label>
                <Input
                  type="number"
                  value={pCompareAt}
                  onChange={(e) => setPCompareAt(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Stock Qty</Label>
                <Input
                  type="number"
                  required
                  min={0}
                  value={pStock}
                  onChange={(e) => setPStock(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Storage / Variant</Label>
                <Input
                  value={pVariant}
                  onChange={(e) => setPVariant(e.target.value)}
                  placeholder="256GB · Titanium"
                />
              </div>
              <div className="space-y-1">
                <Label>Condition</Label>
                <Input
                  value={pCondition}
                  onChange={(e) => setPCondition(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Warranty</Label>
              <Input value={pWarranty} onChange={(e) => setPWarranty(e.target.value)} />
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Input
                required
                value={pDesc}
                onChange={(e) => setPDesc(e.target.value)}
                placeholder="Key highlights for Ghanaian buyers..."
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-1 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pFeatured}
                  onChange={(e) => setPFeatured(e.target.checked)}
                />
                Featured
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pBestSeller}
                  onChange={(e) => setPBestSeller(e.target.checked)}
                />
                Best Seller
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pNewArrival}
                  onChange={(e) => setPNewArrival(e.target.checked)}
                />
                New Arrival
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pSpecialOffer}
                  onChange={(e) => setPSpecialOffer(e.target.checked)}
                />
                Special Offer
              </label>
            </div>

            <Button type="submit" variant="accent" className="w-full">
              {editingProd ? 'Save Changes' : 'Publish Product'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Order Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Customer Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateOrder} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <Label>Select Product</Label>
                <select
                  required
                  value={oProductId}
                  onChange={(e) => setOProductId(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatGhs(p.priceGhs)} ({p.stockQty} left)
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  required
                  min={1}
                  value={oQuantity}
                  onChange={(e) => setOQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Customer Full Name</Label>
                <Input
                  required
                  value={oCustomerName}
                  onChange={(e) => setOCustomerName(e.target.value)}
                  placeholder="Kwame Mensah"
                />
              </div>
              <div className="space-y-1">
                <Label>Ghana Phone</Label>
                <Input
                  required
                  value={oCustomerPhone}
                  onChange={(e) => setOCustomerPhone(e.target.value)}
                  placeholder="0241234567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Region</Label>
                <select
                  value={oRegion}
                  onChange={(e) => setORegion(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  {GHANA_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>City / Area</Label>
                <Input
                  required
                  value={oCity}
                  onChange={(e) => setOCity(e.target.value)}
                  placeholder="Accra - Osu"
                />
              </div>
              <div className="space-y-1">
                <Label>Customer Email (Optional)</Label>
                <Input
                  type="email"
                  value={oCustomerEmail}
                  onChange={(e) => setOCustomerEmail(e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Street / Landmark</Label>
              <Input
                value={oStreet}
                onChange={(e) => setOStreet(e.target.value)}
                placeholder="WhatsApp order / Osu Showroom Pickup"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Delivery</Label>
                <select
                  value={oDeliveryMethod}
                  onChange={(e) => setODeliveryMethod(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="Accra Same-Day Dispatch">Accra Same-Day Dispatch</option>
                  <option value="Nationwide Courier">Nationwide Courier</option>
                  <option value="Showroom Pickup">Showroom Pickup</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Payment Status</Label>
                <select
                  value={oPaymentStatus}
                  onChange={(e) => setOPaymentStatus(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="paid">Paid (MoMo / Cash / Paystack)</option>
                  <option value="cod_pending">Cash on Delivery Pending</option>
                  <option value="pending">Pending Payment</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Order Status</Label>
                <select
                  value={oOrderStatus}
                  onChange={(e) => setOOrderStatus(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Tracking Note</Label>
              <Input
                value={oTrackingNote}
                onChange={(e) => setOTrackingNote(e.target.value)}
              />
            </div>

            <Button type="submit" variant="accent" className="w-full">
              Create Order
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
