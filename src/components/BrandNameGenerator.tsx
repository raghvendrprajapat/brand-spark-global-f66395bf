import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  industry: string;
  markets: string;
  tone: string;
  stylePreferences: string;
  lengthMin: string;
  lengthMax: string;
  startingLetter: string;
  includeKeywords: string;
  avoidKeywords: string;
}

const generateBrandNames = (formData: FormData): string[] => {
  // Mock sophisticated name generation based on input
  const { industry, tone, startingLetter } = formData;
  
  const prefixes = ["Zen", "Nova", "Flux", "Apex", "Vibe", "Echo", "Prism", "Nexus", "Clarity", "Forge"];
  const suffixes = ["ify", "ly", "io", "hub", "wave", "flow", "rise", "sync", "wise", "core"];
  const roots = ["brand", "mark", "vista", "shift", "spark", "craft", "mint", "vault", "blend", "pulse"];
  
  const coined = ["Vistara", "Zenova", "Fluxion", "Apexify", "Vibrant", "Echora", "Prismly", "Nexify", "Clarix", "Forgepoint"];
  const metaphors = ["Catalyst", "Horizon", "Summit", "Compass", "Anchor", "Phoenix", "Atlas", "Titan", "Mercury", "Oracle"];
  const blends = ["Brandwise", "Markflow", "Vistarise", "Shiftsync", "Sparkcore", "Craftly", "Mintvault", "Blendify", "Pulsewave", "Nexpoint"];
  
  let pool = [...coined, ...metaphors, ...blends];
  
  // Filter by starting letter if specified
  if (startingLetter) {
    pool = pool.filter(name => name.toLowerCase().startsWith(startingLetter.toLowerCase()));
    // If not enough, generate more with that letter
    if (pool.length < 10) {
      pool = [
        ...pool,
        ...prefixes.filter(p => p.toLowerCase().startsWith(startingLetter.toLowerCase())),
        ...suffixes.map(s => startingLetter.toUpperCase() + s),
      ];
    }
  }
  
  // Adjust for tone
  if (tone === "premium") {
    pool = [...metaphors, "Luxora", "Prestigia", "Elitev", "Grandeur", "Magnify", "Regalix", "Primacy", "Sovereign", "Virtus", "Eminence"];
  } else if (tone === "playful") {
    pool = ["Zippy", "Bouncy", "Quirk", "Fizzy", "Peppy", "Joyful", "Whimsy", "Bubbles", "Sparkly", "Giggles"];
  } else if (tone === "rugged") {
    pool = ["Ironclad", "Granite", "Boulder", "Fortress", "Summit", "Canyon", "Ridge", "Outpost", "Frontier", "Bastion"];
  }
  
  // Shuffle and return 10 unique names
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const unique = Array.from(new Set(shuffled));
  return unique.slice(0, 10);
};

export const BrandNameGenerator = () => {
  const [formData, setFormData] = useState<FormData>({
    industry: "",
    markets: "India + Global",
    tone: "modern",
    stylePreferences: "coined, blend, metaphor",
    lengthMin: "4",
    lengthMax: "10",
    startingLetter: "",
    includeKeywords: "",
    avoidKeywords: "",
  });

  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    if (!formData.industry.trim()) {
      toast.error("Please enter an industry/category");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const names = generateBrandNames(formData);
      setGeneratedNames(names);
      setIsGenerating(false);
      toast.success("10 brand names generated!");
    }, 1500);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const names = generateBrandNames(formData);
      setGeneratedNames(names);
      setIsGenerating(false);
      toast.success("10 new brand names generated!");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            World-Class Brand Naming Engine
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Brand Name Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Competition-killing brand names for India & global markets. Distinctive, memorable, and strategically crafted.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-6 shadow-[var(--shadow-elegant)]">
            <h2 className="text-2xl font-semibold mb-6">Name Generator Inputs</h2>
            
            <div className="space-y-5">
              <div>
                <Label htmlFor="industry">Industry / Category *</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Tech SaaS, Fashion, Food Delivery"
                  value={formData.industry}
                  onChange={(e) => handleInputChange("industry", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="markets">Target Markets</Label>
                <Input
                  id="markets"
                  placeholder="e.g., India + Global, US, Southeast Asia"
                  value={formData.markets}
                  onChange={(e) => handleInputChange("markets", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="tone">Brand Tone</Label>
                <Select value={formData.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern / Neutral</SelectItem>
                    <SelectItem value="premium">Premium / Luxury</SelectItem>
                    <SelectItem value="playful">Playful / Friendly</SelectItem>
                    <SelectItem value="rugged">Rugged / Bold</SelectItem>
                    <SelectItem value="professional">Professional / Corporate</SelectItem>
                    <SelectItem value="innovative">Innovative / Cutting-edge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="stylePreferences">Style Preferences</Label>
                <Input
                  id="stylePreferences"
                  placeholder="e.g., coined, metaphor, blend"
                  value={formData.stylePreferences}
                  onChange={(e) => handleInputChange("stylePreferences", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lengthMin">Min Length</Label>
                  <Input
                    id="lengthMin"
                    type="number"
                    min="3"
                    max="12"
                    value={formData.lengthMin}
                    onChange={(e) => handleInputChange("lengthMin", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="lengthMax">Max Length</Label>
                  <Input
                    id="lengthMax"
                    type="number"
                    min="4"
                    max="15"
                    value={formData.lengthMax}
                    onChange={(e) => handleInputChange("lengthMax", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="startingLetter">Starting Letter (Optional)</Label>
                <Input
                  id="startingLetter"
                  placeholder="e.g., V"
                  maxLength={1}
                  value={formData.startingLetter}
                  onChange={(e) => handleInputChange("startingLetter", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="includeKeywords">Keywords to Include (Optional)</Label>
                <Textarea
                  id="includeKeywords"
                  placeholder="e.g., fast, smart, global"
                  value={formData.includeKeywords}
                  onChange={(e) => handleInputChange("includeKeywords", e.target.value)}
                  className="mt-1.5 resize-none"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="avoidKeywords">Keywords to Avoid (Optional)</Label>
                <Textarea
                  id="avoidKeywords"
                  placeholder="e.g., tech, app, soft"
                  value={formData.avoidKeywords}
                  onChange={(e) => handleInputChange("avoidKeywords", e.target.value)}
                  className="mt-1.5 resize-none"
                  rows={2}
                />
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating Names...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate 10 Brand Names
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            <Card className="p-6 shadow-[var(--shadow-elegant)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Generated Names</h2>
                {generatedNames.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                  >
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                )}
              </div>

              {generatedNames.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Fill in the form and click "Generate" to see your brand names</p>
                </div>
              ) : (
                <ol className="space-y-3">
                  {generatedNames.map((name, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border hover:border-accent/50 hover:shadow-[var(--shadow-glow)] transition-all duration-200"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </span>
                      <span className="text-lg font-medium">{name}</span>
                    </li>
                  ))}
                </ol>
              )}
            </Card>

            {generatedNames.length > 0 && (
              <Card className="p-6 bg-accent/5 border-accent/20">
                <h3 className="font-semibold text-accent mb-2">Next Steps</h3>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>• Check domain availability for your favorite names</li>
                  <li>• Verify trademark status in your target markets</li>
                  <li>• Test pronunciation with native speakers</li>
                  <li>• Validate social media handle availability</li>
                </ul>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
