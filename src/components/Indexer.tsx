
import { useEffect, useState } from "react"; // Added useState to imports
import { useQuery } from "@tanstack/react-query";
import { getDocumentsAPI, uploadFileAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function Indexer() {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const { data: documents, isLoading, error, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocumentsAPI,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 500);

      const response = await uploadFileAPI(file, "initial");
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast({
        title: "Success",
        description: response.message,
      });
      
      // Refresh the documents list
      refetch();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  const documentsArray = Object.entries(documents?.data || {}).map(([id, doc]: [string, any]) => ({
    id,
    ...doc,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="p-6 bg-white rounded-xl shadow-xl">
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

        {progress > 0 && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-gray-600">{progress}%</p>
          </div>
        )}
      </div>

      <div className="p-6 bg-white rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Indexed Documents</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Content Summary</TableHead>
                <TableHead>Chunks Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentsArray.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.id}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={doc.status === "processed" ? "secondary" : "destructive"}
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(doc.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(doc.updated_at).toLocaleString()}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {doc.content_summary}
                  </TableCell>
                  <TableCell>{doc.chunks_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
