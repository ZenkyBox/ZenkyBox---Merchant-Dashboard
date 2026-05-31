import React, { useState } from "react";
import { Send, CheckCircle, Info, Calendar, Users, FileSignature, Sparkles, Building2 } from "lucide-react";
import { Inquiry } from "../types";

const CORPORATE_GALLERY_IMAGES = [
  {
    title: "School Return Gifts",
    desc: "Whimsical themed gift kits for academic rewards, birthday returns, & graduation moments.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZNhRtZcMdXOQzh2hJ3fRK2rCp49uVuGrOz3M6SXbSuEPAV25iODjkEnplAlwQkBIuobQh8S4IzYEN2HTmdzKjgeRU1QyTxzUIfZAHA_ZHLJaF4RGcobFvw8GXhbXr-HQAMwL4wgqe9kCbYuwu1p485LMBaIZj4LEzyGFwEDsSGSn4fY36ClFC-0nI1sDLp2w1c4gLfn7-3s5rdCToFTLgZyKPKkof8DnL1M6EpEQxWwZGgz3hp3kA8tFElXekoT6ZOWiCHTKJy40A"
  },
  {
    title: "Custom Branding & Packaging",
    desc: "Incorporate corporate logotypes, bespoke luxury sleeves, and matching velvet ribbons.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgczwnCISqxmfuwGbF05K8jBiK_c2Xubn4_Ulv9TS2u1O49pvnwfdP3tclGMjxFButsKH0XxlktYbJS9QQ7wc4oNiAHMe_Kwh9kQevDRJxb9eIDChGe1eQrir9Fk2WUgbD1IXDT1VQGMX0X1UmJpEXKbhL3fPf322_O-NE0TsMySQjhoMlN95mJSJDtZ15GPEwNl_EJyd6v4Ivq-PBDKWxQTY1KhVTdhS8lWf6ayVreUHuHPIaMnwGwSs6au5Mv_86G7yf584BhC5c"
  },
  {
    title: "Premium Keepsakes",
    desc: "Laser-engraved bamboo panels, curated natural soy soy spa components, and sweet truffle hampers.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOuL5Ufz5zHJvtFO3EWkNiFaXdgcBJJsT4g0in9lxzlr5yaU-4vTjXAZIsRNQKf5RT8our_xsdIipGCtsziW8wuGAk-lu7wLZnRaACKjYtNGBMTL3JZwSnSwJEAsqQos6f1LlsYX2VWO5he8H9C-wcPSDbvSdqC32BCo_Sjjc9th9uPAgnYLhYnm_RoT4-cSwUybSMvtGzdWDTkQt3tDqJK9JD8JruUBdd7ofbwYzCqp_QRFjKVxdDdZNTvfdHGwmKZfp0hz1rOFvB"
  }
];

interface BulkViewProps {
  onAddInquiry: (inquiry: Omit<Inquiry, "id" | "status" | "createdAt">) => void;
}

export default function BulkView({ onAddInquiry }: BulkViewProps) {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [eventType, setEventType] = useState("Corporate Event");
  const [quantity, setQuantity] = useState<number>(50);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [requirements, setRequirements] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Dynamic Quote Calculator math
  const getPricingMath = () => {
    let basePricePerBox = 1650; // Base premium corporate crate
    if (eventType === "Wedding favor") basePricePerBox = 2100;
    if (eventType === "School Rewards") basePricePerBox = 850;

    // Bulk discount steps
    let discountPercent = 0;
    if (quantity >= 50 && quantity < 100) discountPercent = 10;
    else if (quantity >= 100 && quantity < 500) discountPercent = 15;
    else if (quantity >= 500) discountPercent = 25;

    const discountAmount = (basePricePerBox * discountPercent) / 100;
    const finalPricePerBox = basePricePerBox - discountAmount;
    const totalEstimate = finalPricePerBox * quantity;

    return {
      basePricePerBox,
      discountPercent,
      finalPricePerBox,
      totalEstimate,
    };
  };

  const math = getPricingMath();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !deliveryDate) return;

    onAddInquiry({
      fullName,
      companyName: companyName || "N/A",
      eventType,
      quantity,
      deliveryDate,
      requirements: requirements || "Custom unboxing tags",
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFullName("");
      setCompanyName("");
      setRequirements("");
      setDeliveryDate("");
    }, 4500);
  };

  return (
    <div id="bulk-gifting-workspace" className="space-y-16 pb-16">
      
      {/* Editorial Headline & Showcase banner */}
      <section id="bulk-hero-intro" className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-4 py-1.5 rounded-full bg-royal-purple text-white text-xs font-bold uppercase tracking-widest">
          Premium Logistics & Design
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-navy-deep leading-tight">
          Bulk & Corporate <br />
          <span className="text-zenky-orange">Customized Hampers</span>
        </h2>
        <p className="text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Delivering customized bulk luxury orders for high-profile weddings, graduation ceremonies, schools, and leading corporate events. We coordinate laser engraving, branded ribbons, and white-glove hand delivery nationwide.
        </p>
      </section>

      {/* Grid of gallery assets */}
      <section id="solutions-gallery-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CORPORATE_GALLERY_IMAGES.map((card, idx) => (
          <div key={idx} className="bg-white rounded-[24px] overflow-hidden border border-outline-variant/20 shadow-sm flex flex-col justify-between">
            <div className="h-56 overflow-hidden">
              <img className="w-full h-full object-cover" src={card.img} alt={card.title} />
            </div>
            <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-lg text-navy-deep">{card.title}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{card.desc}</p>
              </div>
              
              <div className="pt-2 border-t border-outline-variant/10 text-xs font-bold text-royal-purple">
                Starts at 20 units • Bulk discounts apply
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Quote calculator panel split layout */}
      <section id="interactive-quote-builder" className="bg-white p-6 md:p-10 rounded-[32px] border border-outline-variant/20 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Form left inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-navy-deep flex items-center gap-2">
                <Building2 className="w-6 h-6 text-zenky-orange" />
                Inquiry & Estimate Request
              </h3>
              <p className="text-xs text-on-surface-variant">
                Fill details below to get a live ballpark pricing model based on event categories and volume.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 font-bold">
                <CheckCircle className="w-12 h-12 text-green-600 animate-[bounce_2s_infinite]" />
                <div>
                  <h4 className="text-lg font-extrabold text-green-950">Inquiry Received!</h4>
                  <p className="text-xs font-light mt-1">
                    Your request was recorded. Switch to the <strong>Merchant Dashboard</strong> at the top of the menu to review the ticket live!
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold text-navy-deep uppercase block">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Your Name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-surface-mist text-sm border border-outline-variant/30 text-navy-deep focus:outline-none focus:ring-2 focus:ring-zenky-orange"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold text-navy-deep uppercase block">Company / School / Event Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Google India, Carmel Convent" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-surface-mist text-sm border border-outline-variant/30 text-navy-deep focus:outline-none focus:ring-2 focus:ring-zenky-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy-deep uppercase block">Event Type Category</label>
                  <select 
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-surface-mist text-sm border border-outline-variant/30 text-navy-deep focus:outline-none"
                  >
                    <option>Corporate Gift</option>
                    <option>Wedding favor</option>
                    <option>School Rewards</option>
                    <option>Holiday Party</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy-deep uppercase block flex justify-between">
                    <span>Target Quantity</span>
                    <span className="text-zenky-orange font-extrabold">{quantity} Boxes</span>
                  </label>
                  <input 
                    type="range" 
                    min="20" 
                    max="1000" 
                    step="5"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full accent-zenky-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy-deep uppercase block">Delivery Target Date</label>
                  <input 
                    type="date" 
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-surface-mist text-sm border border-outline-variant/30 text-navy-deep focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold text-navy-deep uppercase block">Special Requirements or Custom Add-ons</label>
                  <textarea 
                    placeholder="Describe custom card options, wooden crates, specific chocolates or item colors..." 
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full h-18 p-3.5 rounded-xl bg-surface-mist text-sm border border-outline-variant/30 text-navy-deep focus:outline-none focus:ring-2 focus:ring-royal-purple"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full col-span-2 py-4 bg-zenky-orange/8 w-full hover:bg-zenky-orange hover:text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-zenky-orange/20 text-zenky-orange text-sm shrink-0"
                >
                  <Send className="w-4 h-4" /> Send Quotation Request
                </button>
              </form>
            )}
          </div>

          {/* Pricing Math calculations dynamic sidebar (Right) */}
          <div className="lg:col-span-5 bg-navy-deep text-white rounded-[24px] p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <span className="text-[9px] uppercase tracking-widest font-extrabold bg-white/10 px-3 py-1 rounded-full text-white inline-block">
                Ballpark Estimate Breakdown
              </span>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-white/70">
                  <span>Standard Box Catalog Rate:</span>
                  <span className="font-bold text-white uppercase">₹{math.basePricePerBox.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-xs text-green-400">
                  <span>Bulk Discount Volume ({quantity} boxes):</span>
                  <span className="font-extrabold font-sans">-{math.discountPercent}%</span>
                </div>

                <div className="flex justify-between items-center text-xs text-white/70">
                  <span>Custom Laser Stamp & Packaging:</span>
                  <span className="font-bold text-green-300">FREE INCLUDED</span>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <h5 className="text-[10px] text-white/60 uppercase font-sans">Price Per Crate</h5>
                    <p className="text-2xl font-extrabold font-sans text-zenky-orange">₹{math.finalPricePerBox.toLocaleString()}</p>
                  </div>

                  <div className="text-right">
                    <h5 className="text-[10px] text-white/60 uppercase font-sans">Estimated Total Setup</h5>
                    <p className="text-3xl font-extrabold font-sans text-joy-yellow">₹{math.totalEstimate.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white/5 border border-white/10 p-4 rounded-xl text-[11px] text-white/80 space-y-2 leading-relaxed">
              <div className="flex gap-2 items-start text-joy-yellow font-bold text-[12px]">
                <Sparkles className="w-4 h-4 shrink-0 text-joy-yellow" />
                <span>Bulk VIP Guarantee</span>
              </div>
              <p>
                An account designer will review your customized requests and follow up within 3 business hours. Customized mockup renders are sent prior to production.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
