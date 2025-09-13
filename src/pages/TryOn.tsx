import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Share2, RotateCcw, Sparkles } from "lucide-react";

const TryOn = () => {
  const { toast } = useToast();
  const modelInputRef = useRef<HTMLInputElement>(null);
  const garmentInputRef = useRef<HTMLInputElement>(null);
  
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [garmentUrl, setGarmentUrl] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // AI Settings
  const [samples, setSamples] = useState([20]);
  const [steps, setSteps] = useState([20]);
  const [guidanceScale, setGuidanceScale] = useState([7.5]);

  const handleImageUpload = (
    file: File, 
    setImage: (url: string) => void,
    type: string
  ) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
        toast({
          title: `${type} uploaded successfully`,
          description: "Image has been processed and is ready for try-on"
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid image file",
        variant: "destructive"
      });
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    setImage: (url: string) => void,
    type: string
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file, setImage, type);
    }
  };

  const handleGenerate = async () => {
    if (!modelImage) {
      toast({
        title: "Model image required",
        description: "Please upload a model photo first",
        variant: "destructive"
      });
      return;
    }

    if (!garmentImage && !garmentUrl) {
      toast({
        title: "Garment required", 
        description: "Please upload a garment image or provide a URL",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate AI processing with progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // For demo purposes, we'll show the model image as result
      // In real implementation, this would be the AI-generated try-on result
      setResultImage(modelImage);
      setProgress(100);
      
      toast({
        title: "Virtual try-on complete!",
        description: "Your AI-generated result is ready",
      });

    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again with different images",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'virtual-tryon-result.png';
      link.click();
      
      toast({
        title: "Download started",
        description: "Your try-on result is being downloaded"
      });
    }
  };

  const handleShare = () => {
    if (resultImage) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard"
      });
    }
  };

  const handleReset = () => {
    setModelImage(null);
    setGarmentImage(null);
    setGarmentUrl("");
    setResultImage(null);
    setProgress(0);
    
    toast({
      title: "Reset complete",
      description: "All images and settings have been cleared"
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 animate-glow">
              AI Virtual Try-On
            </h1>
            <p className="text-white/80 text-lg">
              Upload your photo and see how any garment looks on you with unlimited AI generations
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Model Image Upload */}
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Model Photo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="upload-area group"
                  onDrop={(e) => handleDrop(e, setModelImage, "Model photo")}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => modelInputRef.current?.click()}
                >
                  {modelImage ? (
                    <img
                      src={modelImage}
                      alt="Model"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground group-hover:text-ai-primary transition-colors" />
                      <p className="text-sm text-muted-foreground">
                        Drop model photo here or click to upload
                      </p>
                    </div>
                  )}
                </div>
                
                <input
                  ref={modelInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, setModelImage, "Model photo");
                  }}
                />
                
                <Button
                  variant="outline"
                  onClick={() => modelInputRef.current?.click()}
                  className="w-full"
                >
                  Choose Model Photo
                </Button>
              </CardContent>
            </Card>

            {/* Garment Upload */}
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Garment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="upload-area group"
                  onDrop={(e) => handleDrop(e, setGarmentImage, "Garment")}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => garmentInputRef.current?.click()}
                >
                  {garmentImage ? (
                    <img
                      src={garmentImage}
                      alt="Garment"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <Sparkles className="h-12 w-12 mx-auto text-muted-foreground group-hover:text-ai-primary transition-colors" />
                      <p className="text-sm text-muted-foreground">
                        Drop garment image here or click to upload
                      </p>
                    </div>
                  )}
                </div>
                
                <input
                  ref={garmentInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, setGarmentImage, "Garment");
                  }}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="garment-url">Or paste garment URL:</Label>
                  <Input
                    id="garment-url"
                    placeholder="https://example.com/garment.jpg"
                    value={garmentUrl}
                    onChange={(e) => setGarmentUrl(e.target.value)}
                  />
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => garmentInputRef.current?.click()}
                  className="w-full"
                >
                  Choose Garment
                </Button>
              </CardContent>
            </Card>

            {/* AI Settings & Result */}
            <Card className="ai-card">
              <CardHeader>
                <CardTitle>AI Settings & Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Settings */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Samples: {samples[0]}</Label>
                    <Slider
                      value={samples}
                      onValueChange={setSamples}
                      max={50}
                      min={1}
                      step={1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Steps: {steps[0]}</Label>
                    <Slider
                      value={steps}
                      onValueChange={setSteps}
                      max={50}
                      min={10}
                      step={1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Guidance Scale: {guidanceScale[0]}</Label>
                    <Slider
                      value={guidanceScale}
                      onValueChange={setGuidanceScale}
                      max={20}
                      min={1}
                      step={0.5}
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  variant="ai"
                  className="w-full"
                >
                  {isGenerating ? "Generating..." : "Generate Try-On"}
                </Button>

                {/* Progress Bar */}
                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-ai-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Result */}
                {resultImage && (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={resultImage}
                        alt="Try-on result"
                        className="w-full rounded-lg shadow-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-ai-primary text-white">
                        AI Generated
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryOn;