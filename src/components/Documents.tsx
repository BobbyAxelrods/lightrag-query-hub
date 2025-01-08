import { useState } from "react";
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

export function Documents() {
  const { toast } = useToast();
  
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocumentsAPI,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch documents",
      variant: "destructive",
    });
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">Uploaded Documents</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents?.data?.map((doc: any) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.id}</TableCell>
              <TableCell>{doc.status}</TableCell>
              <TableCell>{new Date(doc.created_at).toLocaleString()}</TableCell>
              <TableCell>{new Date(doc.updated_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}