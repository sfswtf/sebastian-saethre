import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '../../stores/languageStore';
import { Package, CheckCircle, XCircle, Clock } from 'lucide-react';

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  product_type?: string;
  delivery_method?: string;
}

interface Order {
  id?: string;
  order_number?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  order_items: OrderItem[];
  total_amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
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

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const localData = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(localData.sort((a: Order, b: Order) => 
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
      const localData = JSON.parse(localStorage.getItem('orders') || '[]');
      const updated = localData.map((o: Order) => 
        o.id === orderId ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o
      );
      localStorage.setItem('orders', JSON.stringify(updated));

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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      case 'confirmed':
      case 'processing':
        return <CheckCircle className="text-blue-600" size={20} />;
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
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
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
        <h2 className="text-2xl font-bold">Bestillinger</h2>
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
              statusFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            Venter
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                    Ingen bestillinger å vise
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
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
                      <span className="text-primary-600">
                        {t('common.edit')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
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
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Bestillingsdetaljer</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Status:</strong> {selectedOrder.status}</p>
                    <p><strong>Total:</strong> {selectedOrder.total_amount} {selectedOrder.currency}</p>
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
                        {item.product_type && <p className="text-sm text-neutral-600">Type: {item.product_type}</p>}
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
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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
                      const localData = JSON.parse(localStorage.getItem('orders') || '[]');
                      const updatedData = localData.map((o: Order) => 
                        o.id === selectedOrder.id ? updated : o
                      );
                      localStorage.setItem('orders', JSON.stringify(updatedData));
                    }}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Interne notater..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


