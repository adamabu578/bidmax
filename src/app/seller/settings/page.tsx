"use client";

import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import { Save, Store, Mail, Phone, Image as ImageIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { toast } from "sonner";

export default function StoreSettingsPage() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    email: "",
    phone: "",
    logoUrl: ""
  });

  useEffect(() => {
    if (user) {
      // Pre-fill with user info if available, or load from local storage
      const savedSettings = localStorage.getItem(`store_settings_${user.id}`);
      if (savedSettings) {
        setFormData(JSON.parse(savedSettings));
      } else {
        setFormData(prev => ({
          ...prev,
          storeName: user.name + "'s Store",
          email: user.email || ""
        }));
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.storeName) {
      toast.error("Missing Field", { description: "Store Name is required." });
      return;
    }

    if (user) {
      localStorage.setItem(`store_settings_${user.id}`, JSON.stringify(formData));
      toast.success("Settings Saved", { description: "Your store settings have been updated successfully." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Store Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your public storefront profile and contact details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-2 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b px-6 py-4 flex items-center gap-3">
            <Store className="size-5 text-accent" />
            <h2 className="font-semibold text-lg text-slate-800">Basic Profile</h2>
          </div>
          <CardContent className="p-6 md:p-8 space-y-6 bg-white">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Store Name <span className="text-red-500">*</span></label>
              <Input 
                name="storeName" 
                value={formData.storeName} 
                onChange={handleChange} 
                className="h-12 text-lg border-slate-200"
                placeholder="My Awesome Store"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Store Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Tell buyers what makes your store special..." 
                className="w-full min-h-[120px] p-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-y"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Logo/Avatar URL</label>
              <div className="flex gap-4 items-center">
                {formData.logoUrl ? (
                  <div className="size-16 rounded-lg border-2 border-slate-200 overflow-hidden shrink-0">
                    <img src={formData.logoUrl} alt="Store logo" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                ) : (
                  <div className="size-16 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center shrink-0 bg-slate-50">
                    <ImageIcon className="size-6 text-slate-400" />
                  </div>
                )}
                <Input 
                  name="logoUrl" 
                  value={formData.logoUrl} 
                  onChange={handleChange} 
                  className="h-12 border-slate-200"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b px-6 py-4 flex items-center gap-3">
            <Mail className="size-5 text-accent" />
            <h2 className="font-semibold text-lg text-slate-800">Contact Information</h2>
          </div>
          <CardContent className="p-6 md:p-8 space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Public Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                  <Input 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleChange} 
                    className="h-12 pl-10 border-slate-200"
                    placeholder="store@example.com"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Business Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                  <Input 
                    name="phone" 
                    type="tel"
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="h-12 pl-10 border-slate-200"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="submit" className="px-8 h-12 bg-accent hover:bg-accent/90 text-white font-bold text-[15px] shadow-lg shadow-accent/20">
            <Save className="size-5 mr-2" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
