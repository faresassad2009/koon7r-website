import { useState, useRef, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, ZoomIn, ZoomOut, RotateCw, RefreshCw, Move } from "lucide-react";
import { CUSTOM_PRICES } from "@shared/const";
import { toast } from "sonner";

interface CustomDesignSectionProps {
  onAddToCart: (item: { id: number; name: string; price: number; size?: string; image: string }) => void;
}

export default function CustomDesignSection({ onAddToCart }: CustomDesignSectionProps) {
  const [view, setView] = useState<"front" | "back">("front");
  const [frontDesign, setFrontDesign] = useState<string | null>(null);
  const [backDesign, setBackDesign] = useState<string | null>(null);
  const [designType, setDesignType] = useState<"embroidery" | "printing">("embroidery");
  const [productType, setProductType] = useState<"tshirt" | "hoodie" | "sweater">("tshirt");
  const [size, setSize] = useState("M");
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 25 });
  const [isDragging, setIsDragging] = useState(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const designContainerRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (file: File, side: "front" | "back") => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large! Max 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (side === "front") {
        setFrontDesign(result);
      } else {
        setBackDesign(result);
      }
      toast.success(`${side === "front" ? "Front" : "Back"} design uploaded!`);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, side: "front" | "back") => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file, side);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDesignDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    const container = designContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = position.x;
    const startPosY = position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = ((moveEvent.clientX - startX) / rect.width) * 100;
      const deltaY = ((moveEvent.clientY - startY) / rect.height) * 100;
      
      setPosition({
        x: Math.max(0, Math.min(100, startPosX + deltaX)),
        y: Math.max(0, Math.min(100, startPosY + deltaY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const calculatePrice = () => {
    const basePrice = CUSTOM_PRICES.base[productType];
    const frontPrice = frontDesign ? CUSTOM_PRICES.design[designType] : 0;
    const backPrice = backDesign ? CUSTOM_PRICES.design[designType] : 0;
    return basePrice + frontPrice + backPrice;
  };

  const captureDesignImage = async (): Promise<string> => {
    const container = designContainerRef.current;
    if (!container) return "";

    try {
      // Create a canvas to combine the t-shirt and design
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      // Set canvas size
      const width = 800;
      const height = 800;
      canvas.width = width;
      canvas.height = height;

      // Load and draw the t-shirt background
      const tshirtImg = new Image();
      tshirtImg.crossOrigin = "anonymous";
      const tshirtSrc = view === "front" ? "/assets/front.png" : "/assets/back.png";
      
      await new Promise((resolve, reject) => {
        tshirtImg.onload = resolve;
        tshirtImg.onerror = reject;
        tshirtImg.src = tshirtSrc;
      });

      ctx.drawImage(tshirtImg, 0, 0, width, height);

      // Draw the custom design on top
      const currentDesignSrc = view === "front" ? frontDesign : backDesign;
      if (currentDesignSrc) {
        const designImg = new Image();
        designImg.crossOrigin = "anonymous";
        
        await new Promise((resolve, reject) => {
          designImg.onload = resolve;
          designImg.onerror = reject;
          designImg.src = currentDesignSrc;
        });

        // Calculate design position and size
        const designWidth = width / 2;
        const designHeight = height / 3;
        const x = (position.x / 100) * width;
        const y = (position.y / 100) * height;

        // Apply transformations
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.drawImage(designImg, -designWidth / 2, -designHeight / 2, designWidth, designHeight);
        ctx.restore();
      }

      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Failed to capture design:", error);
      return frontDesign || backDesign || "";
    }
  };

  const handleAddToCart = async () => {
    if (!frontDesign && !backDesign) {
      toast.error("Please add at least one design!");
      return;
    }

    // Capture the final design image
    const finalImage = await captureDesignImage();

    const totalPrice = calculatePrice();
    onAddToCart({
      id: Date.now(),
      name: `Custom ${productType.toUpperCase()}`,
      price: totalPrice,
      size,
      image: finalImage,
    });

    toast.success("Custom design added to cart!");
  };

  const currentDesign = view === "front" ? frontDesign : backDesign;

  return (
    <section id="custom" className="py-20 bg-card">
      <div className="container">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Custom Design Studio</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create your unique design. Upload your artwork and customize every detail.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* T-Shirt Preview */}
                <div
                  ref={designContainerRef}
                  className="relative aspect-square bg-muted rounded-lg overflow-hidden"
                >
                  <img
                    src={view === "front" ? "/assets/front.png" : "/assets/back.png"}
                    alt={`T-Shirt ${view}`}
                    className="w-full h-full object-contain"
                  />
                  {currentDesign && (
                    <div
                      className={`absolute w-1/2 h-1/3 flex items-center justify-center ${
                        isDragging ? "cursor-grabbing" : "cursor-grab"
                      }`}
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                      }}
                      onMouseDown={handleDesignDragStart}
                    >
                      <img
                        src={currentDesign}
                        alt="Design"
                        className="max-w-full max-h-full object-contain pointer-events-none"
                        draggable={false}
                      />
                    </div>
                  )}
                </div>

                {/* View Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={view === "front" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setView("front")}
                  >
                    Front
                  </Button>
                  <Button
                    variant={view === "back" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setView("back")}
                  >
                    Back
                  </Button>
                </div>

                {/* Design Controls */}
                {currentDesign && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Move className="h-4 w-4" />
                      Drag the design to reposition
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setScale((s) => Math.min(s + 0.1, 2))}
                        title="Zoom In"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setScale((s) => Math.max(s - 0.1, 0.5))}
                        title="Zoom Out"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setRotation((r) => (r + 15) % 360)}
                        title="Rotate"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setScale(1);
                          setRotation(0);
                          setPosition({ x: 50, y: 25 });
                        }}
                        title="Reset"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Upload Front */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Front Design</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => frontInputRef.current?.click()}
                  onDrop={(e) => handleDrop(e, "front")}
                  onDragOver={handleDragOver}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {frontDesign ? "Design uploaded ✓" : "Click or drag & drop front design"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG, SVG - Max 5MB
                  </p>
                  <input
                    ref={frontInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "front");
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upload Back */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Back Design</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => backInputRef.current?.click()}
                  onDrop={(e) => handleDrop(e, "back")}
                  onDragOver={handleDragOver}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {backDesign ? "Design uploaded ✓" : "Click or drag & drop back design"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG, SVG - Max 5MB
                  </p>
                  <input
                    ref={backInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "back");
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Design Type */}
            <Card>
              <CardHeader>
                <CardTitle>Design Type</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={designType} onValueChange={(v) => setDesignType(v as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="embroidery" id="embroidery" />
                    <Label htmlFor="embroidery">Embroidery (+${CUSTOM_PRICES.design.embroidery})</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="printing" id="printing" />
                    <Label htmlFor="printing">Printing (+${CUSTOM_PRICES.design.printing})</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Product Type & Size */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Product Type</Label>
                  <Select value={productType} onValueChange={(v) => setProductType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tshirt">T-Shirt - ${CUSTOM_PRICES.base.tshirt}</SelectItem>
                      <SelectItem value="hoodie">Hoodie - ${CUSTOM_PRICES.base.hoodie}</SelectItem>
                      <SelectItem value="sweater">Sweater - ${CUSTOM_PRICES.base.sweater}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Size</Label>
                  <div className="flex gap-2 mt-2">
                    {["S", "M", "L", "XL", "XXL"].map((s) => (
                      <Button
                        key={s}
                        variant={size === s ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSize(s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Price:</span>
                    <span>${CUSTOM_PRICES.base[productType]}</span>
                  </div>
                  {frontDesign && (
                    <div className="flex justify-between text-sm">
                      <span>Front Design:</span>
                      <span>+${CUSTOM_PRICES.design[designType]}</span>
                    </div>
                  )}
                  {backDesign && (
                    <div className="flex justify-between text-sm">
                      <span>Back Design:</span>
                      <span>+${CUSTOM_PRICES.design[designType]}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-primary">${calculatePrice()}</span>
                  </div>
                </div>

                <Button className="w-full mt-4" size="lg" onClick={handleAddToCart}>
                  Add to Cart - ${calculatePrice()}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

