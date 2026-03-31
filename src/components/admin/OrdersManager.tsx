import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '../../stores/languageStore';
import { LocalStorageService } from '../../lib/localStorage';
import { supabase } from '../../lib/supabase';
import { Package, CheckCircle, XCircle, Clock, Truck, Printer } from 'lucide-react';

interface OrderItem {
  merch_id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  id?: string;
  order_number?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address: string;
  customer_postal_code: string;
  customer_city: string;
  customer_country: string;
  order_items: OrderItem[];
  total_amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_method?: string;
  tracking_number?: string;
  notes?: string;
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export function OrdersManager() {
  const { t } = useLanguageStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [printLabelOrder, setPrintLabelOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      // Use localStorage directly (Supabase will be set up later)
      const localData = LocalStorageService.get<Order>('orders');
      setOrders(localData.sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      ));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Kunne ikke hente bestillinger');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(orderId: string, newStatus: Order['status']) {
    try {
      // Use localStorage directly
      const localData = LocalStorageService.get<Order>('orders');
      const updated = localData.map(o => 
        o.id === orderId ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o
      );
      LocalStorageService.set('orders', updated);

      toast.success('Status oppdatert!');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error('Kunne ikke oppdatere status');
    }
  }

  function handlePrintLabel(order: Order) {
    setPrintLabelOrder(order);
  }

  async function handleUpdateTracking(orderId: string, trackingNumber: string) {
    try {
      // Use localStorage directly
      const localData = LocalStorageService.get<Order>('orders');
      const updated = localData.map(o => 
        o.id === orderId ? { ...o, tracking_number: trackingNumber, updated_at: new Date().toISOString() } : o
      );
      LocalStorageService.set('orders', updated);

      toast.success('Tracking nummer oppdatert!');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, tracking_number: trackingNumber });
      }
    } catch (error: any) {
      console.error('Error updating tracking:', error);
      toast.error('Kunne ikke oppdatere tracking');
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-red-orange-600" size={20} />;
      case 'confirmed':
      case 'processing':
        return <CheckCircle className="text-blue-600" size={20} />;
      case 'shipped':
        return <Truck className="text-purple-600" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-red-orange-100 text-red-orange-800';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.orders')}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-700'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'pending' ? 'bg-red-orange-600 text-white' : 'bg-red-orange-100 text-red-orange-800'
            }`}
          >
            Venter
          </button>
          <button
            onClick={() => setStatusFilter('shipped')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'shipped' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'
            }`}
          >
            Sendt
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Ordrenr.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Dato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Kunde</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Varer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-neutral-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    {order.order_number || `#${order.id?.slice(0, 8)}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.created_at 
                      ? new Date(order.created_at).toLocaleDateString('no-NO')
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{order.customer_name}</div>
                    <div className="text-sm text-neutral-500">{order.customer_email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.order_items.length} {order.order_items.length === 1 ? 'vare' : 'varer'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.total_amount} {order.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handlePrintLabel(order)}
                        className="text-brand-600 hover:text-brand-900 inline-flex items-center gap-1"
                        title="Print Label"
                      >
                        <Printer size={16} />
                      </button>
                      <span className="text-primary-600">
                        {t('common.edit')}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ paddingBottom: '120px' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">
                  Bestilling {selectedOrder.order_number || `#${selectedOrder.id?.slice(0, 8)}`}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Kundeinformasjon</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Navn:</strong> {selectedOrder.customer_name}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                    {selectedOrder.customer_phone && (
                      <p><strong>Telefon:</strong> {selectedOrder.customer_phone}</p>
                    )}
                    <p><strong>Adresse:</strong> {selectedOrder.customer_address}</p>
                    <p><strong>Postnummer:</strong> {selectedOrder.customer_postal_code}</p>
                    <p><strong>By:</strong> {selectedOrder.customer_city}</p>
                    <p><strong>Land:</strong> {selectedOrder.customer_country}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Bestillingsdetaljer</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Status:</strong> {selectedOrder.status}</p>
                    <p><strong>Total:</strong> {selectedOrder.total_amount} {selectedOrder.currency}</p>
                    {selectedOrder.shipping_method && (
                      <p><strong>Frakt:</strong> {selectedOrder.shipping_method}</p>
                    )}
                    {selectedOrder.tracking_number && (
                      <p><strong>Tracking:</strong> {selectedOrder.tracking_number}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">Varer</h4>
                <div className="space-y-2">
                  {selectedOrder.order_items.map((item, index) => (
                    <div key={index} className="flex justify-between p-3 bg-neutral-50 rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.size && <p className="text-sm text-neutral-600">Størrelse: {item.size}</p>}
                        {item.color && <p className="text-sm text-neutral-600">Farge: {item.color}</p>}
                        <p className="text-sm text-neutral-600">Antall: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{item.price * item.quantity} {selectedOrder.currency}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Oppdater Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => selectedOrder.id && handleUpdateStatus(selectedOrder.id, e.target.value as Order['status'])}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tracking Nummer</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedOrder.tracking_number || ''}
                      onChange={(e) => selectedOrder.id && handleUpdateTracking(selectedOrder.id, e.target.value)}
                      className="flex-1 p-2 border rounded-md"
                      placeholder="Tracking nummer"
                    />
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Kundenotater</h4>
                    <p className="text-sm text-neutral-600">{selectedOrder.notes}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Admin Notater</label>
                  <textarea
                    value={selectedOrder.admin_notes || ''}
                    onChange={(e) => {
                      const updated = { ...selectedOrder, admin_notes: e.target.value };
                      setSelectedOrder(updated);
                      // Save to localStorage
                      const localData = LocalStorageService.get<Order>('orders');
                      const updatedData = localData.map(o => 
                        o.id === selectedOrder.id ? updated : o
                      );
                      LocalStorageService.set('orders', updatedData);
                    }}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Interne notater..."
                  />
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => handlePrintLabel(selectedOrder)}
                    className="w-full bg-brand-600 text-white py-3 px-4 rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                  >
                    <Printer size={20} />
                    <span>Print Label</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Label Window */}
      {printLabelOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4" style={{ paddingBottom: '120px' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[70vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold">Print Label</h3>
              <button
                onClick={() => setPrintLabelOrder(null)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            <div id="print-label-content" className="border-2 border-dashed border-gray-300 p-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold mb-2">FRA:</h2>
                <p className="font-semibold">DALELV RECORDS</p>
                <p>South Coast Norway</p>
              </div>
              <div className="border-t-2 border-gray-400 my-4"></div>
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold mb-2">TIL:</h2>
                <p className="font-semibold">{printLabelOrder.customer_name}</p>
                <p>{printLabelOrder.customer_address}</p>
                <p>{printLabelOrder.customer_postal_code} {printLabelOrder.customer_city}</p>
                <p>{printLabelOrder.customer_country}</p>
              </div>
              {printLabelOrder.tracking_number && (
                <div className="border-t-2 border-gray-400 my-4 pt-4 text-center">
                  <p className="text-sm font-semibold">Tracking: {printLabelOrder.tracking_number}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => {
                  const printContent = document.getElementById('print-label-content');
                  if (printContent) {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Shipping Label</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 20px; }
                              .label { border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
                              h2 { font-size: 18px; margin-bottom: 10px; }
                              p { margin: 5px 0; }
                            </style>
                          </head>
                          <body>
                            ${printContent.innerHTML}
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }
                }}
                className="flex-1 bg-brand-600 text-white py-3 px-4 rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <Printer size={20} />
                <span>Print</span>
              </button>
              <button
                onClick={() => setPrintLabelOrder(null)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

