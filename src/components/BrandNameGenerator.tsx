import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Trash2, Heart, X, Check, Loader2, Sun, Moon, Shield } from "lucide-react";
import { toast } from "sonner";
import appIcon from "@/assets/app-icon.png";
import { useTheme } from "@/hooks/use-theme";
import { showInterstitialAd, showBannerAd, hideBannerAd } from "@/lib/admob";

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
  isCheckingDomain?: boolean;
  domainStatus?: {
    com: boolean;
    in: boolean;
    ai: boolean;
    checked: boolean;
  };
}

const generateBrandNames = async (formData: FormData): Promise<GeneratedName[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-brand-names`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate names');
  }

  const { names } = await response.json();
  
  return names.map((name: string, index: number) => ({
    id: `name-${Date.now()}-${index}`,
    name: name
  }));
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

  const [allBatches, setAllBatches] = useState<GeneratedName[][]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [wishlist, setWishlist] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Show banner ad on mount, hide on unmount
  useEffect(() => {
    showBannerAd();
    return () => { hideBannerAd(); };
  }, []);
  
  const { theme, toggleTheme } = useTheme();

  const handlePrivacyPolicy = () => {
    window.open("https://raghvendrprajapat.github.io/Brandforge-privacy-policy/", "_blank");
  };

  const handleCheckboxChange = (field: keyof FormData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!navigator.onLine) {
      toast.error("You are offline");
      return;
    }

    if (!formData.industry.trim()) {
      toast.error("Please select an industry");
      return;
    }

    setIsGenerating(true);

    // Show interstitial ad instantly + generate names in background simultaneously
    const [, names] = await Promise.all([
      showInterstitialAd().catch(() => false),
      generateBrandNames(formData).catch(() => null),
    ]);

    if (names) {
      setAllBatches([names]);
      setCurrentBatchIndex(0);
      toast.success("10 brand names generated!");
    }
    setIsGenerating(false);
  };

  const handleNextBatch = async () => {
    if (!navigator.onLine) {
      toast.error("You are offline");
      return;
    }

    setIsGenerating(true);

    // Show interstitial ad instantly + generate names in background simultaneously
    const [, names] = await Promise.all([
      showInterstitialAd().catch(() => false),
      generateBrandNames(formData).catch(() => null),
    ]);

    if (names) {
      setAllBatches(prev => [...prev, names]);
      setCurrentBatchIndex(prev => prev + 1);
      toast.success("New batch generated!");
    }
    setIsGenerating(false);
  };

  const handlePreviousBatch = () => {
    if (currentBatchIndex > 0) {
      setCurrentBatchIndex(prev => prev - 1);
    }
  };

  const handleNextBatchNavigation = () => {
    if (currentBatchIndex < allBatches.length - 1) {
      setCurrentBatchIndex(prev => prev + 1);
    }
  };

  const currentBatch = allBatches[currentBatchIndex] || [];
  const totalBatches = allBatches.length;

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

  const checkDomain = async (name: GeneratedName) => {
    // Set loading state
    setAllBatches(prev =>
      prev.map(batch =>
        batch.map(n => n.id === name.id ? { ...n, isCheckingDomain: true } : n)
      )
    );
    setWishlist(prev =>
      prev.map(n => n.id === name.id ? { ...n, isCheckingDomain: true } : n)
    );

    toast.info(`Checking domain for ${name.name}...`);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-domain`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ domainName: name.name })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to check domain');
      }

      const data = await response.json();
      
      const updatedName = {
        ...name,
        isCheckingDomain: false,
        domainStatus: {
          com: data.availability.com,
          in: data.availability.in,
          ai: data.availability.ai,
          checked: true
        }
      };

      // Update in all batches
      setAllBatches(prev =>
        prev.map(batch =>
          batch.map(n => n.id === name.id ? updatedName : n)
        )
      );

      // Update in wishlist if present
      setWishlist(prev =>
        prev.map(n => n.id === name.id ? updatedName : n)
      );

      const availableCount = Object.values(data.availability).filter(Boolean).length;
      if (availableCount > 0) {
        toast.success(`${availableCount} domain(s) available for ${name.name}!`);
      } else {
        toast.error(`No domains available for ${name.name}`);
      }
    } catch (error) {
      console.error('Domain check error:', error);
      toast.error('Failed to check domain availability');
      
      // Clear loading state on error
      setAllBatches(prev =>
        prev.map(batch =>
          batch.map(n => n.id === name.id ? { ...n, isCheckingDomain: false } : n)
        )
      );
      setWishlist(prev =>
        prev.map(n => n.id === name.id ? { ...n, isCheckingDomain: false } : n)
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-2xl mx-auto p-3 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={appIcon} alt="BrandForge" className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">BrandForge</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                aria-label="Toggle theme"
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
            
            {/* Privacy Policy */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrivacyPolicy}
              className="text-muted-foreground hover:text-foreground"
            >
              <Shield className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Privacy</span>
            </Button>
          </div>
        </div>

        {/* Generation Criteria Card */}
        <Card className="p-3 sm:p-6 mb-4 sm:mb-6 bg-card border-border">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Generation Criteria</h2>
          
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
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-3 pt-2">
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate 10 Names"
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleNextBatch}
                disabled={isGenerating || allBatches.length === 0}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Next 10 (new batch)"
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Card */}
        <Card className="p-3 sm:p-6 mb-4 sm:mb-6 bg-card border-border">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              Results (Batch {totalBatches === 0 ? 0 : currentBatchIndex + 1}/{totalBatches})
            </h2>
          </div>

          {isGenerating && currentBatch.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm"><p className="text-muted-foreground text-sm">Generating business names...</p></p>
            </div>
          ) : currentBatch.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Generate to see your 10 names here
            </p>
          ) : (
            <div className="space-y-2">
              {currentBatch.map((name, idx) => (
                <div key={name.id}>
                  <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 rounded-lg bg-background border border-border/50"
                  >
                    <span className="text-sm sm:text-base text-foreground font-medium">
                      {idx + 1}. {name.name}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-8 w-8 ${wishlist.find(w => w.id === name.id) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                        onClick={() => addToWishlist(name)}
                      >
                        <Heart className={`h-4 w-4 ${wishlist.find(w => w.id === name.id) ? 'fill-current' : ''}`} />
                      </Button>
                      {name.isCheckingDomain ? (
                        <div className="flex items-center gap-2 px-3 py-1">
                          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-muted-foreground">Checking...</span>
                        </div>
                      ) : name.domainStatus?.checked ? (
                        <div className="flex gap-1 flex-wrap">
                          <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium flex items-center gap-1 ${name.domainStatus.com ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {name.domainStatus.com ? <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                            .com
                          </div>
                          <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium flex items-center gap-1 ${name.domainStatus.in ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {name.domainStatus.in ? <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                            .in
                          </div>
                          <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium flex items-center gap-1 ${name.domainStatus.ai ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {name.domainStatus.ai ? <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                            .ai
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-[10px] sm:text-xs px-2"
                          onClick={() => checkDomain(name)}
                        >
                          Check Domain Availability
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-4 pt-4 border-t border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              disabled={currentBatchIndex === 0}
              onClick={handlePreviousBatch}
              className={currentBatchIndex === 0 ? 'text-muted-foreground' : 'text-foreground'}
            >
              Previous
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              disabled={currentBatchIndex === totalBatches - 1 || totalBatches === 0}
              onClick={handleNextBatchNavigation}
              className={currentBatchIndex === totalBatches - 1 || totalBatches === 0 ? 'text-muted-foreground' : 'text-foreground'}
            >
              Next
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4 italic">
            Domain availability shown is indicative only — please verify at a domain registrar before purchase.
          </p>
        </Card>

        {/* Wishlist Card */}
        <Card className="p-3 sm:p-6 bg-card border-border">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">
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
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <span className="text-sm sm:text-base text-foreground font-medium flex-1">
                    {idx + 1}. {name.name}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {name.isCheckingDomain ? (
                      <div className="flex items-center gap-2 px-3 py-1">
                        <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-muted-foreground">Checking...</span>
                      </div>
                    ) : name.domainStatus?.checked ? (
                      <div className="flex gap-1 flex-wrap">
                        <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium flex items-center gap-1 ${name.domainStatus.com ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {name.domainStatus.com ? <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                          .com
                        </div>
                        <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium flex items-center gap-1 ${name.domainStatus.in ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {name.domainStatus.in ? <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                          .in
                        </div>
                        <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium flex items-center gap-1 ${name.domainStatus.ai ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {name.domainStatus.ai ? <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                          .ai
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-[10px] sm:text-xs px-2"
                        onClick={() => checkDomain(name)}
                      >
                        Check Domain Availability
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromWishlist(name.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
