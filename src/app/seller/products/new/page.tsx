"use client";

import { useAuth } from "../../../../context/AuthContext";
import { useProducts, NewProductDraft } from "../../../../context/ProductContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, Save } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea"; // Assuming it exists, otherwise we'll just use textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Card, CardContent } from "../../../../components/ui/card";
import { toast } from "sonner";
import { categories } from "../../../../data/products";

export default function NewProductPage() {
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const router = useRouter();

  const [formData, setFormData] = useState<NewProductDraft>({
    name: "",
    category: "",
    image: "",
    startingBid: 0,
    description: "",
    condition: "Brand New",
    durationDays: 7
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "startingBid" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.image || !formData.description) {
      toast.error("Missing Fields", { description: "Please fill out all required fields." });
      return;
    }

    if (formData.startingBid <= 0) {
      toast.error("Invalid Bid", { description: "Starting bid must be greater than 0." });
      return;
    }

    if (user && user.id) {
      addProduct(formData, user.id);
      toast.success("Auction created successfully", { description: "Your product is now listed on BidMax." });
      router.push("/seller/products");
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Create New Listing</h1>
        <p className="text-muted-foreground">Fill in the details below to launch a new auction.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 shadow-sm">
              <CardContent className="p-6 md:p-8 space-y-6">
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Product Name <span className="text-red-500">*</span></label>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="e.g. Rolex Submariner 2023" 
                    className="h-12 text-lg border-slate-200"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Description <span className="text-red-500">*</span></label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Describe the item, its history, specifications..." 
                    className="w-full min-h-[160px] p-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-y"
                    required
                  />
                </div>

              </CardContent>
            </Card>

            <Card className="border-2 shadow-sm">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Category <span className="text-red-500">*</span></label>
                    <Select onValueChange={(val) => handleSelectChange('category', val)}>
                      <SelectTrigger className="h-12 border-slate-200">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Condition</label>
                    <Select defaultValue={formData.condition} onValueChange={(val) => handleSelectChange('condition', val)}>
                      <SelectTrigger className="h-12 border-slate-200">
                        <SelectValue placeholder="Select Condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Brand New">Brand New</SelectItem>
                        <SelectItem value="Like New">Like New</SelectItem>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Vintage/Used">Vintage/Used</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-3">Starting Bid Amount (USD) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                      <Input 
                        name="startingBid" 
                        type="number"
                        min="1"
                        value={formData.startingBid || ""} 
                        onChange={handleChange} 
                        placeholder="0.00" 
                        className="h-14 pl-8 text-xl border-slate-200"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-3">Auction Duration <span className="text-red-500">*</span></label>
                    <Select defaultValue={formData.durationDays.toString()} onValueChange={(val) => handleSelectChange('durationDays', parseInt(val))}>
                      <SelectTrigger className="h-14 text-lg border-slate-200">
                        <SelectValue placeholder="Select Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="5">5 Days</SelectItem>
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem value="10">10 Days</SelectItem>
                        <SelectItem value="14">14 Days</SelectItem>
                        <SelectItem value="30">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Media */}
          <div className="space-y-6">
            <Card className="border-2 shadow-sm bg-slate-50/50">
              <CardContent className="p-6">
                <label className="text-sm font-semibold text-slate-800 block mb-3">Product Image <span className="text-red-500">*</span></label>
                <p className="text-xs text-slate-500 mb-4 tracking-wide leading-relaxed">
                  Upload a high-quality image of your product.
                </p>
                <div className="space-y-4">
                  <Input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, image: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="bg-white border-slate-200 cursor-pointer p-0 h-auto file:bg-slate-100 file:border-0 file:px-4 file:py-2 file:mr-4 file:hover:bg-slate-200 file:text-sm file:font-semibold rounded-md border text-slate-600"
                    required={!formData.image}
                  />
                  
                  <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 flex items-center justify-center relative">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    ) : (
                      <div className="text-center p-6 text-slate-400">
                        <UploadCloud className="size-10 mx-auto mb-2 opacity-50" />
                        <span className="text-sm font-medium">Image Preview</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 pt-4">
              <Button type="submit" className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-bold text-lg shadow-xl shadow-accent/20">
                <Save className="size-5 mr-3" />
                Launch Auction
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="w-full h-12 border-2 text-slate-600">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
