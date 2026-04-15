import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { useCartStore } from '../stores/cartStore';
import { ShoppingCart, ArrowLeft, CheckCircle, Copy, QrCode, Wallet, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { siteConfig } from '../config/siteConfig';
import { QRCodeSVG } from 'qrcode.react';

type PaymentMethod = 'manual' | 'crypto' | 'paypal';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, getTotal, removeItem } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('manual');
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: '',
  });

  // Calculate totals with discount
  const baseTotal = getTotal();
  const cryptoDiscount = paymentMethod === 'crypto' 
    ? (baseTotal * (siteConfig.payment.cryptoDiscountPercent || 0) / 100)
    : 0;
  const finalTotal = baseTotal - cryptoDiscount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get existing orders from localStorage (without admin_ prefix for orders)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const orderNumbers = existingOrders
        .map((o: any) => {
          const match = o.order_number?.match(/^ORD-(\d+)$/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter((n: number) => n > 0);
      const nextOrderNumber = orderNumbers.length > 0 
        ? Math.max(...orderNumbers) + 1 
        : 1;

      // Create order object
      const order = {
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order_number: `ORD-${nextOrderNumber.toString().padStart(4, '0')}`,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone || undefined,
        order_items: items.map(item => ({
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          product_type: item.product_type,
          delivery_method: item.delivery_method,
        })),
        total_amount: finalTotal,
        original_amount: baseTotal,
        discount_amount: cryptoDiscount,
        payment_method: paymentMethod,
        currency: 'NOK',
        status: 'pending' as const,
        notes: formData.notes || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to localStorage (without admin_ prefix)
      localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));

      // Clear cart
      clearCart();

      // Redirect to success page
      navigate(`/order-success?order=${order.order_number}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Kunne ikke fullføre bestillingen. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <AnimatedSection>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <h1 className="text-3xl font-bold mb-4">Handlekurven er tom</h1>
            <p className="text-neutral-600 mb-6">Legg til produkter i handlekurven før du går til kassen.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-semibold"
            >
              Gå til produkter
            </button>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Tilbake til produkter</span>
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Ordreoversikt</h2>
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-grow">
                      <p className="font-medium">{item.name}</p>
                      {item.product_type && (
                        <p className="text-sm text-neutral-500">Type: {item.product_type}</p>
                      )}
                      <p className="text-sm text-neutral-600">Antall: {item.quantity}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="font-semibold">{item.price * item.quantity} NOK</p>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Fjern fra handlekurv"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Subtotal:</span>
                    <span className="text-sm font-medium">{baseTotal} NOK</span>
                  </div>
                  {paymentMethod === 'crypto' && cryptoDiscount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="text-sm font-medium">Krypto-rabatt ({siteConfig.payment.cryptoDiscountPercent}%):</span>
                      <span className="text-sm font-bold">-{cryptoDiscount.toFixed(2)} NOK</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-semibold">Totalt:</span>
                    <span className="text-2xl font-bold text-brand-600">{finalTotal.toFixed(2)} NOK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Kontaktinformasjon</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Navn *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-post *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notater (valgfritt)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                    placeholder="Spesielle instruksjoner eller kommentarer..."
                  />
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Betalingsmetode *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-brand-400 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="manual"
                        checked={paymentMethod === 'manual'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="mr-3"
                      />
                      <div className="flex-grow">
                        <div className="font-medium">Manuell betaling</div>
                        <div className="text-sm text-neutral-500">Vi kontakter deg for betalingsinformasjon</div>
                      </div>
                    </label>
                    
                    {siteConfig.payment.solanaAddress && (
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-brand-400 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="crypto"
                          checked={paymentMethod === 'crypto'}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="mr-3"
                        />
                        <div className="flex-grow">
                          <div className="font-medium flex items-center gap-2">
                            <Wallet size={18} />
                            Kryptobetaling (Solana)
                            <span className="text-green-600 text-sm font-bold">-{siteConfig.payment.cryptoDiscountPercent}% rabatt!</span>
                          </div>
                          <div className="text-sm text-neutral-500">Betale med SOL og få {siteConfig.payment.cryptoDiscountPercent}% rabatt</div>
                        </div>
                      </label>
                    )}
                    
                    {siteConfig.payment.paypalClientId && (
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-brand-400 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="mr-3"
                        />
                        <div className="flex-grow">
                          <div className="font-medium">PayPal</div>
                          <div className="text-sm text-neutral-500">Sikker betaling via PayPal</div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Crypto Payment Instructions */}
                {paymentMethod === 'crypto' && siteConfig.payment.solanaAddress && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 mb-3">
                      <strong>Kryptobetaling:</strong> Send {finalTotal.toFixed(2)} NOK (eller tilsvarende SOL) til Solana-adressen vår. Du får {siteConfig.payment.cryptoDiscountPercent}% rabatt!
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowCryptoModal(true)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <QrCode size={18} />
                      <span>Vis Solana-adresse</span>
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 text-black py-4 px-6 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      <span>Behandler...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={24} />
                      <span>Fullfør bestilling</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Crypto Address Modal */}
      {showCryptoModal && siteConfig.payment.solanaAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold">Solana-adresse</h3>
              <button
                onClick={() => setShowCryptoModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-300 inline-block mb-4">
                {siteConfig.payment.solanaAddress && (
                  <QRCodeSVG
                    value={siteConfig.payment.solanaAddress}
                    size={192}
                    level="H"
                    includeMargin={true}
                  />
                )}
              </div>
              
              <p className="text-sm text-neutral-600 mb-2">
                Send <strong>{finalTotal.toFixed(2)} NOK</strong> (eller tilsvarende SOL) til denne adressen:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-mono text-sm break-all">
                  {siteConfig.payment.solanaAddress}
                </p>
              </div>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(siteConfig.payment.solanaAddress || '');
                  toast.success('Adresse kopiert!');
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Copy size={18} />
                <span>Kopier adresse</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatedSection>
  );
}

