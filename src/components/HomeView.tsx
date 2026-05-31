import React, { useState } from "react";
import { Sparkles, Gift, Heart, ArrowRight, Star, ShoppingBag, Mail, CheckCircle2 } from "lucide-react";
import { Product } from "../types";

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function HomeView({ onNavigate, products, onAddToCart }: HomeViewProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const bestSellers = products.slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 6000);
      setNewsletterEmail("");
    }
  };

  return (
    <div id="home-view-container" className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section id="hero-banner-section" className="px-1">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#efdbff] via-[#ffdbc8] to-[#ffeadf] shadow-xl p-8 md:p-16">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #F47B20 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex-1 text-center md:text-left space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-hot-pink text-white text-xs font-bold tracking-wider uppercase">
                New Collection
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-navy-deep leading-tight">
                Surprise <span className="text-zenky-orange">Fun Box!</span>
              </h2>
              <p className="text-lg text-navy-deep/80 max-w-md">
                Thoughtful Gifts. Joyful Moments. We curate the magic so you can celebrate connection in the most beautiful way.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                <button 
                  onClick={() => onNavigate("lab")}
                  id="unbox-fun-btn"
                  className="px-8 py-4 bg-zenky-orange hover:bg-opacity-95 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Unbox The Fun
                </button>
                <button 
                  onClick={() => onNavigate("bulk")}
                  id="how-it-works-btn"
                  className="px-8 py-4 border-2 border-royal-purple text-royal-purple hover:bg-royal-purple/5 font-bold rounded-xl active:scale-95 transition-all"
                >
                  How it Works / Bulk
                </button>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center items-center">
              <div className="relative w-full max-w-sm">
                <img 
                  alt="Surprise Fun Box Showcase" 
                  className="w-full h-auto drop-shadow-2xl animate-[pulse_6s_infinite]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEHbILYFWyzCvR_wdBqviPzZpneHpitgnWBxgXsJY0AmIoIl3ejHDzuNsSLUwo01FCoHDlH-8nGzVT9wu8K39HqLw27hNKlNz4MzPMh1cZPLsnmlxWbdFnDvsqKX7_WPuEiuBi0dq2wlpZq5C_NX6sNPo268pnCR2010yV9EAXx17BFAOJUl_88rOOQsTV9vMZEaRhT0eoOmV9EMCy9Mvt--1VPErJX4CMwRtf9MQlrXXSO1OT7IoIglQMm-RkGPauwkY16Kh-vwzh" 
                />
                <div className="absolute -top-4 -right-4 bg-joy-yellow p-3 rounded-full shadow-lg rotate-12">
                  <Sparkles className="w-6 h-6 text-navy-deep" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main categories intro badges */}
      <section id="features-highlights" className="grid grid-cols-2 md:grid-cols-4 gap-4 px-1 text-center">
        {[
          { icon: Gift, label: "Curated Gift Boxes", desc: "Expertly matched aesthetics" },
          { icon: Sparkles, label: "Personalized Hampers", desc: "Tailored names & messages" },
          { icon: Heart, label: "For Every Occasion", desc: "Milestones & just because" },
          { icon: ShoppingBag, label: "Bulk corporate", desc: "For teams & custom events" }
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-primary-fixed text-[#994700] rounded-xl flex items-center justify-center mx-auto mb-3">
              <f.icon className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-navy-deep mb-1">{f.label}</p>
            <p className="text-xs text-on-surface-variant">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Horizontal horizontal carousel curated cards */}
      <section id="curated-hampers-carousel" className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-navy-deep">Curated Gift Boxes</h3>
            <p className="text-sm text-on-surface-variant">Top designer sets crafted for beautiful reveals</p>
          </div>
          <button 
            onClick={() => onNavigate("lab")}
            className="text-royal-purple hover:text-opacity-80 font-bold text-sm flex items-center gap-1 active:translate-x-1 transition-transform"
          >
            Custom Lab <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-4 pt-1 px-1 custom-scrollbar snap-x overflow-y-hidden">
          {bestSellers.map((prod) => (
            <div 
              key={prod.id} 
              className="snap-start flex-shrink-0 w-[290px] md:w-[325px] bg-white rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-[210px] overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  alt={prod.name}
                  src={prod.image}
                />
                <span className="absolute top-4 left-4 bg-navy-deep/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {prod.category}
                </span>
                <button 
                  onClick={() => onAddToCart(prod)}
                  title="Add box to basket"
                  className="absolute bottom-4 right-4 bg-zenky-orange text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <Gift className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-lg text-navy-deep">{prod.name}</h4>
                  <p className="text-on-surface-variant text-xs line-clamp-2 mt-1">{prod.description}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-outline-variant/10">
                  <span className="font-bold text-lg text-zenky-orange">₹{prod.price.toLocaleString("en-IN")}</span>
                  <div className="flex text-joy-yellow">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid: Explore the Magic */}
      <section id="explore-magic-bento" className="space-y-6">
        <h3 className="text-2xl md:text-3xl font-extrabold text-navy-deep">Explore Gifting Pathways</h3>
        <div id="bento-grid-nav" className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Personalized Hampers Box (7-cols) */}
          <div className="md:col-span-7 bg-royal-purple rounded-[32px] p-8 text-white relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-105 transition-transform duration-500"></div>
            
            <div className="relative z-10 space-y-4">
              <span className="px-3 py-1 bg-white/20 text-[#cae6ff] text-xs font-bold rounded-full tracking-wide">
                FULLY CONFIGURABLE
              </span>
              <h4 className="text-3xl font-extrabold leading-tight">Personalization Labs</h4>
              <p className="text-white/80 max-w-sm text-sm">
                Unleash the ultimate gesture. Pick a themed outer pattern, write letters optimized by AI, & drop custom photos to render beautifully inside the lid.
              </p>
            </div>
            
            <div className="relative z-10 pt-6">
              <button 
                onClick={() => onNavigate("lab")}
                className="px-6 py-3 bg-white text-royal-purple font-bold rounded-xl hover:bg-neutral-100 transition-colors flex items-center gap-2"
              >
                Launch Builder <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* For Every Occasion (5-cols) */}
          <div className="md:col-span-5 bg-[#FFD700] rounded-[32px] p-8 text-navy-deep relative overflow-hidden min-h-[350px] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-navy-deep/10 text-navy-deep text-xs font-bold rounded-full">
                THEMED ARCHIVES
              </span>
              <h4 className="text-2xl font-extrabold">For Every Milestone</h4>
              <p className="text-navy-deep/80 text-sm">
                Birthdays, team welcomes, anniversaries, graduations, or just-because treats. Find perfect matching sets.
              </p>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => onNavigate("lab")}
                className="font-bold text-navy-deep border-b-2 border-navy-deep pb-0.5 inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                Browse Occasions <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Corporate Gifting (5-cols) */}
          <div className="md:col-span-5 bg-white rounded-[32px] p-8 border-2 border-outline-variant/30 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-primary-fixed text-[#994700] text-xs font-bold rounded-full uppercase tracking-wider">
                Scalable
              </span>
              <h4 className="text-2.5xl font-extrabold text-[#994700]">Corporate Solutions</h4>
              <p className="text-on-surface-variant text-sm">
                Laser engraved wood, branded silk loops, and dedicated account support starting at just 20 units.
              </p>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => onNavigate("bulk")}
                className="font-bold text-[#F47B20] inline-flex items-center gap-2 hover:opacity-80"
              >
                Send Bulk Inquiry <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Magical Return Gifts (7-cols) */}
          <div className="md:col-span-7 bg-[#cae6ff] rounded-[32px] p-8 text-[#006492] relative overflow-hidden min-h-[300px] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-[#006492]/10 text-[#006492] text-xs font-bold rounded-full">
                KIDS & SCHOOLS
              </span>
              <h4 className="text-3xl font-extrabold text-[#003854]">Sparkling Return Gifts</h4>
              <p className="text-[#001e2f]/80 text-sm max-w-sm">
                Whimsical customized packages that make graduation, birthday crowds, and children's award ceremonies memorable. High quality, non-toxic, and joyful.
              </p>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => onNavigate("bulk")}
                className="px-6 py-3 bg-[#006492] text-white font-bold rounded-xl hover:bg-[#003854] transition-colors"
              >
                Plan School Event
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Newsletter Signup with mascot guide */}
      <section id="mascot-newsletter-banner">
        <div className="bg-surface-container rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-outline-variant/30">
          <div className="w-32 md:w-44 shrink-0 flex justify-center">
            <img 
              alt="Zenky Mascot Smiling" 
              className="w-full h-auto max-h-[160px] object-contain animate-[bounce_5s_infinite]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4smdowieNxr8ubQUG4s4Nzfay7_f-QNo6GdEJ7tRSWgSZrCUmsnEpJlR2boB499-pJgH1jHo1Yv1J9eMwiG5mIgC28A5dGvH79ADcdAFwcElZuPRhOMwkb20InbG9kZRUoKDunC4auRbH37Evp0pZfxnxZTR7PBh7q7Y0ssiKSnzHjj3XLAGIJjLx8Pjacq9s-f9Op_bNd5VWt1bdlCVXmqQppiTV9qu6RjF_wy4KLT9TuhRkOQ9cT1bdXasUngMShjJLk9jA3Y9E" 
            />
          </div>

          <div className="flex-1 space-y-4">
            <h3 className="text-2xl md:text-3xl font-extrabold text-navy-deep">Don't miss the next reveal!</h3>
            <p className="text-on-surface-variant text-sm md:text-base">
              Join Zenky’s Happy Club to get custom catalog launches, early discount secrets, and special "Zenky-only" custom stickers!
            </p>

            {newsletterSubscribed ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 px-5 py-3 rounded-xl font-bold text-sm w-fit border border-green-200">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Barks of excitement! You are subscribed to the Joy Club! 🦊🎁</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  required
                  placeholder="Your favorite email here..." 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-grow px-6 py-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-royal-purple bg-white text-navy-deep text-sm"
                />
                <button 
                  type="submit"
                  className="px-8 py-4 bg-navy-deep hover:bg-opacity-95 text-white font-bold rounded-xl active:scale-95 transition-all text-sm shrink-0"
                >
                  Join Club
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
