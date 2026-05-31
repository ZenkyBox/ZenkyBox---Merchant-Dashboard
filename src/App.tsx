import React, { useState } from "react";
import { 
  Gift, 
  ShoppingBag, 
  Sparkles, 
  Trash2, 
  X, 
  Send, 
  MessageCircle, 
  ArrowRight, 
  Check, 
  Heart, 
  Sliders, 
  Briefcase, 
  Home, 
  Building2, 
  CheckCircle, 
  Loader2,
  Phone,
  Mail,
  AlertTriangle,
  FileSignature
} from "lucide-react";

import { Product, Inquiry, CustomBox, RecentOrder } from "./types";
import HomeView from "./components/HomeView";
import LabView from "./components/LabView";
import BulkView from "./components/BulkView";
import MerchantDashboard from "./components/MerchantDashboard";

// Base products list matching screens custom assets
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Zen Morning Ritual",
    price: 3800,
    stock: 80,
    status: "Active",
    category: "Personalized",
    description: "Clean minimalist wood box with single-origin slow drip artisan coffee beans, a handblown ceramic mug, and a lavender soy candle.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLREdMtDY97Hww-9_UrC-mlw0crJRhBcJEDQywAtMNl5tjsk_crpq2jKVZNlvN8nIEVAsIvG7oFxFcqoBjRVWsX716MR27UOlbEOVk4N0WNqyEQI1UP2O7aS5zgY3W1RtDBRSxqpVX7NCJnQzQjqE0EyIPu1JhkeI5sLfSKLnY5q-bFF62N3OZ8wePmRR4Wd_9bccX6bGznWxOLH5YsfFnKn_LVYu5SB0lzpqxkj6DyIbsOGIc-eGnTE9WQq8gBrnP-UrCExQJb1Zk",
    itemsInside: ["Handblown ceramic mug", "Artisan Coffee Beans (250g)", "Lavender Soy Candle"]
  },
  {
    id: "prod-2",
    name: "Sweet Celebration",
    price: 5800,
    stock: 12, // triggers low-stock alerts
    status: "Active",
    category: "Birthday",
    description: "Rainbow confetti box with handcrafted butter chocolate truffles, organic herbal fruit teas, and custom confetti poppers.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCG9EdUYf6PciYCyzB9PLSJ92QivahrCTOAPxTzxYFBQ3z7FxaTjb_d6JtgEBePxyRYZKB8K13_wGSqXY9vxQuTWfiy5Bgc9KdVpLWVobfA0yIij0bBXZIDpjlbY7IAq-skYyR5bLz2ky51cP_bSq08lsckc9TLdXPtZgX0UpI_k30auqvOa_ujn2GEqoYI48IbirIrM5EdqbMizqrtSxzKP9bpcuYGh7TxlWomp0eEmTfnRWGfMj3xC0ZOvwhJ58s_EkfxCsGtmx01",
    itemsInside: ["Handcrafted Butter Truffles", "Organic fruit tea selection", "Birthday Confetti Popper"]
  },
  {
    id: "prod-3",
    name: "Midnight Executive",
    price: 8900,
    stock: 4, // low stock alarm trigger!
    status: "Active",
    category: "Corporate",
    description: "Elegant jet-black box containing a full-grain leather pocket journal, active dual-coil desk charger, and a matching copper thermal tumbler.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlZT9OrslSZPJg-CVLEKfx3yqiDrSgXwW1fH45xihD_TWEOG-dB6nAx2Kv_0YitnOYYfndSd1JoamahD7ihVwagh1wXlEy_qABj3qfg74ze72w7VinykJ3zkeCxmCY-GCiN3sgJ1lnRwcqx1hybpvM9nIl8EVztW6mxfH4wnjzuuM5vpng5pZcnjuWrrHeei3ha3QEFnY_pwmkbcQV_4N_o5l5dttvKrvZNFHjrrHr-VYKk_n4Kw0d5pkkKHtZ-auoYNlF_bnv5aGN",
    itemsInside: ["Full grain leather journal", "Copper thermal tumbler", "Dual-coil Qi Desk charger"]
  },
  {
    id: "prod-4",
    name: "Kids Adventure Pack",
    price: 2200,
    stock: 95,
    status: "Active",
    category: "Kids",
    description: "Bright playful box filled with whimsical wooden puzzle block sets, non-toxic organic crayons, and a canvas explorer backpack.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQbbpJk_MC_KBuN0Hy30WKgjS4O3T73uwAYwfNPD6z01Vy2wI9KVlo7UmRqeomWz68jO1OOIjjaOBgtEd7mgqabjr8CSBE5GgAjEsD-8TBW36Gmrq72Gk-6PwtugLh-iku1mFcZNe8xFGmr_z5_7aV-Rjl1SMuvd_8FlzoQHpg-vtz_52eRtVEneQlczmQdTHRIiqI7HJ_54NqupVwIwB3itbwKfKffgVfbRr4onpg5_M6-GtDIlhH6u1LtO_uqqxVKApfBWpqMHZP",
    itemsInside: ["Wooden Puzzle blocks", "Non-toxic organic crayons", "Canvas explorer back-pack"]
  }
];

// Initial mock corporate inquiry list
const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: "inq-101",
    fullName: "Rahul Shah",
    companyName: "Wipro India",
    eventType: "Corporate Gift",
    quantity: 120,
    deliveryDate: "2026-06-25",
    requirements: "Engrave Wipro logo in silver lacquer. Include premium copper thermal flask set.",
    status: "Replied",
    createdAt: "May 30, 2026"
  }
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  isCustom?: boolean;
  message?: string;
  recipient?: string;
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<"home" | "lab" | "bulk" | "dashboard">("home");
  
  // Storage matrices
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  
  // Shopping cart operations
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  // Companion Mascot chatbot operations
  const [isMascotChatOpen, setIsMascotChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Barks of joy! I'm Zenky, your personal guide! 🦊 How can I help you customize your dream hamper box today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isMascotTyping, setIsMascotTyping] = useState(false);

  // App handlers: Products
  const handleAddProduct = (newProd: Omit<Product, "id">) => {
    const id = `prod-${Date.now()}`;
    setProducts((prev) => [...prev, { ...newProd, id }]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateProductStatus = (id: string, status: "Active" | "Draft") => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  // App handlers: Inquiries
  const handleAddInquiry = (newInq: Omit<Inquiry, "id" | "status" | "createdAt">) => {
    const id = `inq-${Date.now()}`;
    const createdAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setInquiries((prev) => [
      { ...newInq, id, status: "New", createdAt },
      ...prev
    ]);
  };

  const handleUpdateInquiryStatus = (id: string, status: "Replied" | "Completed") => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  // App handlers: Basket Cart
  const handleAddToCart = (prod: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === prod.id && !item.isCustom);
      if (existing) {
        return prev.map((item) => (item.id === prod.id && !item.isCustom ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { id: prod.id, name: prod.name, price: prod.price, qty: 1, image: prod.image }];
    });
    setIsCartOpen(true);
  };

  const handleAddCustomBoxToCart = (custom: {
    title: string;
    design: string;
    message: string;
    recipientName: string;
    photos: string[];
    price: number;
  }) => {
    const id = `custom-${Date.now()}`;
    setCart((prev) => [
      ...prev,
      {
        id,
        name: custom.title,
        price: custom.price,
        qty: 1,
        image: custom.photos[0] || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400",
        isCustom: true,
        message: custom.message,
        recipient: custom.recipientName
      }
    ]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id) {
        const nextQty = Math.max(1, item.qty + delta);
        return { ...item, qty: nextQty };
      }
      return item;
    }));
  };

  const getCartTotal = () => {
    return cart.reduce((acc, current) => acc + current.price * current.qty, 0);
  };

  // Chatbot transmission proxy
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatHistory((p) => [...p, { role: "user", text: userMsg }]);
    setChatInput("");
    setIsMascotTyping(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: chatHistory
        })
      });
      const data = await response.json();
      if (data.success && data.text) {
        setChatHistory((p) => [...p, { role: "assistant", text: data.text }]);
      }
    } catch (err) {
      console.error("Chat proxy failure:", err);
    } finally {
      setIsMascotTyping(false);
    }
  };

  const handleTriggerQuickChatOption = (promptText: string) => {
    setChatInput(promptText);
  };

  return (
    <div id="zenkybox-approot" className="min-h-screen bg-surface-mist flex flex-col justify-between font-body text-navy-deep antialiased">
      
      {/* Universal TopAppBar Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm border-b border-outline-variant/15 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo and branding title */}
          <div 
            onClick={() => setActiveScreen("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img 
                alt="Zenky Mascot Logo" 
                className="w-11 h-11 object-contain transition-transform group-hover:rotate-12 duration-300" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfzFsW7gjLeDSdcZKtUOlbMeFBNLhRChZSrEr8rpORAuT4VUZteXXUWzruIKG7yA6VPB7qDr2V4mXltJzyHndUj-iv3_QLWViHvbc83untCslKpnBTpL8W870xDHznMmerNz0B3p-KlVWvVtadTNIXfPUye5SZE4ch9nSzmy5jJwVNJj2CDAN_OlZoZkVS5C-2A8sgmz9MdKXUTVB1GlbCPNNLP9QY5wYH4FWKpptrROmBcbNQLsOFMobcu4VOto3qGWvijiSbEI4-" 
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <h1 className="text-xl font-black text-navy-deep tracking-wider flex items-center gap-1.5 font-sans leading-none">
                Zenky<span className="text-[#F47B20]">Box</span>
              </h1>
              <span className="text-[10px] text-on-surface-variant font-medium tracking-tight mt-1 animate-pulse">Thoughtful Gifts. Joyful Moments.</span>
            </div>
          </div>

          {/* Nav Links center */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-extrabold font-sans">
            {[
              { id: "home", label: "Curated Store", icon: Home },
              { id: "lab", label: "Personalization Lab", icon: Sliders },
              { id: "bulk", label: "Bulk Gifting", icon: Building2 },
              { id: "dashboard", label: "Merchant Dashboard", icon: Briefcase }
            ].map((scree) => {
              const IsSel = activeScreen === scree.id;
              return (
                <button 
                  key={scree.id}
                  onClick={() => setActiveScreen(scree.id as any)}
                  className={`flex items-center gap-1.5 transition-colors relative pb-1 ${
                    IsSel ? "text-[#F47B20]" : "text-navy-deep/80 hover:text-navy-deep"
                  }`}
                >
                  <scree.icon className="w-4 h-4 shrink-0" />
                  <span>{scree.label}</span>
                  {IsSel && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F47B20] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right quick triggers: Cart and Mascot button */}
          <div className="flex items-center gap-3">
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-outline-variant/30 text-navy-deep hover:bg-neutral-50 active:scale-90 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="bg-[#ba1a1a] text-white text-[10px] font-sans font-extrabold h-5 w-5 rounded-full flex items-center justify-center shadow">
                  {cart.reduce((s, c) => s + c.qty, 0)}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsMascotChatOpen(!isMascotChatOpen)}
              className="px-4 py-2 bg-royal-purple hover:bg-opacity-95 text-white font-sans text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-joy-yellow animate-bounce" />
              <span className="hidden sm:inline">Ask Zenky</span>
            </button>

          </div>

        </div>
      </header>

      {/* App Mobile Bottom Tabs layout */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant/15 z-30 py-2 px-4 shadow-xl flex justify-around">
        {[
          { id: "home", label: "Store", icon: Home },
          { id: "lab", label: "Lab", icon: Sliders },
          { id: "bulk", label: "Bulk", icon: Building2 },
          { id: "dashboard", label: "Admin", icon: Briefcase }
        ].map((scree) => {
          const IsSel = activeScreen === scree.id;
          return (
            <button 
              key={scree.id}
              onClick={() => setActiveScreen(scree.id as any)}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                IsSel ? "text-[#F47B20] font-black" : "text-navy-deep/60"
              }`}
            >
              <scree.icon className="w-5 h-5 shrink-0" />
              <span>{scree.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main viewport Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 mt-1.5 mb-16 md:mb-0">
        
        {/* Render selected route */}
        {activeScreen === "home" && (
          <HomeView 
            onNavigate={(sc) => setActiveScreen(sc as any)}
            products={products}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeScreen === "lab" && (
          <LabView 
            onAddCustomBoxToCart={handleAddCustomBoxToCart}
          />
        )}

        {activeScreen === "bulk" && (
          <BulkView 
            onAddInquiry={handleAddInquiry}
          />
        )}

        {activeScreen === "dashboard" && (
          <MerchantDashboard 
            products={products}
            inquiries={inquiries}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProductStatus={handleUpdateProductStatus}
            onUpdateInquiryStatus={handleUpdateInquiryStatus}
          />
        )}

      </main>

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <div id="cart-overlay-shadow" className="fixed inset-0 bg-navy-deep/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative z-10 animate-[slideRight_0.3s_ease]">
            
            <div className="p-6 bg-navy-deep text-white flex justify-between items-center">
              <div className="flex items-center gap-2 font-sans font-extrabold text-lg">
                <ShoppingBag className="w-5 h-5 text-zenky-orange" />
                <h3>Your Crate Basket ({cart.length})</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-white hover:opacity-85 hover:bg-white/10 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart list content scroll */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar text-navy-deep">
              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <Gift className="w-16 h-16 text-outline-variant/40 mx-auto" />
                  <p className="font-bold text-on-surface-variant">Your unboxing cart is empty!</p>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveScreen("home");
                    }}
                    className="px-6 py-2.5 bg-royal-purple text-white text-xs font-bold rounded-xl"
                  >
                    Browse Bundles
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-xl hover:bg-surface-mist border border-outline-variant/10">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-mist shrink-0">
                      <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                    </div>

                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-navy-deep leading-tight">{item.name}</h4>
                        
                        {/* Custom hamper spec tag details */}
                        {item.isCustom && (
                          <div className="text-[10px] text-royal-purple font-sans font-semibold mt-1 space-y-0.5">
                            <p>👤 Recipient: {item.recipient || "N/A"}</p>
                            <p className="line-clamp-1 italic text-on-surface-variant">"{item.message}"</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-bold text-sm text-zenky-orange">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                        
                        <div className="flex items-center gap-2.5">
                          <button 
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-6 h-6 border rounded flex items-center justify-center hover:bg-white font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold">{item.qty}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-6 h-6 border rounded flex items-center justify-center hover:bg-white font-bold"
                          >
                            +
                          </button>
                          <button 
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-red-700 hover:scale-105 ml-1.5"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart footer calculations & payment */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-outline-variant/15 bg-surface-mist">
                <div className="space-y-4 font-sans font-extrabold text-navy-deep">
                  <div className="flex justify-between items-center text-xs text-on-surface-variant">
                    <span>Crate Subtotal:</span>
                    <span>₹{getCartTotal().toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-on-surface-variant">
                    <span>Express Shipping:</span>
                    <span className="text-green-700">FREE INCLUDED</span>
                  </div>

                  <div className="flex justify-between items-center text-base pt-2 border-t border-outline-variant/10">
                    <span>Est. Grand Total:</span>
                    <span className="text-xl text-[#F47B20]">₹{getCartTotal().toLocaleString("en-IN")}</span>
                  </div>

                  <button 
                    onClick={() => {
                      setShowCheckoutSuccess(true);
                      setCart([]);
                    }}
                    className="w-full py-4 bg-[#F47B20] text-white hover:bg-opacity-95 font-sans font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    Secure checkout / Place order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Mascot Companion Chat Panel (Zenky Assistant Widget) */}
      {isMascotChatOpen && (
        <div id="zenky-floater-window" className="fixed bottom-20 md:bottom-6 right-4 z-40 w-full max-w-[340px] md:max-w-[365px] bg-white rounded-3xl border-2 border-orange-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-[slideUp_0.25s_ease]">
          
          {/* Header of fox mascot */}
          <div className="p-4 bg-gradient-to-r from-navy-deep to-[#241913] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img 
                  alt="Zenky active" 
                  className="w-9 h-9 rounded-full object-contain border border-zenky-orange bg-white p-0.5" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfzFsW7gjLeDSdcZKtUOlbMeFBNLhRChZSrEr8rpORAuT4VUZteXXUWzruIKG7yA6VPB7qDr2V4mXltJzyHndUj-iv3_QLWViHvbc83untCslKpnBTpL8W870xDHznMmerNz0B3p-KlVWvVtadTNIXfPUye5SZE4ch9nSzmy5jJwVNJj2CDAN_OlZoZkVS5C-2A8sgmz9MdKXUTVB1GlbCPNNLP9QY5wYH4FWKpptrROmBcbNQLsOFMobcu4VOto3qGWvijiSbEI4-" 
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-navy-deep"></span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm font-sans flex items-center gap-1.5 text-joy-yellow">
                  Zenky Mascot
                </h4>
                <p className="text-[9px] text-white/70 font-medium">Smart Gifting Assistant (Gemini)</p>
              </div>
            </div>

            <button 
              onClick={() => setIsMascotChatOpen(false)}
              className="text-white hover:opacity-80 rounded-full hover:bg-white/10 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversational scroll area */}
          <div className="h-64 overflow-y-auto p-4 space-y-4 custom-scrollbar text-navy-deep text-xs font-body bg-orange-50/15">
            {chatHistory.map((ch, idx) => (
              <div key={idx} className={`flex ${ch.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  ch.role === "user" ? "bg-royal-purple text-white rounded-tr-sm" : "bg-white text-navy-deep border border-orange-200/50 rounded-tl-sm shadow-sm"
                }`}>
                  <p>{ch.text}</p>
                </div>
              </div>
            ))}
            
            {isMascotTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-orange-100 p-3 rounded-2xl flex items-center gap-2 text-on-surface-variant font-medium">
                  <Loader2 className="w-4 h-4 text-zenky-orange animate-spin" />
                  <span>Zenky is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick-chips interaction options */}
          <div className="px-4 py-2 border-t border-orange-100 flex gap-1.5 overflow-x-auto custom-scrollbar bg-white whitespace-nowrap">
            {[
              { l: "Gift suggestion 🎁", p: "Hi Zenky, please suggest a sweet customized wax/spa themed hamper box." },
              { l: "Bulk quotes 📦", p: "How does corporate bulk discount calculation and laser engraving work?" },
              { l: "Custom Lab 🧪", p: "Explain the live rendering unboxing card photos feature in personalization lab." }
            ].map((chip, i) => (
              <button 
                key={i}
                type="button"
                onClick={() => handleTriggerQuickChatOption(chip.p)}
                className="px-2.5 py-1 text-[10px] bg-orange-50 hover:bg-orange-100 rounded-full font-bold text-[#994700] border border-orange-200/20"
              >
                {chip.l}
              </button>
            ))}
          </div>

          {/* Dispatch message input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-orange-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask Zenky..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-grow px-3.5 py-2.5 bg-surface-mist border border-orange-200/30 rounded-xl text-xs font-body text-navy-deep focus:outline-none"
            />
            <button 
              type="submit"
              className="px-3 py-2 bg-zenky-orange text-white rounded-xl hover:bg-opacity-95 text-xs font-bold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

      {/* Global simulated Checkout Success Screen Overlay */}
      {showCheckoutSuccess && (
        <div id="checkout-track-modal" className="fixed inset-0 bg-navy-deep/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 md:p-10 w-full max-w-lg text-center shadow-2xl relative overflow-hidden text-navy-deep font-sans">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#fff2e6] rounded-full -mt-16 -mr-16 -z-10 animate-pulse"></div>

            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4 animate-[bounce_1.5s_infinite]" />
            <span className="inline-block px-3 py-1 bg-green-50 text-green-700 font-extrabold text-[10px] uppercase rounded-full tracking-wider mb-2">
              Payment Confirmed
            </span>

            <h3 className="text-3xl font-black">Order Placed Successfully!</h3>
            <p className="text-sm text-on-surface-variant max-w-sm mx-auto mt-2 leading-relaxed">
              FedEx tracking ID: <strong>ZB-TX9402-IN</strong> is registered. We have printed your memories and dispatched them to Zenky's warehouse workshop!
            </p>

            {/* Simulated order tracker pipeline */}
            <div className="my-8 bg-surface-mist p-5 rounded-2xl border border-outline-variant/10 text-xs">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-green-400 -translate-y-1/2 -z-10"></div>
                
                <div className="flex flex-col items-center gap-1.5 relative z-10">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                  <span className="text-[10px] font-bold">Unboxed</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 relative z-10 animate-pulse">
                  <div className="w-6 h-6 bg-zenky-orange text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <span className="text-[10px] font-bold text-[#F47B20]">AI Engraving</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 relative z-10">
                  <div className="w-6 h-6 bg-neutral-300 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <span className="text-[10px] font-bold text-on-surface-variant/70">Transit</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button 
                onClick={() => {
                  setShowCheckoutSuccess(false);
                  setActiveScreen("home");
                }}
                className="flex-1 py-3.5 bg-navy-deep text-white font-bold rounded-xl active:scale-95 transition-all text-xs"
              >
                Back To Store Showcase
              </button>
              <button 
                onClick={() => {
                  setShowCheckoutSuccess(false);
                  setActiveScreen("dashboard");
                }}
                className="flex-1 py-3.5 border border-outline-variant text-navy-deep font-bold rounded-xl hover:bg-neutral-50 transition-colors text-xs"
              >
                Go to Merchant Portal
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Universal Footer */}
      <footer className="bg-navy-deep text-white py-12 px-4 md:px-8 relative overflow-hidden border-t-4 border-zenky-orange">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #ffd700 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch justify-between gap-10">
          
          <div className="space-y-4 max-w-sm">
            <h4 className="text-xl font-black font-sans flex items-center gap-2">
              Zenky<span className="text-[#F47B20]">Box</span>
            </h4>
            <p className="text-xs text-white/70 leading-relaxed font-body">
              Whimsical, elite, custom-tailored unboxing suites for high-integrity events and personal gifting landmarks. Handassembled in Bangalore, India.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-sans font-extrabold text-[#fff5ee]">
            <div className="space-y-3">
              <h5 className="uppercase text-joy-yellow tracking-wider font-extrabold text-[10px]">Curation Lab</h5>
              <p onClick={() => { setActiveScreen("lab"); }} className="hover:text-zenky-orange cursor-pointer">Interactive Wizard</p>
              <p onClick={() => { setActiveScreen("bulk"); }} className="hover:text-zenky-orange cursor-pointer">Corporate Quote</p>
              <p onClick={() => { setActiveScreen("dashboard"); }} className="hover:text-zenky-orange cursor-pointer">Merchant dashboard</p>
            </div>

            <div className="space-y-3">
              <h5 className="uppercase text-joy-yellow tracking-wider font-extrabold text-[10px]">Active Help</h5>
              <div className="flex items-center gap-1.5 text-white/80">
                <Mail className="w-3.5 h-3.5" /> <span>support@zenkybox.in</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <Phone className="w-3.5 h-3.5" /> <span>+91 9102-443-110</span>
              </div>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h5 className="uppercase text-joy-yellow tracking-wider font-extrabold text-[10px]">Zenky Mascot</h5>
              <p className="text-[10px] text-white/60 leading-relaxed">
                "Our cheering orange fox Zenky uses server-side Google Gemini 3.5 Flash capabilities to optimize prose!"
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] text-white/50 leading-relaxed gap-4 font-sans font-extrabold pb-12 md:pb-0">
          <span>&copy; 2026 ZenkyBox Gifting Inc. All rights reserved. Made in Bangalore.</span>
          <div className="flex gap-4">
            <span>Security rules compiled</span>
            <span>Terms of connection</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
