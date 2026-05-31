import React, { useState } from "react";
import { 
  BarChart2, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  Trash2, 
  Plus, 
  Check, 
  Loader2, 
  X, 
  MoreVertical, 
  RefreshCw, 
  FileText, 
  Gift, 
  ToggleLeft, 
  ToggleRight,
  Filter,
  CheckCircle2
} from "lucide-react";
import { Product, Inquiry, RecentOrder } from "../types";

// Pre-configured mocked order records
const RECENT_ORDERS: RecentOrder[] = [
  { id: "ZB-9402", customer: "Amrita Sen", status: "Processing", total: 3800, date: "May 31, 2026" },
  { id: "ZB-9401", customer: "Rahul Shah (Wipro)", status: "Shipped", total: 68500, date: "May 30, 2026" },
  { id: "ZB-9399", customer: "Nisha Patel", status: "Delivered", total: 6250, date: "May 29, 2026" },
  { id: "ZB-9395", customer: "Carmel School", status: "Processing", total: 24500, date: "May 28, 2026" }
];

interface MerchantDashboardProps {
  products: Product[];
  inquiries: Inquiry[];
  onAddProduct: (product: Omit<Product, "id">) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProductStatus: (id: string, status: "Active" | "Draft") => void;
  onUpdateInquiryStatus: (id: string, status: "Replied" | "Completed") => void;
}

export default function MerchantDashboard({
  products,
  inquiries,
  onAddProduct,
  onDeleteProduct,
  onUpdateProductStatus,
  onUpdateInquiryStatus
}: MerchantDashboardProps) {
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"Overview" | "Products" | "Inquiries">("Overview");

  // Product Filter
  const [productFilter, setProductFilter] = useState<string>("All");

  // New product form states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState<number>(3500);
  const [newProdStock, setNewProdStock] = useState<number>(45);
  const [newProdCategory, setNewProdCategory] = useState<Product["category"]>("Birthday");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState("https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400");
  const [innerItemDraft, setInnerItemDraft] = useState("");
  const [innerItemsList, setInnerItemsList] = useState<string[]>([
    "Scented Soy Wax Candle",
    "Engraved Bamboo Box Lid",
    "Organic Saffron Toffee Pack"
  ]);

  // Intent delete protection locks
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Quick stats calculations
  const totalRevenue = RECENT_ORDERS.reduce((acc, curr) => acc + curr.total, 0) + 145000;
  const lowStockProducts = products.filter((p) => p.stock < 15);
  const activeInquiries = inquiries.filter((inq) => inq.status === "New");

  // Form Inside-the-Box lines handlers
  const handleAddInnerLineItem = () => {
    if (innerItemDraft.trim()) {
      setInnerItemsList((prev) => [...prev, innerItemDraft.trim()]);
      setInnerItemDraft("");
    }
  };

  const handleRemoveInnerLineItem = (index: number) => {
    setInnerItemsList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || newProdPrice <= 0) return;

    onAddProduct({
      name: newProdName,
      price: newProdPrice,
      stock: newProdStock,
      status: "Active",
      category: newProdCategory,
      description: newProdDesc,
      image: newProdImage,
      itemsInside: innerItemsList
    });

    // Reset Form
    setNewProdName("");
    setNewProdDesc("");
    setInnerItemsList(["Scented Soy Wax Candle", "Engraved Bamboo Box Lid"]);
    setShowAddModal(false);
  };

  // Filtered Products list
  const filteredProducts = products.filter((p) => {
    if (productFilter === "All") return true;
    return p.category === productFilter;
  });

  return (
    <div id="merchant-dashboard-workspace" className="space-y-10 pb-16 font-sans">
      
      {/* Top action header */}
      <section id="merchant-control-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-navy-deep">Merchant HQ Portal</h2>
          <p className="text-sm text-on-surface-variant">Store configuration, active order databases, & AI catalog modules</p>
        </div>
        
        {/* Tab switch navigation */}
        <div className="flex bg-surface-container rounded-xl p-1 shrink-0 border border-outline-variant/30 font-semibold self-start sm:self-auto">
          {(["Overview", "Products", "Inquiries"] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab ? "bg-white text-royal-purple shadow-sm" : "text-on-surface-variant hover:text-navy-deep"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Overview Analytics KPI Widget lists */}
      {activeTab === "Overview" && (
        <div id="merchant-overview-segment" className="space-y-10">
          
          {/* Quick Stats Grid */}
          <section id="kpi-metric-cards" className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Total Catalog Revenue</span>
                <p className="text-2.5xl font-extrabold text-navy-deep font-sans">₹{totalRevenue.toLocaleString()}</p>
                <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-bold">↑ 18% month</span>
              </div>
              <div className="w-12 h-12 bg-primary-fixed text-[#994700] rounded-xl flex items-center justify-center">
                <BarChart2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Total Magic Boxes</span>
                <p className="text-2.5xl font-extrabold text-navy-deep font-sans">{products.length} Products</p>
                <span className="text-[10px] text-royal-purple bg-royal-purple/5 px-2 py-0.5 rounded-full font-bold">Standard Catalogs</span>
              </div>
              <div className="w-12 h-12 bg-royal-purple/5 text-royal-purple rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#ffd700]/30 shadow-sm flex items-center justify-between relative overflow-hidden">
              {lowStockProducts.length > 0 && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-hot-pink rounded-full -mt-1 -mr-1"></div>
              )}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Alert Levels</span>
                <p className="text-2.5xl font-extrabold text-navy-deep font-sans">{lowStockProducts.length} Understocked</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  lowStockProducts.length > 0 ? "bg-red-50 text-[#ba1a1a]" : "bg-green-50 text-green-700"
                }`}>
                  {lowStockProducts.length > 0 ? "Needs Restocking" : "Stock is Balanced"}
                </span>
              </div>
              <div className="w-12 h-12 bg-red-50 text-[#ba1a1a] rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">B2B Event Inquiries</span>
                <p className="text-2.5xl font-extrabold text-navy-deep font-sans">{inquiries.length} Active</p>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                  {activeInquiries.length} Pending Replies
                </span>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

          </section>

          {/* Understock Alert Dashboard warnings */}
          {lowStockProducts.length > 0 && (
            <div id="understock-alert-ticker" className="bg-[#fff4eb] border border-orange-200 rounded-2xl p-5 flex items-start gap-4 text-orange-950 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 text-orange-700 animate-pulse mt-0.5" />
              <div className="space-y-1.5 flex-grow">
                <p className="font-extrabold text-navy-deep">Action Requested: Low Catalog Stock alert!</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {lowStockProducts.map((p) => (
                    <span key={p.id} className="inline-block px-3 py-1 bg-white text-navy-deep border border-orange-200 rounded-lg text-xs font-bold">
                      {p.name}: <strong className="text-hot-pink">{p.stock} units</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SPLIT SCREEN: Recent active transactions on LHS & pending user comments on RHS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Orders LHS panel (2-cols) */}
            <div className="lg:col-span-2 bg-white rounded-[24px] border border-outline-variant/20 p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-[#994700] text-lg">Logged Store Orders</h4>
                  <p className="text-[11px] text-on-surface-variant">Active deliveries initialized by consumer cart requests</p>
                </div>
                <button title="Sync order data" className="p-2.5 rounded-xl border border-outline-variant/30 hover:bg-surface-mist font-bold text-navy-deep">
                  <RefreshCw className="w-4 h-4 text-outline-variant" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-on-surface-variant border-collapse min-w-[400px]">
                  <thead>
                    <tr className="border-b border-outline-variant/20 text-[10px] text-navy-deep uppercase tracking-wider font-extrabold">
                      <th className="py-3 px-1">Order #</th>
                      <th className="py-3 px-1">Customer</th>
                      <th className="py-3 px-1">Timeline Date</th>
                      <th className="py-3 px-1">Status</th>
                      <th className="py-3 px-1 text-right">Sum Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ORDERS.map((ord) => (
                      <tr key={ord.id} className="border-b border-outline-variant/10 hover:bg-surface-mist/30">
                        <td className="py-4 px-1 font-bold text-navy-deep font-sans">{ord.id}</td>
                        <td className="py-4 px-1 font-semibold">{ord.customer}</td>
                        <td className="py-4 px-1">{ord.date}</td>
                        <td className="py-4 px-1">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-extrabold ${
                            ord.status === "Delivered" ? "bg-green-15 text-green-800" :
                            ord.status === "Shipped" ? "bg-blue-15 text-blue-800" :
                            "bg-yellow-15 text-yellow-800"
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-4 px-1 text-right font-bold text-zenky-orange">₹{ord.total.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* General Companion Chat Mascot sandbox in HQ (RHS 1-col) */}
            <div className="bg-[#fff5ee] rounded-[24px] border border-orange-200/50 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <img 
                    alt="Zenky assistant icon" 
                    className="w-8 h-8 rounded-full border border-zenky-orange" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkSgDalaBLJHIrOcEQF8FsgXFPDbJmOqEyEEZxkeDR488rGf1qSUJENmPA96_EJIzcO8HuQsC1YRH0_kvm_f4hiIa5yL6KhcvGBz2AP4NZz1DNeBBYHu36HxUpsxEpL0PUeQtZYdmx5uvELt4EPFrxKxGfQr2FWPFUg2YeoLV_wXtVYANu_PoKVuneYTGg6czfNFeO8lhYdQ2BmcYl666N2AfxKZtHnakDPLq_bYr01s0-ktc4RzsZMciTzVJcy0y1xU44MWPdeWrE" 
                  />
                  <div>
                    <h4 className="font-extrabold text-xs text-navy-deep uppercase tracking-widest">Zenky's Sandbox</h4>
                    <p className="text-[10px] text-on-surface-variant font-medium">Chat companion helper fox</p>
                  </div>
                </div>
                <div className="bg-white/80 p-3 rounded-lg border border-orange-100 text-[11px] leading-relaxed text-navy-deep font-body">
                  "Hi Partner! Need smart ideas? I can explain catalog structures, quote formulas, and custom boxes in second! Just ask!"
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-orange-200/50">
                <p className="text-[9px] font-bold text-orange-900 uppercase">Interactive Quick-Tips</p>
                <div className="text-[10px] space-y-1 text-on-surface-variant">
                  <p>✔ Submit quotation entries via <strong>Bulk</strong> screen to see them appear on dashboard.</p>
                  <p>✔ Toggle product activation settings synchronously.</p>
                  <p>✔ Add custom contents via form generator.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Product Catalog segment */}
      {activeTab === "Products" && (
        <div id="merchant-products-segment" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            
            {/* Products Category Select Filters */}
            <div className="flex gap-2 bg-surface-container border border-outline-variant/30 rounded-xl p-1 font-sans text-navy-deep">
              {["All", "Kids", "Corporate", "Birthday"].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setProductFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    productFilter === cat ? "bg-white text-navy-deep shadow-sm" : "text-on-surface-variant hover:text-navy-deep"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-zenky-orange text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-opacity-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create New Magic Box
            </button>
          </div>

          {/* Grid display products */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-navy-deep">
            {filteredProducts.map((p) => (
              <div 
                key={p.id} 
                className="bg-white rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-surface-mist">
                  <img className="w-full h-full object-cover" src={p.image} alt={p.name} />
                  
                  {/* Understock Alarm Overlay */}
                  {p.stock < 15 && (
                    <span className="absolute top-3 left-3 bg-[#ba1a1a]/85 backdrop-blur shadow text-white text-[9px] font-sans font-extrabold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Low Stock: {p.stock} units
                    </span>
                  )}

                  {/* Active/Draft Pill Badge */}
                  <span className={`absolute top-3 right-3 text-[9px] font-extrabold px-2 py-0.5 rounded ${
                    p.status === "Active" ? "bg-green-15 text-green-800" : "bg-neutral-15 text-neutral-800"
                  }`}>
                    {p.status}
                  </span>
                </div>

                {/* Info and items inside list */}
                <div className="p-5 flex-grow space-y-4 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-base text-navy-deep leading-tight">{p.name}</h4>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-extrabold">{p.category}</p>
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>

                  {/* Inside the Box aggregates list elements */}
                  <div className="bg-surface-mist/50 p-3 rounded-xl border border-outline-variant/10">
                    <p className="text-[9px] font-extrabold text-navy-deep uppercase tracking-wider mb-2">Inside the Box</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.itemsInside.map((inner, index) => (
                        <span key={index} className="px-2 py-0.5 bg-white border border-outline-variant/10 text-[9px] font-sans font-medium text-on-surface-variant rounded">
                          {inner}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider font-bold text-on-surface-variant">Base Catalog Rate</p>
                      <strong className="text-lg text-zenky-orange">₹{p.price.toLocaleString("en-IN")}</strong>
                    </div>

                    <div className="flex items-center gap-3">
                      
                      {/* Active Toggle slide selector switch button */}
                      <button 
                        onClick={() => onUpdateProductStatus(p.id, p.status === "Active" ? "Draft" : "Active")}
                        title={`Status: ${p.status}. Click to changes.`}
                        className="p-1 px-2 border border-outline-variant/30 rounded-lg text-[10px] font-bold text-navy-deep flex items-center gap-1 hover:bg-neutral-50"
                      >
                        {p.status === "Active" ? "Deactivate" : "Publish"}
                      </button>

                      {/* Deletion protection state locker */}
                      {confirmDeleteId === p.id ? (
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => {
                              onDeleteProduct(p.id);
                              setConfirmDeleteId(null);
                            }}
                            className="bg-[#ba1a1a] text-white p-1.5 px-2.5 rounded-lg text-[10px] font-bold hover:bg-opacity-95"
                          >
                            Confirm Delete
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(null)}
                            className="bg-neutral-200 text-navy-deep p-1.5 rounded-lg text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setConfirmDeleteId(p.id)}
                          className="p-2 border border-outline-variant/30 rounded-lg text-red-700 hover:bg-red-50"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Corporate Inquiries segment */}
      {activeTab === "Inquiries" && (
        <div id="merchant-inquiries-segment" className="bg-white rounded-[24px] border border-outline-variant/20 p-6 md:p-8 space-y-6 text-navy-deep">
          <div>
            <h4 className="font-extrabold text-navy-deep text-xl">Incoming Event Inquiries</h4>
            <p className="text-xs text-on-surface-variant">Live ballpark quotes triggered by client requests in Bulk Gifting</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-on-surface-variant border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-outline-variant/20 text-[10px] text-navy-deep font-sans font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-2">Sender Profile</th>
                  <th className="py-3 px-2">Category Group</th>
                  <th className="py-3 px-2">Timeline Targets</th>
                  <th className="py-3 px-2">Special Notes</th>
                  <th className="py-3 px-2">Status Code</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-on-surface-variant font-medium">
                      No live incoming tickets recorded yet. Go to the <strong>Bulk Gifting</strong> workspace to trigger a custom client request!
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr key={inq.id} className="border-b border-outline-variant/10 hover:bg-slate-50/50">
                      
                      <td className="py-4 px-2">
                        <div className="font-extrabold text-navy-deep text-sm">{inq.fullName}</div>
                        <div className="text-[10px] text-on-surface-variant">{inq.companyName}</div>
                      </td>

                      <td className="py-4 px-2">
                        <span className="font-sans font-bold bg-[#cae6ff] text-[#006492] px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                          {inq.eventType}
                        </span>
                        <div className="text-[10px] text-on-surface-variant mt-1">{inq.quantity} Boxes</div>
                      </td>

                      <td className="py-4 px-2 font-medium">
                        <div>Delivery: {inq.deliveryDate}</div>
                        <div className="text-[10px] text-on-surface-variant font-mono">Created: {inq.createdAt}</div>
                      </td>

                      <td className="py-4 px-2 max-w-xs truncate" title={inq.requirements}>
                        <span className="text-navy-deep font-body italic text-xs">"{inq.requirements}"</span>
                      </td>

                      <td className="py-4 px-2">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-extrabold uppercase ${
                          inq.status === "New" ? "bg-red-50 text-red-800" :
                          inq.status === "Replied" ? "bg-amber-50 text-amber-800" :
                          "bg-green-50 text-green-800"
                        }`}>
                          {inq.status}
                        </span>
                      </td>

                      <td className="py-4 px-2 text-right">
                        {inq.status === "New" ? (
                          <button 
                            onClick={() => onUpdateInquiryStatus(inq.id, "Replied")}
                            className="bg-royal-purple text-white text-[10px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                          >
                            Mark Replied
                          </button>
                        ) : inq.status === "Replied" ? (
                          <button 
                            onClick={() => onUpdateInquiryStatus(inq.id, "Completed")}
                            className="bg-green-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                          >
                            Mark Done
                          </button>
                        ) : (
                          <span className="text-green-700 text-[10px] font-bold flex items-center gap-1 justify-end">
                            <Check className="w-3.5 h-3.5" /> Ticket Resolved
                          </span>
                        )}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal / Dialog Drawer to Create New Magic Box */}
      {showAddModal && (
        <div id="create-modal-drawer" className="fixed inset-0 bg-navy-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-lg overflow-hidden border border-outline-variant/30 shadow-2xl animate-[slideUp_0.3s_ease]">
            
            <div className="p-6 bg-navy-deep text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-zenky-orange" />
                <h3 className="font-extrabold text-lg">Assemble New Magic Box</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white hover:opacity-80 rounded-full hover:bg-white/10 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-navy-deep">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant">Box / Product Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Zen Morning Ritual, Radiant spa" 
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full p-2.5 bg-surface-mist font-sans text-sm rounded-lg border border-outline-variant/30 text-navy-deep focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant">Catalog Target Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 4500" 
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 bg-surface-mist font-sans text-sm rounded-lg border border-outline-variant/30 text-navy-deep"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant">Warehouse Stock Units</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 50" 
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 bg-surface-mist font-sans text-sm rounded-lg border border-outline-variant/30 text-navy-deep"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant">Category Segment</label>
                  <select 
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as Product["category"])}
                    className="w-full p-2.5 bg-surface-mist text-xs rounded-lg border border-outline-variant/30"
                  >
                    <option value="Birthday">Birthday</option>
                    <option value="Kids">Kids</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Personalized">Personalized</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant">Stock Status</label>
                  <span className="block text-xs font-bold text-[#994700] pt-2">Publish Instantly</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant">Box Showcase Photo URL</label>
                <input 
                  type="text" 
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full p-2.5 bg-surface-mist font-sans text-sm rounded-lg border border-outline-variant/30 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant">Crate Description</label>
                <textarea 
                  required
                  placeholder="e.g. A gorgeous luxury kit designed with natural wood finishes..." 
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full h-15 p-2.5 bg-surface-mist font-sans text-sm rounded-lg border border-outline-variant/30"
                ></textarea>
              </div>

              {/* DYNAMIC form aggregation component to add line items "Inside the Box" */}
              <div className="p-3 bg-surface-mist rounded-xl border border-outline-variant/20 space-y-3">
                <label className="text-[10px] uppercase font-bold text-navy-deep block">Inside the Gift Box Crate Items ({innerItemsList.length})</label>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. Lavender Sleep Mist, Dark Mocha Bar" 
                    value={innerItemDraft}
                    onChange={(e) => setInnerItemDraft(e.target.value)}
                    className="flex-grow p-2.5 bg-white text-xs rounded-lg border border-outline-variant/30 text-navy-deep"
                  />
                  <button 
                    type="button"
                    onClick={handleAddInnerLineItem}
                    className="px-4 py-2 bg-royal-purple text-white text-xs font-bold rounded-lg hover:bg-opacity-95 shrink-0"
                  >
                    Add +
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 max-h-[100px] overflow-y-auto custom-scrollbar">
                  {innerItemsList.map((inner, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-outline-variant/20 rounded text-[10px] font-sans text-navy-deep">
                      {inner}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveInnerLineItem(idx)}
                        className="text-red-700 font-bold hover:scale-110"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-outline-variant/10">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant/40 text-navy-deep font-sans text-xs font-bold hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-zenky-orange text-white font-sans text-xs font-bold rounded-xl hover:bg-opacity-95"
                >
                  Add To Catalog Crate
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
