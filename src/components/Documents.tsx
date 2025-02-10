
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDocumentsAPI } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { FileJson } from "lucide-react";

export function Documents() {
  const { toast } = useToast();
  
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocumentsAPI,
    refetchInterval: 5000, // Refresh every 5 seconds to check for updates
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch documents from WORKING_DIR",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">JSON Files in WORKING_DIR</h2>
        <div className="text-sm text-gray-500">
          Auto-refreshing every 5 seconds
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Filename</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Content Preview</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.data?.map((doc: any, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <FileJson className="h-5 w-5 text-blue-500" />
                </TableCell>
                <TableCell className="font-medium">{doc.filename}</TableCell>
                <TableCell>{formatFileSize(doc.size)}</TableCell>
                <TableCell>{new Date(doc.lastModified).toLocaleString()}</TableCell>
                <TableCell className="max-w-md truncate">
                  {JSON.stringify(doc.content).slice(0, 100)}...
                </TableCell>
              </TableRow>
            ))}
            {(!documents?.data || documents.data.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No JSON files found in WORKING_DIR
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
