import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

interface Measurements {
  height: string;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  shoulders: string;
}

interface FitAnalysis {
  bodyType: "hourglass" | "pear" | "apple" | "rectangle" | "triangle";
  recommendations: string[];
  idealSizes: {
    tops: string;
    bottoms: string;
    dresses: string;
  };
  confidence: number;
}

const Analysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"measurements" | "analysis">("measurements");
  const [measurements, setMeasurements] = useState<Measurements>({
    height: "",
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    shoulders: "",
  });
  const [analysis, setAnalysis] = useState<FitAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Check if measurements already exist
    const storedMeasurements = localStorage.getItem('bodyMeasurements');
    const storedAnalysis = localStorage.getItem('bodyAnalysis');
    
    if (storedMeasurements) {
      setMeasurements(JSON.parse(storedMeasurements));
    }
    
    if (storedAnalysis) {
      setAnalysis(JSON.parse(storedAnalysis));
      setStep("analysis");
    }
  }, []);

  const handleInputChange = (field: keyof Measurements, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = () => {
    // Validate that all fields are filled
    const hasEmptyFields = Object.values(measurements).some(value => !value.trim());
    
    if (hasEmptyFields) {
      toast({
        title: "Missing Information",
        description: "Please fill in all measurement fields",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI body analysis
    setTimeout(() => {
      const waist = parseFloat(measurements.waist);
      const hips = parseFloat(measurements.hips);
      const chest = parseFloat(measurements.chest);
      
      let bodyType: FitAnalysis["bodyType"] = "rectangle";
      
      // Simple body type detection logic
      if (chest > waist && hips > waist) {
        bodyType = "hourglass";
      } else if (hips > chest && hips > waist) {
        bodyType = "pear";
      } else if (chest > hips && waist >= chest * 0.8) {
        bodyType = "apple";
      } else if (hips > chest) {
        bodyType = "triangle";
      }

      const analysisResult: FitAnalysis = {
        bodyType,
        confidence: 92,
        idealSizes: {
          tops: chest > 95 ? "L" : chest > 85 ? "M" : "S",
          bottoms: hips > 100 ? "L" : hips > 90 ? "M" : "S",
          dresses: Math.max(chest, hips) > 100 ? "L" : Math.max(chest, hips) > 90 ? "M" : "S"
        },
        recommendations: getRecommendations(bodyType)
      };
      
      // Store analysis results
      localStorage.setItem('bodyMeasurements', JSON.stringify(measurements));
      localStorage.setItem('bodyAnalysis', JSON.stringify(analysisResult));
      
      setAnalysis(analysisResult);
      setIsAnalyzing(false);
      setStep("analysis");
      
      toast({
        title: "Analysis Complete!",
        description: `Your body type has been identified as ${bodyType}`,
      });
    }, 3000);
  };

  const getRecommendations = (bodyType: FitAnalysis["bodyType"]): string[] => {
    const recommendations = {
      hourglass: [
        "Emphasize your waist with fitted tops and high-waisted bottoms",
        "Wrap dresses and belted styles work perfectly for your shape",
        "Avoid boxy or oversized clothing that hides your natural curves",
        "Choose V-necks and scoop necks to highlight your proportions"
      ],
      pear: [
        "Balance your silhouette with statement sleeves or shoulder details",
        "Choose darker colors for bottoms and brighter colors for tops",
        "A-line dresses and skirts are ideal for your body type",
        "Boot-cut or straight-leg jeans work better than skinny styles"
      ],
      apple: [
        "Choose tops that flow away from your midsection",
        "Empire waists and tunic styles are very flattering",
        "Draw attention upward with statement necklaces or earrings",
        "Avoid tight-fitting clothes around your waist area"
      ],
      rectangle: [
        "Create curves with peplum tops and fit-and-flare dresses",
        "Layer clothing to add dimension to your silhouette",
        "Belts can help create the illusion of a defined waist",
        "Experiment with different textures and patterns"
      ],
      triangle: [
        "Focus on balancing your upper and lower body proportions",
        "Choose tops with embellishments or bright colors",
        "Straight-leg or bootcut pants work well for your shape",
        "V-necks and scoop necks help broaden your shoulder line"
      ]
    };
    
    return recommendations[bodyType];
  };

  const getBodyTypeColor = (bodyType: string) => {
    const colors = {
      hourglass: "bg-pink-500",
      pear: "bg-green-500", 
      apple: "bg-red-500",
      rectangle: "bg-blue-500",
      triangle: "bg-purple-500"
    };
    return colors[bodyType as keyof typeof colors] || "bg-gray-500";
  };

  const measurementFields = [
    { key: "height" as keyof Measurements, label: "Height", placeholder: "e.g., 170", unit: "cm" },
    { key: "weight" as keyof Measurements, label: "Weight", placeholder: "e.g., 65", unit: "kg" },
    { key: "chest" as keyof Measurements, label: "Chest/Bust", placeholder: "e.g., 90", unit: "cm" },
    { key: "waist" as keyof Measurements, label: "Waist", placeholder: "e.g., 75", unit: "cm" },
    { key: "hips" as keyof Measurements, label: "Hips", placeholder: "e.g., 95", unit: "cm" },
    { key: "shoulders" as keyof Measurements, label: "Shoulders", placeholder: "e.g., 40", unit: "cm" },
  ];

  if (isAnalyzing) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20 px-6">
          <div className="container mx-auto max-w-2xl text-center">
            <Card className="ai-card">
              <CardContent className="p-12">
                <div className="animate-pulse text-6xl mb-6">🤖</div>
                <h2 className="text-2xl font-bold mb-4">Analyzing Your Body Type...</h2>
                <p className="text-muted-foreground">
                  Our AI is processing your measurements to determine your body type and generate personalized recommendations
                </p>
                <div className="mt-6">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-ai-primary h-2 rounded-full animate-pulse" style={{width: "70%"}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (step === "measurements") {
    return (
      <div className="min-h-screen">
        <Navigation />
        
        <div className="pt-24 pb-20 px-6">
          <div className="container mx-auto max-w-2xl">
            <Card className="ai-card">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-card-foreground mb-2">
                  Body Analysis
                </CardTitle>
                <p className="text-muted-foreground">
                  Enter your body measurements for AI-powered body type analysis and personalized style recommendations
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {measurementFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key} className="text-sm font-medium">
                          {field.label} ({field.unit})
                        </Label>
                        <Input
                          id={field.key}
                          type="number"
                          placeholder={field.placeholder}
                          value={measurements[field.key]}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="flex-1"
                    >
                      Back to Home
                    </Button>
                    <Button
                      onClick={handleAnalyze}
                      variant="ai"
                      className="flex-1"
                    >
                      Analyze Body Type
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Your Body Analysis Results</h1>
            <p className="text-white/80">AI-powered insights and personalized recommendations</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Body Type Analysis */}
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-center">Body Type Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="text-6xl">👤</div>
                  <Badge 
                    className={`${getBodyTypeColor(analysis?.bodyType || '')} text-white text-lg px-4 py-2`}
                  >
                    {analysis?.bodyType.charAt(0).toUpperCase() + analysis?.bodyType.slice(1)} Shape
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Confidence: {analysis?.confidence}%
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  <h4 className="font-medium text-center">Your Measurements:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>Height: {measurements.height} cm</div>
                    <div>Weight: {measurements.weight} kg</div>
                    <div>Chest: {measurements.chest} cm</div>
                    <div>Waist: {measurements.waist} cm</div>
                    <div>Hips: {measurements.hips} cm</div>
                    <div>Shoulders: {measurements.shoulders} cm</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Ideal Sizes:</h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <div className="font-medium">Tops</div>
                      <Badge variant="outline">{analysis?.idealSizes.tops}</Badge>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Bottoms</div>
                      <Badge variant="outline">{analysis?.idealSizes.bottoms}</Badge>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Dresses</div>
                      <Badge variant="outline">{analysis?.idealSizes.dresses}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="ai-card">
              <CardHeader>
                <CardTitle>Style Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Personalized Tips:</h4>
                  <ul className="space-y-3">
                    {analysis?.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="mr-2 text-ai-primary">✨</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-4">
                  <Button 
                    variant="ai" 
                    className="w-full"
                    onClick={() => navigate("/try-on")}
                  >
                    Try Virtual Clothing
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep("measurements")}
                    >
                      Update Measurements
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/")}
                    >
                      Back to Home
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;