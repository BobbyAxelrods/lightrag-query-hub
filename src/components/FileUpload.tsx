
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadFileAPI } from "@/lib/api";
import { Upload } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function FileUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<"initial" | "incremental">("initial");
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".txt") && !file.name.endsWith(".csv")) {
      toast({
        title: "Error",
        description: "Only .txt and .csv files are supported",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 500);

      // Pass the upload type to the API
      const response = await uploadFileAPI(file, uploadType);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast({
        title: "Success",
        description: response.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 space-y-6 bg-white rounded-xl shadow-xl backdrop-blur-sm bg-white/50 animate-fade-in">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full flex justify-center mb-4">
          <ToggleGroup
            type="single"
            value={uploadType}
            onValueChange={(value) => value && setUploadType(value as "initial" | "incremental")}
            className="border rounded-lg p-1"
          >
            <ToggleGroupItem
              value="initial"
              aria-label="Initial Index"
              className="data-[state=on]:bg-primary data-[state=on]:text-white px-4 py-2 rounded-md"
            >
              Initial Index
            </ToggleGroupItem>
            <ToggleGroupItem
              value="incremental"
              aria-label="Incremental Update"
              className="data-[state=on]:bg-primary data-[state=on]:text-white px-4 py-2 rounded-md"
            >
              Incremental Update
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Button
          variant="outline"
          className="w-full h-32 border-dashed border-2 hover:border-primary/50 hover:bg-gray-50/50 transition-all duration-200 shadow-sm hover:shadow-md"
          disabled={isUploading}
        >
          <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
            <Upload className="h-8 w-8 mb-2 text-primary" />
            <span className="text-sm text-gray-600">
              {isUploading ? "Uploading..." : "Click to upload .txt or .csv"}
            </span>
            <input
              type="file"
              className="hidden"
              accept=".txt,.csv"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </Button>
      </div>

      {progress > 0 && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center text-gray-600">{progress}%</p>
        </div>
      )}
    </div>
  );
}
