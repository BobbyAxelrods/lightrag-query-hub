
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getDocumentsAPI, Document } from "@/lib/api";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

export function Documents() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await getDocumentsAPI();
      
      if (response && response.status === "success" && response.data) {
        setDocuments(response.data);
        setError(null);
        setLastRefreshed(new Date());
        console.log("Documents loaded:", response.data);
      } else {
        setDocuments([]);
        setError(new Error(response?.message || "No documents found or empty response"));
        console.warn("No documents found or empty response:", response);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to fetch documents. Please check server connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    
    // Refresh the documents every 15 seconds
    const intervalId = setInterval(fetchDocuments, 15000);
    
    return () => clearInterval(intervalId);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Uploaded Documents</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchDocuments} 
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>
      
      {lastRefreshed && (
        <div className="text-sm text-gray-500">
          Last refreshed: {lastRefreshed.toLocaleTimeString()}
        </div>
      )}
      
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          <p>Could not retrieve documents. Please check your server connection.</p>
          <p className="mt-2 text-xs">Make sure your backend is running at http://localhost:8000</p>
          <p className="mt-2 text-xs">Error details: {error.message}</p>
        </div>
      )}
      
      {documents.length === 0 ? (
        <div className="text-center p-8 text-gray-600">
          <p>No documents found</p>
          <p className="mt-2 text-sm text-gray-500">Upload documents to view them here</p>
        </div>
      ) : (
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
              {documents.map((doc) => (
                <TableRow key={doc.doc_id || doc.id}>
                  <TableCell className="font-medium">{doc.doc_id || doc.id}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={doc.status === "processed" ? "secondary" : "destructive"}
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc.created_at ? new Date(doc.created_at).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell>{doc.updated_at ? new Date(doc.updated_at).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {doc.content_summary || 'No summary available'}
                  </TableCell>
                  <TableCell>{doc.chunks_count || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
