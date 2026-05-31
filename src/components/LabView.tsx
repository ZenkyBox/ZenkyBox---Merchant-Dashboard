import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Upload, Heart, RefreshCw, Star, CheckCircle, Info, HelpCircle } from "lucide-react";
import { BoxDesign } from "../types";

const BOX_DESIGNS: BoxDesign[] = [
  {
    id: "classic-zenky",
    name: "Classic Zenky",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-33eZGEgDjOLf_EajbmXIS8MHdyrvU1efJFVHdyWfsk1PBVBK58TceIXt8vDKE9L01AEIus6fOyXExPotmFcNmq3dSzmJ72z9AcG80aw6azmyNSLMj2IQ54cE-BPwzavrxV_ze_6gUf73tdOr9uf8UwYN-zpDmqtDakdp61x-w_6W5vUR7U413S3YdpV9XRTeRSh1tsRMj3hkEio4_qb9WSM9TucXcRyOvRyeCw0BeLzkDLofaD5SKY7sGfYijiKZZ4sRbmCq9CbJ",
    description: "Multi-textured cream finish with a premium orange ribbon structure."
  },
  {
    id: "party-theme",
    name: "Party Theme",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5l7jR9JL2LQZtzB36uAlZfUmUCaxStez2D7du_vkIBfVaq8-Aq8NKhLQjSi-3FGMYAA2d0DNLkJhE2ULHppJ8Dc_JxNp50Es6lD20FqJULGE2AgjNv6Y0B7mxJ7hQVb2DN95adDH6u4kJ558AOzQ8_4S1lS6MTDv0Hk53HfBScRbh5SzqO7nXRPMkp4xxHJvQ7No3L0d3ODgVWlbslmMOmCm2mW2gYoJH5bbjhGT9z5RO_56oWsk0BZ3wx1pDKTicah5X8ZsBUiyb",
    description: "Celebratory layout covered in rainbow confetti stars and bursts."
  },
  {
    id: "the-envelope",
    name: "The Envelope",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBv8CVAXKpSxORZ__hbdUN1vty6aKpEdADvdF2_kNFEJ3VsjqGXfkHkGBljtXnZk7j2Fu2MGrsuZtnJYXLSdNKtfl1FuQZD5ITnXd7g6cc04lZ0jkyIIg8TuXBGPgUs_pHft5FEBazc4lM6Xu6UfkcZ6wWDhlq6w_LUrz9D3n9b5mjQVqSjLyHP3xYH8MP2_qWKiLCQPUyFRi0fKfCbeJr9UdJxjl85DK0PWKLDLce2LjgU9MkEJb5Tryy0JVe5LJ2DU9v6qNMfAflN",
    description: "Elegant large-format flap made of deep lavender pearlescent cardstock."
  }
];

// Pre-set gallery options for instant mock demonstration
const SAMPLE_MOCKED_IMAGE_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuD08N_skfXRAQapvBH3NtARX44ZAoS7m2vlEFHZMfcVq4qEuBX4DpSd3vrwZyDpILbVPgEgYNmHTRKP47aEp68SovFhusESm7kqWdrQwZa4gcpTrJTgmBt2-Uks2tE1SXJHBJmcuO02ibZRI4kwf3ZSJYDQCsFGvy5drDd4GoT08W1Dyb0Nw-Zau_wVXyzkd0hCEI7U454nOfTZWsBvaFC2b7t6jSTvLZ51zh1_M-yrfJuPDbvSyId8zYEYE83eJLOXq3CD3z28T99y";

interface LabViewProps {
  onAddCustomBoxToCart: (customItem: {
    title: string;
    design: string;
    message: string;
    recipientName: string;
    photos: string[];
    price: number;
  }) => void;
}

export default function LabView({ onAddCustomBoxToCart }: LabViewProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedDesign, setSelectedDesign] = useState<string>("classic-zenky");
  const [recipientName, setRecipientName] = useState<string>("");
  const [messageText, setMessageText] = useState<string>("");
  
  // Custom uploaded photos state
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([SAMPLE_MOCKED_IMAGE_URL]);
  const [activePreviewPhoto, setActivePreviewPhoto] = useState<string>(SAMPLE_MOCKED_IMAGE_URL);

  // Gemini generator controls
  const [aiOccasion, setAiOccasion] = useState<string>("Birthday");
  const [aiTone, setAiTone] = useState<string>("Heartfelt & Warm");
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [customVibePrompt, setCustomVibePrompt] = useState<string>("");

  const [finishedCustomItem, setFinishedCustomItem] = useState<boolean>(false);
  const [isPreviewCard3D, setIsPreviewCard3D] = useState<boolean>(false);

  // Handle local memory photo reading
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result && typeof reader.result === "string") {
            setUploadedPhotos((prev) => [...prev, reader.result as string]);
            setActivePreviewPhoto(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Trigger server-side Gemini suggestion
  const generateAiCardGreeting = async () => {
    setAiGenerating(true);
    try {
      const response = await fetch("/api/gemini/suggest-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: recipientName || "My Friend",
          occasion: aiOccasion,
          tone: aiTone,
          customVibe: customVibePrompt,
        }),
      });
      const data = await response.json();
      if (data.success && data.text) {
        setMessageText(data.text);
      }
    } catch (err) {
      console.error("AI composition error. Generating template.", err);
    } finally {
      setAiGenerating(false);
    }
  };

  const getActiveDesign = () => {
    return BOX_DESIGNS.find((it) => it.id === selectedDesign) || BOX_DESIGNS[0];
  };

  const handleFinishBox = () => {
    onAddCustomBoxToCart({
      title: `Custom ${getActiveDesign().name}`,
      design: selectedDesign,
      message: messageText || "Unbox the happiness",
      recipientName: recipientName || "Special Friend",
      photos: uploadedPhotos,
      price: 3800, // custom lab premium kit price
    });
    setFinishedCustomItem(true);
  };

  return (
    <div id="personalization-lab-workspace" className="space-y-10 pb-16">
      
      {/* Header and Smart Mascot helper */}
      <section id="lab-intro-panel" className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/20 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-fixed-dim/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
        
        <div className="max-w-2xl text-center md:text-left space-y-2">
          <h2 className="text-3xl font-extrabold text-navy-deep">Personalization Lab</h2>
          <p className="text-lg text-on-surface-variant italic">
            “Where every box tells a story. Craft yours with love!”
          </p>
        </div>

        {/* Floating live helper mascot badge */}
        <div className="flex items-center bg-royal-purple/5 border border-royal-purple/20 rounded-full px-6 py-3 shrink-0 animate-bounce">
          <img 
            alt="Zenky smiling vector" 
            className="w-10 h-10 object-contain mr-3" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfzFsW7gjLeDSdcZKtUOlbMeFBNLhRChZSrEr8rpORAuT4VUZteXXUWzruIKG7yA6VPB7qDr2V4mXltJzyHndUj-iv3_QLWViHvbc83untCslKpnBTpL8W870xDHznMmerNz0B3p-KlVWvVtadTNIXfPUye5SZE4ch9nSzmy5jJwVNJj2CDAN_OlZoZkVS5C-2A8sgmz9MdKXUTVB1GlbCPNNLP9QY5wYH4FWKpptrROmBcbNQLsOFMobcu4VOto3qGWvijiSbEI4-" 
          />
          <div>
            <p className="text-xs font-bold text-royal-purple uppercase tracking-widest">Guide Mode</p>
            <p className="text-sm font-bold text-navy-deep">Zenky is helping you!</p>
          </div>
        </div>
      </section>

      {/* Main stepper progress navigation bar */}
      <nav id="stepper-progress-nav" className="flex items-center justify-between max-w-2xl mx-auto px-4 relative">
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-outline-variant/30 -translate-y-1/2 -z-10 rounded-full"></div>
        <div className="absolute top-1/2 left-4 h-1 bg-zenky-orange -translate-y-1/2 -z-10 rounded-full" style={{ width: `${((activeStep - 1) / 3) * 100}%` }}></div>
        
        {[1, 2, 3, 4].map((step) => {
          const names = ["Box", "Message", "Photos", "Finish"];
          const isActive = step === activeStep;
          const isDone = step < activeStep;
          return (
            <button 
              key={step} 
              onClick={() => setActiveStep(step)}
              className="flex flex-col items-center gap-2 group focus:outline-none"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                isActive ? "bg-zenky-orange text-white border-zenky-orange scale-110 shadow-lg" : 
                isDone ? "bg-royal-purple text-white border-royal-purple" : 
                "bg-white text-on-surface-variant border-outline-variant"
              }`}>
                {step}
              </div>
              <span className={`text-xs font-bold ${isActive ? "text-zenky-orange" : isDone ? "text-royal-purple" : "text-on-surface-variant"}`}>
                {names[step-1]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Split layout workspace */}
      <div id="stepper-split-panels" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LHS Step-by-Step Customization Controls */}
        <div className="lg:col-span-7 space-y-8 bg-white p-6 md:p-8 rounded-[24px] border border-outline-variant/20 shadow-sm min-h-[500px] flex flex-col justify-between">
          <div className="space-y-8">
            
            {/* STEP 1: Box design builder selection */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-navy-deep flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zenky-orange"></span>
                    Choose Your Box Design
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Pick a premium tactile outer aesthetic. Our production handles the premium ribbon assemblies.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-navy-deep">
                  {BOX_DESIGNS.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setSelectedDesign(item.id)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 p-1.5 transition-all hover:scale-105 active:scale-95 text-left flex flex-col justify-between ${
                        selectedDesign === item.id ? "border-zenky-orange bg-orange-50/20" : "border-outline-variant/30 hover:border-royal-purple"
                      }`}
                    >
                      <img className="w-full h-2/3 object-cover rounded-xl" src={item.image} alt={item.name} />
                      <div className="px-1 py-1">
                        <span className="block font-bold text-xs">{item.name}</span>
                        <span className="block text-[9px] text-on-surface-variant line-clamp-1">{item.description}</span>
                      </div>
                      {selectedDesign === item.id && (
                        <div className="absolute top-3 right-3 bg-zenky-orange text-white rounded-full p-0.5 shadow-sm">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Recipient Input Name */}
                <div className="space-y-2 pt-4 border-t border-outline-variant/10">
                  <label className="text-xs font-bold text-navy-deep block uppercase">Recipient Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter recipient name (e.g. Grandma, Sarah)" 
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full p-4 rounded-xl border border-outline-variant/40 bg-surface-mist text-navy-deep font-sans text-sm focus:outline-none focus:ring-2 focus:ring-zenky-orange"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Custom greeting cards & Gemini AI assistant */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-navy-deep flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zenky-orange"></span>
                    Write Your Message
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Your message renders inside the box lid dynamically. Write your own, or utilize AI!
                  </p>
                </div>

                <div className="space-y-4">
                  <textarea 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your heartfelt note here, or prompt Zenky below to help generate one!"
                    className="w-full h-36 p-4 rounded-xl border border-outline-variant/40 bg-surface-mist font-body text-navy-deep text-sm focus:outline-none focus:ring-2 focus:ring-royal-purple focus:border-royal-purple custom-scrollbar"
                  ></textarea>

                  {/* Quick-suggestion click chips */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { l: "Birthday 🎂", v: `Dear ${recipientName || "Friend"}, wishing you the absolute happiest of birthdays! Celebrate every single unboxing moment in style. Love you!` },
                      { l: "Gratitude 🙏", v: `Dear ${recipientName || "Friend"}, words will never express how much your kindness has lifted me up. Sending you matching joy from this box!` },
                      { l: "New Chapter ✨", v: `Dear ${recipientName || "Champ"}, go forth with courage! Cheers to your shiny new chapter and exciting fresh adventures!` }
                    ].map((item, i) => (
                      <button 
                        key={i} 
                        onClick={() => setMessageText(item.v)}
                        className="px-3.5 py-1.5 rounded-full bg-royal-purple/5 text-royal-purple border border-royal-purple/10 text-xs font-bold hover:bg-royal-purple/10"
                      >
                        {item.l}
                      </button>
                    ))}
                  </div>

                  {/* Gemini Smart AI Prompt Builder */}
                  <div className="bg-primary-fixed-dim/20 rounded-2xl p-5 border border-zenky-orange/10 space-y-4">
                    <div className="flex items-center gap-2 text-navy-deep">
                      <Sparkles className="w-5 h-5 text-zenky-orange" />
                      <span className="font-extrabold text-sm">Ask Zenky Mascot (Gemini AI)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-on-surface-variant">Occasion</label>
                        <select 
                          value={aiOccasion} 
                          onChange={(e) => setAiOccasion(e.target.value)}
                          className="w-full p-2 bg-white text-navy-deep text-xs rounded-lg border border-outline-variant/30"
                        >
                          <option>Birthday</option>
                          <option>Gratitude</option>
                          <option>New Beginnings</option>
                          <option>Anniversary</option>
                          <option>Apology</option>
                          <option>Just Because</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-on-surface-variant">Tone Style</label>
                        <select 
                          value={aiTone} 
                          onChange={(e) => setAiTone(e.target.value)}
                          className="w-full p-2 bg-white text-navy-deep text-xs rounded-lg border border-outline-variant/30"
                        >
                          <option>Heartfelt & Warm</option>
                          <option>Playful & Wacky</option>
                          <option>Short Elegant Poem</option>
                          <option>Professional</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-on-surface-variant">Custom Key Prompts or Vibes (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Loves gardening, likes vintage mugs, funny coffee fan" 
                        value={customVibePrompt}
                        onChange={(e) => setCustomVibePrompt(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white text-navy-deep rounded-lg border border-outline-variant/30 focus:outline-none"
                      />
                    </div>

                    <button 
                      type="button"
                      disabled={aiGenerating}
                      onClick={generateAiCardGreeting}
                      className="w-full py-3 bg-royal-purple text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {aiGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Sweet Prose...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-joy-yellow" /> Let Zenky Compose!
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Memories Photo Uploading widget */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-navy-deep flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zenky-orange"></span>
                    Add Your Memories
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Drag and drop up to 5 high-res photos to print in the lid. Click a thumbnail to render in live preview.
                  </p>
                </div>

                <div className="border-2 border-dashed border-outline-variant/40 rounded-2xl p-8 text-center bg-surface-mist hover:border-zenky-orange transition-colors cursor-pointer relative group">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-12 h-12 text-outline-variant group-hover:text-zenky-orange mx-auto mb-3 transition-colors" />
                  <p className="font-bold text-navy-deep text-sm mb-1">Click to or Drag-and-Drop photos</p>
                  <p className="text-xs text-on-surface-variant">PNG or JPEG format supported</p>
                </div>

                {/* Grid list of uploaded items */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-navy-deep">Memory Gallery</h4>
                  <div className="flex flex-wrap gap-3">
                    {uploadedPhotos.map((photo, index) => (
                      <button 
                        key={index}
                        onClick={() => setActivePreviewPhoto(photo)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 relative transition-all ${
                          activePreviewPhoto === photo ? "border-zenky-orange scale-105 shadow-md" : "border-outline-variant/30 hover:border-royal-purple"
                        }`}
                      >
                        <img className="w-full h-full object-cover" src={photo} alt={`Uploaded ${index}`} />
                        {activePreviewPhoto === photo && (
                          <div className="absolute inset-0 bg-navy-deep/20 flex items-center justify-center">
                            <Heart className="w-3.5 h-3.5 text-hot-pink fill-hot-pink" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Review final customizable product settings */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-navy-deep flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zenky-orange"></span>
                    Ready for the Magic!
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Please review your completed custom curation on the right hand preview panel.
                  </p>
                </div>

                <div className="bg-orange-50/20 p-5 rounded-2xl border border-outline-variant/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zenky-orange text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="font-bold text-sm text-navy-deep">Summary Details</h4>
                      <p className="text-xs text-on-surface-variant">Customized ZenkyBox Hampers</p>
                    </div>
                  </div>

                  <div className="text-xs space-y-2 divide-y divide-outline-variant/10 text-on-surface-variant">
                    <div className="flex justify-between items-center py-2">
                      <span>Outer Design Layout:</span>
                      <strong className="text-navy-deep font-sans uppercase font-extrabold">{getActiveDesign().name}</strong>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span>Recipient Target Name:</span>
                      <strong className="text-navy-deep font-sans">{recipientName || "None"}</strong>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span>Memories Loaded:</span>
                      <strong className="text-[#006492] font-sans">{uploadedPhotos.length} loaded photos</strong>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-sm text-navy-deep font-bold">
                      <span>Total Lab Premium Price:</span>
                      <span className="text-zenky-orange font-sans">₹3,800</span>
                    </div>
                  </div>
                </div>

                {finishedCustomItem ? (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 shrink-0 text-green-600" />
                    <span>Hooray! Added custom gift box to your ordering basket! 🎉</span>
                  </div>
                ) : (
                  <button 
                    onClick={handleFinishBox}
                    className="w-full py-4 bg-zenky-orange text-white hover:bg-opacity-95 text-lg font-bold rounded-xl active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Confirm & Add to Box
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Stepper bottom controller toggles */}
          <div className="pt-6 border-t border-outline-variant/15 flex items-center justify-between gap-4 mt-8 font-sans font-extrabold">
            <button 
              type="button"
              disabled={activeStep === 1}
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              className="px-5 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-mist text-navy-deep text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            {activeStep < 4 ? (
              <button 
                type="button"
                onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
                className="px-6 py-2.5 bg-royal-purple text-white text-xs font-bold rounded-xl hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

        </div>

        {/* RHS Persistent Sticky visual preview render card */}
        <div className="lg:col-span-12 xl:col-span-5 lg:sticky lg:top-28">
          <div className="bg-navy-deep rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-white min-h-[520px]">
            
            {/* Background floating specs */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-4 h-4 bg-joy-yellow rounded-full"></div>
              <div className="absolute bottom-20 right-10 w-6 h-6 bg-hot-pink rotate-45"></div>
              <div className="absolute top-1/2 right-12 w-3 h-3 bg-secondary rounded-sm"></div>
            </div>

            <div className="absolute top-6 left-6 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zenky-orange animate-pulse"></span>
              <span className="text-[10px] font-sans font-extrabold bg-white/10 px-2 py-0.5 rounded text-white tracking-wider uppercase">
                Interactive Preview
              </span>
            </div>

            {/* Simulated physically rotated unboxing card layer */}
            <div className="relative w-full max-w-sm pt-8">
              <div className={`bg-white rounded-2xl p-5 text-navy-deep transition-all duration-500 shadow-2xl ${
                isPreviewCard3D ? "transform scale-105 rotate-y-6" : ""
              }`}>
                
                {/* Simulated Box logo and helper logo */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-1.5">
                    <img 
                      alt="Box layout mascot" 
                      className="w-8 h-8 rounded-full border border-zenky-orange p-0.5" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfzFsW7gjLeDSdcZKtUOlbMeFBNLhRChZSrEr8rpORAuT4VUZteXXUWzruIKG7yA6VPB7qDr2V4mXltJzyHndUj-iv3_QLWViHvbc83untCslKpnBTpL8W870xDHznMmerNz0B3p-KlVWvVtadTNIXfPUye5SZE4ch9nSzmy5jJwVNJj2CDAN_OlZoZkVS5C-2A8sgmz9MdKXUTVB1GlbCPNNLP9QY5wYH4FWKpptrROmBcbNQLsOFMobcu4VOto3qGWvijiSbEI4-" 
                    />
                    <span className="font-extrabold text-[11px] tracking-wider text-royal-purple uppercase">Zenky Box Card</span>
                  </div>
                  <div className="w-10 h-10 bg-hot-pink/10 rounded-full flex items-center justify-center text-hot-pink">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                </div>

                {/* Rendered main active custom memory image */}
                <div className="h-44 rounded-xl overflow-hidden bg-surface-mist relative group mb-4">
                  <img 
                    alt="Custom active target" 
                    className="w-full h-full object-cover" 
                    src={activePreviewPhoto} 
                  />
                  <div className="absolute inset-0 bg-navy-deep/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs font-bold">Memory photo spot</span>
                  </div>
                  
                  {/* Small absolute Box outer template layer badge in preview top bar */}
                  <span className="absolute bottom-2 left-2 bg-royal-purple text-white text-[9px] font-sans font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {getActiveDesign().name} Template
                  </span>
                </div>

                {/* Live Custom Message typing section */}
                <div className="space-y-2 flex-grow">
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wide">Personal Note</p>
                  <div className="font-body text-sm text-navy-deep italic leading-relaxed font-semibold bg-surface-mist/35 p-3 rounded-lg border border-outline-variant/10 min-h-[70px]">
                    {messageText ? `"${messageText}"` : `"Dear recipient, your customized note will render here instantly exactly as you compose or write it. Make it magical!"`}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-outline-variant/10 flex justify-between items-center text-[10px] text-on-surface-variant font-sans font-bold">
                  <span>Signoff: {recipientName ? `For ${recipientName}` : "Prepared for you"}</span>
                  <span className="text-zenky-orange">ZenkyBox.in</span>
                </div>

              </div>
            </div>

            {/* Card rotation/perspective toggler */}
            <div className="mt-8 flex gap-3 w-full">
              <button 
                onClick={() => setIsPreviewCard3D(!isPreviewCard3D)}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Toggle 3D Perspective
              </button>
            </div>

            {/* Bottom active indicators */}
            <div className="absolute bottom-4 flex gap-1.5">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full transition-color ${idx === 1 ? "bg-zenky-orange" : "bg-white/30"}`} />
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
