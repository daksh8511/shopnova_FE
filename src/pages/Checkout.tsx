import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  MapPin,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldCheck,
  CreditCard,
  Building,
  Navigation,
  Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import useCartStore from '../stores/cart';
import useAuthStore from '../stores/user';
import NodeApi from '../NodeApi';
import userGuestCheckout from '../stores/guestCheckout';

interface NormalizedItem {
  productId: string;
  cartItemId?: string;
  title: string;
  price: number;
  image: string;
  category?: string;
  qty: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, addCartItem, clearCart } = useCartStore();
  const { user, token, updateUserAddress } = useAuthStore();
  const { guestCheckout, setGuestCheckout } = userGuestCheckout()
  const checkoutAddress = token ? user?.address : guestCheckout?.address
  const [loadingCart, setLoadingCart] = useState(false)
  const [remoteItems, setRemoteItems] = useState<NormalizedItem[]>([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [areaInput, setAreaInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [stateInput, setStateInput] = useState('');
  const [pincodeInput, setPincodeInput] = useState<string | number>('');
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressSuccessMsg, setAddressSuccessMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>('');

  const fetchCart = async () => {
    if (!token || !user?._id) return;
    setLoadingCart(true);
    try {
      const response = await NodeApi.get(`/cart/get/${user._id}`);
      if (response?.data?.success) {
        const rawItems = response.data.carts[0]?.items || [];
        const normalized: NormalizedItem[] = rawItems
          .filter((it) => it.product)
          .map((it) => ({
            productId: it.product._id,
            cartItemId: it._id,
            title: it.product.title || 'Product',
            price: Number(it.product.price) || 0,
            image: it.product.image || '',
            category: it.product.category || 'General',
            qty: Number(it.qty) || 1,
          }));
        setRemoteItems(normalized);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user, token]);

  // Sync inputs if user address updates
  useEffect(() => {
    const address = token
      ? user?.address
      : guestCheckout?.address;

    setAreaInput(address?.area || '');
    setCityInput(address?.city || '');
    setStateInput(address?.state || '');
    setPincodeInput(address?.pincode || '');
  }, [
    token,
    user?.address,
    guestCheckout?.address,
  ]);

  // Active items list (remote if logged in, local store if guest)
  const items: NormalizedItem[] = token
    ? remoteItems
    : cart.map((c) => ({
      productId: c._id,
      title: c.title,
      price: Number(c.price) || 0,
      image: c.image,
      category: c.category,
      qty: c.qty || 1,
    }));

  // Address validation check
  const currentAddress = checkoutAddress; // Use combined address (guest or logged-in)
  const hasAddress = Boolean(
    currentAddress &&
    currentAddress.area?.trim() &&
    currentAddress.city?.trim() &&
    currentAddress.state?.trim() &&
    Number(currentAddress.pincode) > 0
  );

  // Price calculations
  const totalQty = items.reduce((acc, item) => acc + item.qty, 0);
  const originalSubtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Discount calculations
  const discountAmount = Math.round((originalSubtotal * 10) / 100);
  const subtotalAfterDiscount = originalSubtotal - discountAmount;
  const deliveryFee = originalSubtotal > 999 || originalSubtotal === 0 ? 0 : 99;
  const finalTotalPrice = subtotalAfterDiscount + deliveryFee;

  // Quantity updates
  const handleQuantityChange = async (item: NormalizedItem, delta: number) => {
    const newQty = item.qty + delta;
    if (newQty <= 0) {
      await handleRemoveItem(item);
      return;
    }

    if (token && user?._id) {
      try {
        await NodeApi.post('/cart/update_product', {
          userId: user._id,
          productId: item.productId,
          qty: newQty,
        });
        setRemoteItems((prev) =>
          prev.map((it) => (it.productId === item.productId ? { ...it, qty: newQty } : it))
        );
        window.dispatchEvent(new Event('cart:updated'));
      } catch (err) {
        console.error('Failed to update quantity', err);
      }
    } else {
      addCartItem({
        _id: item.productId,
        title: item.title,
        price: item.price,
        image: item.image,
        category: item.category || '',
        qty: delta,
      });
    }
  };

  const handleRemoveItem = async (item: NormalizedItem) => {
    if (token && user?._id) {
      try {
        const cartItemId = item.cartItemId;
        await NodeApi.post('/cart/product_remove', {
          userId: user._id,
          productId: cartItemId || item.productId,
        });
        setRemoteItems((prev) => prev.filter((it) => it.productId !== item.productId));
        window.dispatchEvent(new Event('cart:updated'));
      } catch (err) {
        console.error('Failed to remove item', err);
      }
    } else {
      removeFromCart({ _id: item.productId } as any);
    }
  };

  // Save address action
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    setSavingAddress(true);
    setAddressSuccessMsg(null);

    const newAddress = {
      area: areaInput.trim(),
      city: cityInput.trim(),
      state: stateInput.trim(),
      pincode: Number(pincodeInput),
    };

    try {
      if (token && user?._id) {
        // Logged-in user → backend + user store
        const response = await NodeApi.put(
          `/auth/set_address/${user._id}`,
          newAddress
        );

        if (response?.data?.success) {
          updateUserAddress(newAddress);

          setAddressSuccessMsg(
            'Address updated successfully!'
          );
        }
      } else {
        // Guest → localStorage through Zustand persist
        setGuestCheckout({
          address: newAddress,
        });

        setAddressSuccessMsg('Address saved!');
      }

      setTimeout(() => {
        setAddressModalOpen(false);
        setAddressSuccessMsg(null);
      }, 800);

    } catch (err) {
      console.error('Failed to update address', err);

      setAddressSuccessMsg(
        'Failed to update address. Please try again.'
      );
    } finally {
      setSavingAddress(false);
    }
  };

  // Payment process simulation
  const handleProceedToPayment = () => {
    if (!hasAddress || items.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const generatedId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      setPlacedOrderId(generatedId);
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 1500);
  };

  return (
    <>
      {
        loadingCart ?
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          : <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors my-2"
                  >
                    <ArrowLeft size={16} />
                    Continue Shopping
                  </Link>
                  <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                    Checkout
                  </h1>
                </div>
              </div>

              {items.length === 0 && !orderComplete ? (
                <div className="bg-zinc-950 border border-white/10 rounded-2xl p-12 text-center max-w-md mx-auto my-12">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                    <ShoppingCart size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your Cart is Empty</h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    Looks like you haven't added any products to your cart yet.
                  </p>
                  <Link to="/products">
                    <Button className="bg-white text-black hover:bg-zinc-200 font-semibold">
                      Explore Products
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-6">

                    {/* 1. Added Products in Cart */}
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <ShoppingCart size={20} className="text-zinc-300" />
                        <h2 className="text-lg font-bold text-white">Items in Cart</h2>
                      </div>

                      <div className="space-y-4">
                        {items.map((item) => {
                          const itemTotal = item.price * item.qty;
                          return (
                            <div
                              key={item.productId}
                              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-white/10 transition-all"
                            >
                              <div className="flex items-center gap-4 min-w-0 flex-1">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0 bg-zinc-800"
                                />
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-white truncate text-base mb-1">
                                    {item.title}
                                  </h3>
                                  {item.category && (
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                                      {item.category}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-400">Unit Price:</span>
                                    <span className="font-semibold text-sm text-zinc-200">
                                      ₹{item.price.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                                {/* Quantity Selector */}
                                <div className="flex items-center gap-2 bg-zinc-950 border border-white/10 rounded-lg p-1">
                                  <button
                                    onClick={() => handleQuantityChange(item, -1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 text-zinc-300 transition-colors"
                                    title="Decrease quantity"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-8 text-center text-sm font-bold font-mono">
                                    {item.qty}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(item, 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 text-zinc-300 transition-colors"
                                    title="Increase quantity"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>

                                {/* Item Subtotal & Delete */}
                                <div className="text-right">
                                  <div className="text-xs text-zinc-500">Subtotal</div>
                                  <div className="font-bold text-white text-base">
                                    ₹{itemTotal.toLocaleString('en-IN')}
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleRemoveItem(item)}
                                  className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="Remove product"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. User Delivery Address Section */}
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <MapPin size={20} className="text-zinc-300" />
                          <h2 className="text-lg font-bold text-white">Shipping Address</h2>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddressModalOpen(true)}
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent text-xs"
                        >
                          {hasAddress ? 'Edit Address' : '+ Add Address'}
                        </Button>
                      </div>

                      {hasAddress ? (
                        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
                          <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                          <div className="space-y-1 text-sm">
                            <div className="font-semibold text-emerald-300 flex items-center gap-2">
                              {token ? 'Deliver to Saved Address' : 'Delivery Address'}
                            </div>
                            <p className="text-zinc-200 font-medium">
                              {checkoutAddress?.area}
                            </p>
                            <p className="text-zinc-400 text-xs">
                              {checkoutAddress?.city}, {checkoutAddress?.state} — {checkoutAddress?.pincode}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                          <AlertCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
                          <div className="space-y-2 flex-1">
                            <p className="text-sm font-semibold text-amber-300">
                              No Shipping Address Added
                            </p>
                            <p className="text-xs text-zinc-400">
                              You must add a delivery address before you can proceed to payment.
                            </p>
                            <Button
                              onClick={() => setAddressModalOpen(true)}
                              className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-4 py-1.5 h-auto rounded-lg"
                            >
                              + Add Delivery Address Now
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Total Price & Order Summary (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-24">
                      <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
                        <span>Order Summary</span>
                      </h2>

                      <div className="space-y-4 text-sm mb-6">
                        <div className="flex justify-between text-zinc-400">
                          <span>Total items</span>
                          <span className="text-white font-semibold font-mono">{cart?.length > 0 ? cart?.length : remoteItems?.length}</span>
                        </div>

                        <div className="flex justify-between text-zinc-400">
                          <span>Original Subtotal</span>
                          <span className="text-white font-semibold font-mono">
                            ₹{originalSubtotal.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex justify-between text-emerald-400">
                          <span className="flex items-center gap-1">
                            <Tag size={13} />
                            Discount ({10}%)
                          </span>
                          <span className="font-semibold font-mono">
                            -₹{discountAmount.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex justify-between text-zinc-400">
                          <span>Delivery Fee</span>
                          <span className="text-white font-semibold font-mono">
                            {deliveryFee === 0 ? (
                              <span className="text-emerald-400">FREE</span>
                            ) : (
                              `₹${deliveryFee}`
                            )}
                          </span>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                          <div>
                            <span className="text-base font-bold text-white block">Total Price</span>
                            <span className="text-xs text-zinc-500">Includes all taxes</span>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-white tracking-tight font-mono">
                              ₹{finalTotalPrice.toLocaleString('en-IN')}
                            </span>
                            {discountAmount > 0 && (
                              <span className="block text-xs text-emerald-400 font-medium">
                                You save ₹{discountAmount.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address Status Banner */}
                      <div className="mb-6">
                        {hasAddress ? (
                          <div className="p-3 bg-zinc-900 rounded-xl border border-white/10 text-xs text-zinc-300 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                            <span className="truncate">
                              Shipping to <strong>{checkoutAddress?.city} ({checkoutAddress?.pincode})</strong>
                            </span>
                          </div>
                        ) : (
                          <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                            <AlertCircle size={16} className="text-red-400 shrink-0" />
                            <span>Address required before payment can be completed.</span>
                          </div>
                        )}
                      </div>

                      {/* Main Payment Button */}
                      <Button
                        onClick={handleProceedToPayment}
                        disabled={!hasAddress || items.length === 0 || isProcessing}
                        className={`w-full h-12 text-base font-bold transition-all ${hasAddress && items.length > 0
                          ? 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/10'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                          }`}
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Processing Payment...
                          </span>
                        ) : !hasAddress ? (
                          'Add Address to Pay'
                        ) : (
                          `Proceed to Payment • ₹${finalTotalPrice.toLocaleString('en-IN')}`
                        )}
                      </Button>

                      {!hasAddress && (
                        <p className="text-[11px] text-center text-zinc-500 mt-2">
                          Payment button disabled until shipping address is provided.
                        </p>
                      )}

                      <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                          <span>100% Secure Checkout with SSL Encryption</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                          <CreditCard size={16} className="text-zinc-300 shrink-0" />
                          <span>Supports UPI, Cards, NetBanking & COD</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* Address Modal Dialog */}
              <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
                <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      <MapPin size={20} className="text-zinc-300" />
                      {hasAddress ? 'Edit Shipping Address' : 'Add Shipping Address'}
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
                    <div>
                      <Label className="text-xs text-zinc-400">Street / Area / Flat / House No.</Label>
                      <div className="relative mt-1">
                        <Building size={16} className="absolute left-3 top-3 text-zinc-500" />
                        <Input
                          placeholder="e.g. 102, Sunrise Heights, MG Road"
                          value={areaInput}
                          onChange={(e) => setAreaInput(e.target.value)}
                          className="pl-9 bg-zinc-900 border-zinc-800 text-white text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-zinc-400">City</Label>
                        <div className="relative mt-1">
                          <Navigation size={16} className="absolute left-3 top-3 text-zinc-500" />
                          <Input
                            placeholder="e.g. Mumbai"
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            className="pl-9 bg-zinc-900 border-zinc-800 text-white text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-zinc-400">State</Label>
                        <Input
                          placeholder="e.g. Maharashtra"
                          value={stateInput}
                          onChange={(e) => setStateInput(e.target.value)}
                          className="bg-zinc-900 border-zinc-800 text-white text-sm mt-1"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-zinc-400">Pincode</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 400001"
                        value={pincodeInput}
                        onChange={(e) => setPincodeInput(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-white text-sm mt-1"
                        required
                      />
                    </div>

                    {addressSuccessMsg && (
                      <p className={`text-xs ${addressSuccessMsg.includes('success') || addressSuccessMsg.includes('saved') ? 'text-emerald-400' : 'text-red-400'}`}>
                        {addressSuccessMsg}
                      </p>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setAddressModalOpen(false)}
                        className="flex-1 border-white/10 text-white hover:bg-white/10 bg-transparent"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={savingAddress}
                        className="flex-1 bg-white text-black hover:bg-zinc-200 font-semibold"
                      >
                        {savingAddress ? 'Saving...' : 'Save Address'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Order Placement Success Dialog */}
              <Dialog open={orderComplete} onOpenChange={setOrderComplete}>
                <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white text-center">
                  <div className="py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                      <CheckCircle2 size={36} />
                    </div>
                    <h2 className="text-2xl font-black text-white">Order Placed Successfully!</h2>
                    <p className="text-sm text-zinc-400">
                      Thank you for your order. We have received your payment and are preparing your package.
                    </p>

                    <div className="bg-zinc-900 p-4 rounded-xl border border-white/10 text-left text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Order ID:</span>
                        <span className="font-mono text-white font-bold">{placedOrderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Total Items:</span>
                        <span className="text-white font-semibold">{totalQty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Total Paid:</span>
                        <span className="text-emerald-400 font-bold font-mono">
                          ₹{finalTotalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2">
                        <span className="text-zinc-500">Delivery Address:</span>
                        <span className="text-zinc-300 font-medium text-right max-w-[200px] truncate">
                          {checkoutAddress?.city}, {checkoutAddress?.state} ({checkoutAddress?.pincode})
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setOrderComplete(false);
                        navigate('/products');
                      }}
                      className="w-full bg-white text-black hover:bg-zinc-200 font-semibold"
                    >
                      Back to Shopping
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
      }

    </>
  );
};

export default Checkout;