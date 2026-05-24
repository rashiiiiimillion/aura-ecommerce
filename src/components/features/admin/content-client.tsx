"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/features/admin/image-upload";
import { createHomepageSection, updateHomepageSection } from "@/actions/content";

type SectionType = "HERO" | "EDITORIAL" | "FEATURED_CAMPAIGN" | "NEWSLETTER";

interface HomepageSection {
  id: string;
  type: SectionType;
  image: string | null;
  isActive: boolean;
}

const PREDEFINED_SLOTS: { type: SectionType; title: string; desc: string; defaultImage: string }[] = [
  { 
    type: "HERO", 
    title: "Main Hero Banner", 
    desc: "The primary full-screen cinematic banner at the top of the homepage.",
    defaultImage: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=2070&auto=format&fit=crop"
  },
  { 
    type: "EDITORIAL", 
    title: "Heritage Collection - Left", 
    desc: "The taller image on the left side of the cinematic grid.",
    defaultImage: "https://images.unsplash.com/photo-1583391733958-650fac5ebf69?q=80&w=1974&auto=format&fit=crop"
  },
  { 
    type: "NEWSLETTER", 
    title: "Heritage Collection - Right", 
    desc: "The smaller offset image on the right side of the cinematic grid.",
    defaultImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop"
  },
  { 
    type: "FEATURED_CAMPAIGN", 
    title: "Immersive Collection Banner", 
    desc: "The large wide banner displayed above the category showcase.",
    defaultImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop"
  },
];

export function ContentClient({ initialSections }: { initialSections: HomepageSection[] }) {
  const router = useRouter();
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);
  const [editingType, setEditingType] = useState<SectionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<HomepageSection>>({});

  const handleEdit = (slotType: SectionType) => {
    const existingSection = sections.find(s => s.type === slotType);
    if (existingSection) {
      setFormData(existingSection);
    } else {
      setFormData({ type: slotType, image: null, isActive: true });
    }
    setEditingType(slotType);
  };

  const handleSave = async () => {
    if (!editingType) return;
    
    try {
      setIsLoading(true);
      const existingSection = sections.find(s => s.type === editingType);
      
      if (existingSection) {
        await updateHomepageSection(existingSection.id, formData);
        toast.success("Image updated successfully");
      } else {
        await createHomepageSection({ ...formData, type: editingType });
        toast.success("Image uploaded successfully");
      }
      
      router.refresh();
      setEditingType(null);
      setFormData({});
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    // Optimistic UI Update
    const newActiveState = !current;
    
    setSections(prev => prev.map(s => s.id === id ? { ...s, isActive: newActiveState } : s));
    
    // Keep editor form in sync if currently editing this section
    if (formData.id === id) {
      setFormData(prev => ({ ...prev, isActive: newActiveState }));
    }

    try {
      await updateHomepageSection(id, { isActive: newActiveState });
      toast.success(newActiveState ? "Image activated" : "Image deactivated (using default)");
      router.refresh();
    } catch (error) {
      // Revert optimistic update on failure
      setSections(prev => prev.map(s => s.id === id ? { ...s, isActive: current } : s));
      if (formData.id === id) {
        setFormData(prev => ({ ...prev, isActive: current }));
      }
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
      {/* Left Column - Visual Slot Manager */}
      <div className={`${editingType ? 'lg:col-span-5' : 'lg:col-span-12'} w-full space-y-4 transition-all duration-300`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {PREDEFINED_SLOTS.map((slot) => {
            const section = sections.find(s => s.type === slot.type);
            const isEditing = editingType === slot.type;
            const displayImage = section?.image || slot.defaultImage;
            
            return (
              <div 
                key={slot.type}
                onClick={() => handleEdit(slot.type)}
                className={`flex flex-col border transition-all cursor-pointer overflow-hidden ${
                  isEditing 
                    ? "border-[#D4AF37] ring-1 ring-[#D4AF37]" 
                    : "border-border/60 hover:border-foreground/30 bg-card"
                }`}
              >
                {/* Image Preview Area */}
                <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden group">
                  <img 
                    src={displayImage} 
                    alt={slot.title} 
                    className={`w-full h-full object-cover transition-transform duration-700 ${section?.image ? '' : 'opacity-60 grayscale-[0.3]'}`} 
                  />
                  {!section?.image && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] uppercase tracking-widest px-2 py-1 backdrop-blur-sm">
                      Default Image
                    </div>
                  )}
                  {section?.image && !section.isActive && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-orange-500/90 text-white text-[10px] uppercase tracking-widest px-3 py-1">Draft (Hidden)</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white text-black text-xs font-bold uppercase tracking-widest px-4 py-2 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      {section?.image ? 'Replace Image' : 'Upload Image'}
                    </span>
                  </div>
                </div>
                
                {/* Info Area */}
                <div className="p-4 flex flex-col justify-between flex-1 bg-card">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">{slot.title}</h4>
                      {section && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Switch 
                            checked={section.isActive} 
                            onCheckedChange={() => handleToggleActive(section.id, section.isActive)}
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-light">{slot.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column - Editor */}
      {editingType && (
        <div className="lg:col-span-7 border border-border/60 bg-card/30 p-6 self-start sticky top-6">
          <div className="space-y-8">
            <div className="flex justify-between items-center pb-4 border-b border-border/60">
              <h3 className="font-heading uppercase tracking-widest text-lg text-[#D4AF37]">
                Manage: {PREDEFINED_SLOTS.find(s => s.type === editingType)?.title}
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setEditingType(null)}
                className="hover:bg-transparent hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3 flex items-center justify-between p-4 border border-border/60 bg-background/50">
                <div className="space-y-1">
                  <p className="text-sm font-bold uppercase tracking-widest">Enable Custom Image</p>
                  <p className="text-xs text-muted-foreground">If disabled, the storefront will revert to the default cinematic image.</p>
                </div>
                <Switch 
                  checked={formData.isActive !== false} 
                  onCheckedChange={(c) => setFormData({ ...formData, isActive: c })}
                />
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest">Upload New Image</label>
                  <p className="text-xs text-muted-foreground">High-quality luxury imagery recommended. It will be cropped automatically.</p>
                </div>
                <ImageUpload 
                  value={formData.image ? [formData.image] : []}
                  onChange={(urls) => setFormData({ ...formData, image: urls[0] || null })}
                />
              </div>
              
              <Button 
                onClick={handleSave} 
                disabled={isLoading || !formData.image} 
                className="w-full h-12 rounded-none bg-foreground text-background hover:bg-[#D4AF37] hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
              >
                {isLoading ? "Saving..." : "Save Image to Storefront"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
