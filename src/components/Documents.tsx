
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

export function Documents() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await getDocumentsAPI();
        
        if (response && response.status === "success" && response.data) {
          setDocuments(response.data);
          console.log("Documents loaded:", response.data);
        } else {
          setDocuments([]);
          console.warn("No documents found or empty response");
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

    fetchDocuments();
    
    // Refresh the documents every 10 seconds
    const intervalId = setInterval(fetchDocuments, 10000);
    
    return () => clearInterval(intervalId);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (error && documents.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Uploaded Documents</h2>
        <div className="p-8 text-gray-600">
          <p>Could not retrieve documents. Please check your server connection.</p>
          <p className="mt-2 text-sm text-gray-500">Make sure your backend is running at http://localhost:8000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">Uploaded Documents</h2>
      
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
