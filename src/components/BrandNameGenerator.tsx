import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Square } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  industry: string;
  coined: boolean;
  compound: boolean;
  blend: boolean;
  metaphor: boolean;
  startingLetter: string;
  includeKeywords: string;
  avoidKeywords: string;
  otherRequirements: string;
  english: boolean;
  hinglish: boolean;
}

interface GeneratedName {
  id: string;
  name: string;
}

const sampleNames = [
  "Nivaan", "Mekina", "Capriva Estate", "Captiva Estate", "Caplore Estate",
  "Eolhoscar", "Eovencar", "Eoboltcar", "Eoflexcar", "KPSnickey",
  "KPShipmark", "Vistara", "Zenova", "Fluxion", "Apexify",
  "Vibrant", "Echora", "Prismly", "Nexify", "Clarix"
];

const generateBrandNames = (formData: FormData): GeneratedName[] => {
  const names = [...sampleNames]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map((name, idx) => ({
      id: `name-${Date.now()}-${idx}`,
      name: name
    }));
  return names;
};

export const BrandNameGenerator = () => {
  const [formData, setFormData] = useState<FormData>({
    industry: "",
    coined: true,
    compound: true,
    blend: true,
    metaphor: true,
    startingLetter: "",
    includeKeywords: "",
    avoidKeywords: "",
    otherRequirements: "",
    english: true,
    hinglish: true,
  });

  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [wishlist, setWishlist] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(1);

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleCheckboxChange = (field: keyof FormData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    if (!formData.industry.trim()) {
      toast.error("Please select an industry");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const names = generateBrandNames(formData);
      setGeneratedNames(names);
      setCurrentBatch(1);
      setIsGenerating(false);
      toast.success("10 brand names generated!");
    }, 1500);
  };

  const handleNextBatch = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const names = generateBrandNames(formData);
      setGeneratedNames(names);
      setCurrentBatch(prev => prev + 1);
      setIsGenerating(false);
      toast.success("New batch generated!");
    }, 1200);
  };

  const addToWishlist = (name: GeneratedName) => {
    if (!wishlist.find(w => w.id === name.id)) {
      setWishlist(prev => [...prev, name]);
      toast.success(`${name.name} added to wishlist`);
    }
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
    toast.success("Removed from wishlist");
  };

  const checkDomain = (name: string) => {
    toast.info(`Checking domain for ${name}...`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[hsl(var(--brand-orange))] flex items-center justify-center">
            <Square className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">BrandForge</h1>
        </div>

        {/* Generation Criteria Card */}
        <Card className="p-6 mb-6 bg-card border-border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Generation Criteria</h2>
          
          <div className="space-y-4">
            {/* Industry */}
            <div>
              <Label className="text-sm font-medium text-foreground">Industry / Category</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                <SelectTrigger className="mt-1.5 bg-background">
                  <SelectValue placeholder="Select an industry (required)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology & SaaS</SelectItem>
                  <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="health">Healthcare & Wellness</SelectItem>
                  <SelectItem value="finance">Finance & Fintech</SelectItem>
                  <SelectItem value="education">Education & E-learning</SelectItem>
                  <SelectItem value="realestate">Real Estate & Property</SelectItem>
                  <SelectItem value="automotive">Automotive & Mobility</SelectItem>
                  <SelectItem value="ecommerce">E-commerce & Retail</SelectItem>
                  <SelectItem value="travel">Travel & Hospitality</SelectItem>
                  <SelectItem value="beauty">Beauty & Cosmetics</SelectItem>
                  <SelectItem value="sports">Sports & Fitness</SelectItem>
                  <SelectItem value="entertainment">Entertainment & Media</SelectItem>
                  <SelectItem value="consulting">Consulting & Professional Services</SelectItem>
                  <SelectItem value="logistics">Logistics & Supply Chain</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing & Industrial</SelectItem>
                  <SelectItem value="agriculture">Agriculture & Farming</SelectItem>
                  <SelectItem value="energy">Energy & Sustainability</SelectItem>
                  <SelectItem value="gaming">Gaming & Esports</SelectItem>
                  <SelectItem value="crypto">Crypto & Blockchain</SelectItem>
                  <SelectItem value="ai">AI & Machine Learning</SelectItem>
                  <SelectItem value="iot">IoT & Smart Devices</SelectItem>
                  <SelectItem value="security">Cybersecurity</SelectItem>
                  <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                  <SelectItem value="legal">Legal & Law Services</SelectItem>
                  <SelectItem value="nonprofit">Non-profit & Social Impact</SelectItem>
                  <SelectItem value="pets">Pets & Animal Care</SelectItem>
                  <SelectItem value="home">Home & Interior Design</SelectItem>
                  <SelectItem value="events">Events & Event Management</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Style Checkboxes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="coined" 
                  checked={formData.coined}
                  onCheckedChange={(checked) => handleCheckboxChange("coined", checked as boolean)}
                />
                <Label htmlFor="coined" className="text-sm font-normal cursor-pointer">Coined</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="blend" 
                  checked={formData.blend}
                  onCheckedChange={(checked) => handleCheckboxChange("blend", checked as boolean)}
                />
                <Label htmlFor="blend" className="text-sm font-normal cursor-pointer">Blend</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="compound" 
                  checked={formData.compound}
                  onCheckedChange={(checked) => handleCheckboxChange("compound", checked as boolean)}
                />
                <Label htmlFor="compound" className="text-sm font-normal cursor-pointer">Compound</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="metaphor" 
                  checked={formData.metaphor}
                  onCheckedChange={(checked) => handleCheckboxChange("metaphor", checked as boolean)}
                />
                <Label htmlFor="metaphor" className="text-sm font-normal cursor-pointer">Metaphor</Label>
              </div>
            </div>

            {/* Starting Letter */}
            <div>
              <Label className="text-sm font-medium text-foreground">Starting Letter(s) (optional)</Label>
              <Input
                placeholder="e.g., R"
                value={formData.startingLetter}
                onChange={(e) => handleInputChange("startingLetter", e.target.value)}
                className="mt-1.5 bg-background"
              />
            </div>

            {/* Include Keywords */}
            <div>
              <Label className="text-sm font-medium text-foreground">Include Keywords (optional)</Label>
              <Input
                placeholder="e.g., data, cloud"
                value={formData.includeKeywords}
                onChange={(e) => handleInputChange("includeKeywords", e.target.value)}
                className="mt-1.5 bg-background"
              />
            </div>

            {/* Avoid Keywords */}
            <div>
              <Label className="text-sm font-medium text-foreground">Avoid Keywords (optional)</Label>
              <Input
                placeholder="e.g., tech, solutions"
                value={formData.avoidKeywords}
                onChange={(e) => handleInputChange("avoidKeywords", e.target.value)}
                className="mt-1.5 bg-background"
              />
            </div>

            {/* Other Requirements */}
            <div>
              <Label className="text-sm font-medium text-foreground">Other Requirements (optional)</Label>
              <Textarea
                placeholder="e.g., premium, global-friendly"
                value={formData.otherRequirements}
                onChange={(e) => handleInputChange("otherRequirements", e.target.value)}
                className="mt-1.5 bg-background resize-none"
                rows={3}
              />
            </div>

            {/* Language Checkboxes */}
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="english" 
                  checked={formData.english}
                  onCheckedChange={(checked) => handleCheckboxChange("english", checked as boolean)}
                />
                <Label htmlFor="english" className="text-sm font-normal cursor-pointer">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hinglish" 
                  checked={formData.hinglish}
                  onCheckedChange={(checked) => handleCheckboxChange("hinglish", checked as boolean)}
                />
                <Label htmlFor="hinglish" className="text-sm font-normal cursor-pointer">Hinglish</Label>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                Generate 10 Names
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleNextBatch}
                disabled={isGenerating || generatedNames.length === 0}
              >
                Next 10 (new batch)
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Card */}
        <Card className="p-6 mb-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Results (Batch {currentBatch}/1)
            </h2>
          </div>

          {generatedNames.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Generate to see your 10 names here
            </p>
          ) : (
            <div className="space-y-2">
              {generatedNames.map((name, idx) => (
                <div
                  key={name.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => addToWishlist(name)}
                >
                  <span className="text-foreground">
                    {idx + 1}. {name.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-4 pt-4 border-t border-border">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm" disabled>Next</Button>
          </div>
        </Card>

        {/* Wishlist Card */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            Wishlist ({wishlist.length})
          </h2>

          {wishlist.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Click on generated names to add them to your wishlist
            </p>
          ) : (
            <div className="space-y-3">
              {wishlist.map((name, idx) => (
                <div
                  key={name.id}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-foreground flex-1">
                    {idx + 1}. {name.name}
                  </span>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-xs"
                    onClick={() => checkDomain(name.name)}
                  >
                    Check Domain Availability
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeFromWishlist(name.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
