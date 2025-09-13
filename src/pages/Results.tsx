import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { Download, Share2, RotateCcw, ArrowLeft, Sparkles } from "lucide-react";

interface AnalysisData {
  bodyType: string;
  confidence: number;
  idealSizes: {
    tops: string;
    bottoms: string;
    dresses: string;
  };
  recommendations: string[];
}

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);

  useEffect(() => {
    // Load data from localStorage
    const storedResult = localStorage.getItem('tryOnResult');
    const storedAnalysis = localStorage.getItem('bodyAnalysis');
    const storedModel = localStorage.getItem('modelImage');
    const storedGarment = localStorage.getItem('garmentImage');

    if (storedResult) setTryOnResult(storedResult);
    if (storedAnalysis) setAnalysisData(JSON.parse(storedAnalysis));
    if (storedModel) setModelImage(storedModel);
    if (storedGarment) setGarmentImage(storedGarment);

    // If no result exists, redirect to try-on page
    if (!storedResult) {
      navigate('/try-on');
    }
  }, [navigate]);

  const handleDownload = () => {
    if (tryOnResult) {
      const link = document.createElement('a');
      link.href = tryOnResult;
      link.download = 'fitverse-tryon-result.png';
      link.click();
      
      toast({
        title: "Download started",
        description: "Your AI try-on result is being downloaded"
      });
    }
  };

  const handleShare = async () => {
    if (tryOnResult) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Share link has been copied to clipboard"
        });
      } catch (error) {
        toast({
          title: "Share failed",
          description: "Could not copy link to clipboard",
          variant: "destructive"
        });
      }
    }
  };

  const handleNewTryOn = () => {
    // Clear previous results
    localStorage.removeItem('tryOnResult');
    localStorage.removeItem('modelImage');
    localStorage.removeItem('garmentImage');
    navigate('/try-on');
  };

  const getBodyTypeColor = (bodyType: string) => {
    const colors = {
      hourglass: "bg-pink-500",
      pear: "bg-green-500", 
      apple: "bg-red-500",
      rectangle: "bg-blue-500",
      triangle: "bg-purple-500"
    };
    return colors[bodyType as keyof typeof colors] || "bg-gradient-to-r from-ai-primary to-ai-secondary";
  };

  const getFitAnalysis = (bodyType: string) => {
    const fitAnalysis = {
      hourglass: "Excellent fit! This garment complements your balanced proportions.",
      pear: "Good fit! The garment balances your lower body proportions nicely.",
      apple: "Great choice! This style flatters your upper body shape.",
      rectangle: "Perfect fit! This garment adds definition to your silhouette.",
      triangle: "Ideal fit! This garment enhances your shoulder line beautifully."
    };
    return fitAnalysis[bodyType as keyof typeof fitAnalysis] || "This garment fits well with your body type.";
  };

  if (!tryOnResult) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20 px-6">
          <div className="container mx-auto max-w-2xl text-center">
            <Card className="ai-card">
              <CardContent className="p-12">
                <div className="text-6xl mb-6">📭</div>
                <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't generated any try-on results yet. Start by analyzing your body type and then try on some clothes!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="ai" onClick={() => navigate('/analysis')}>
                    Start Body Analysis
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/try-on')}>
                    Virtual Try-On
                  </Button>
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
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 animate-glow">
              Your AI Try-On Results
            </h1>
            <p className="text-white/80 text-lg">
              Virtual fitting complete with personalized fit analysis
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Original Images */}
            <div className="space-y-6">
              {modelImage && (
                <Card className="ai-card">
                  <CardHeader>
                    <CardTitle className="text-center text-lg">Original Photo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={modelImage}
                      alt="Original model photo"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </CardContent>
                </Card>
              )}

              {garmentImage && (
                <Card className="ai-card">
                  <CardHeader>
                    <CardTitle className="text-center text-lg">Selected Garment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={garmentImage}
                      alt="Selected garment"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* AI Result */}
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-ai-primary" />
                  AI Try-On Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <img
                    src={tryOnResult}
                    alt="AI try-on result with garment overlay"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <Badge className="absolute top-2 left-2 bg-gradient-to-r from-ai-primary to-ai-secondary text-white">
                    AI Generated
                  </Badge>
                  {analysisData && (
                    <Badge className="absolute top-2 right-2 bg-card/80 text-xs">
                      {analysisData.bodyType?.charAt(0).toUpperCase() + analysisData.bodyType?.slice(1)} Shape
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-xs">Download</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs">Share</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNewTryOn}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="text-xs">New Try-On</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analysis & Recommendations */}
            <Card className="ai-card">
              <CardHeader>
                <CardTitle>Fit Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {analysisData ? (
                  <>
                    <div className="text-center space-y-4">
                      <div className="text-4xl">📏</div>
                      <Badge 
                        className={`${getBodyTypeColor(analysisData.bodyType)} text-white text-sm px-3 py-1`}
                      >
                        {analysisData.bodyType?.charAt(0).toUpperCase() + analysisData.bodyType?.slice(1)} Shape
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Confidence: {analysisData.confidence}%
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Fit Assessment:</h4>
                      <p className="text-sm text-muted-foreground p-3 bg-card/30 rounded-lg border border-border/50">
                        {getFitAnalysis(analysisData.bodyType)}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Recommended Sizes:</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <div className="font-medium">Tops</div>
                          <Badge variant="outline">{analysisData.idealSizes.tops}</Badge>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">Bottoms</div>
                          <Badge variant="outline">{analysisData.idealSizes.bottoms}</Badge>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">Dresses</div>
                          <Badge variant="outline">{analysisData.idealSizes.dresses}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Style Tips:</h4>
                      <ul className="space-y-2">
                        {analysisData.recommendations.slice(0, 2).map((rec, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start">
                            <span className="mr-2 text-ai-primary">✨</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-4xl">📊</div>
                    <p className="text-sm text-muted-foreground">
                      Complete your body analysis to get personalized fit recommendations
                    </p>
                    <Button 
                      variant="ai" 
                      onClick={() => navigate('/analysis')}
                      className="w-full"
                    >
                      Start Body Analysis
                    </Button>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-4">
                  <Button 
                    variant="ai" 
                    onClick={() => navigate('/try-on')}
                    className="w-full"
                  >
                    Try More Clothes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    className="w-full flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;