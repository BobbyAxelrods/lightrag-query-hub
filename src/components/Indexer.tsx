
import { useState } from "react";
import { uploadFileAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Documents } from "@/components/Documents";

export function Indexer() {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    // Convert FileList to array and validate file types
    const filesArray = Array.from(fileList);
    const invalidFiles = filesArray.filter(
      file => !file.name.endsWith(".txt") && !file.name.endsWith(".csv")
    );
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Error",
        description: "Only .txt and .csv files are supported",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFiles(filesArray);
    
    // Auto-upload the selected files
    await uploadFiles(filesArray);
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 500);

      const response = await uploadFileAPI(files, "initial");
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast({
        title: "Success",
        description: `${files.length > 1 ? `${files.length} files` : "File"} uploaded successfully`,
      });
      setSelectedFiles([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="p-6 bg-white rounded-xl shadow-xl">
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Documents</h3>
          <p className="text-sm text-gray-600">Upload your .txt or .csv files to index them</p>
        </div>
        
        <div className="relative">
          <Button
            variant="outline"
            className="w-full h-32 border-dashed border-2 hover:border-primary/50 hover:bg-gray-50/50 transition-all duration-200"
            disabled={isUploading}
          >
            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 mb-2 text-primary" />
              <span className="text-sm text-gray-600">
                {isUploading ? "Uploading..." : "Click to upload multiple .txt or .csv files"}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".txt,.csv"
                onChange={handleFileChange}
                disabled={isUploading}
                multiple
              />
            </label>
          </Button>

          {selectedFiles.length > 0 && !isUploading && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2">{selectedFiles.length} file(s) selected:</p>
              <ul className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="truncate">
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {progress > 0 && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-gray-600">{progress}%</p>
            </div>
          )}
        </div>
      </div>

      <Documents />
    </div>
  );
}
