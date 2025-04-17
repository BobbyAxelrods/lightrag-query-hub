
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { healthCheckAPI } from "@/lib/api";
import { Activity, AlertCircle, Server, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function HealthCheck() {
  const [status, setStatus] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const checkHealth = async () => {
    setIsChecking(true);
    setError(null);
    try {
      console.log("Checking health at:", `${API_URL}/health`);
      const response = await healthCheckAPI();
      setStatus(response.status);
      setLastChecked(new Date());
    } catch (err: any) {
      setStatus("unhealthy");
      const errorMessage = err.response?.data?.message || 
                           err.response?.statusText || 
                           err.message || 
                           "Connection failed";
      setError(errorMessage);
      setLastChecked(new Date());
      console.error("Health check failed:", {
        error: err,
        message: errorMessage,
        url: API_URL
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Initial health check on component mount
  useEffect(() => {
    checkHealth();
    // No interval setting for auto refresh
  }, []);

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={checkHealth}
              disabled={isChecking}
              className={`flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm ${
                status === "healthy"
                  ? "text-[#4A4036] border-[#E38C40]/30 bg-[#F9B054]/10"
                  : status === "unhealthy"
                  ? "text-red-600 border-red-400/30 bg-red-400/10"
                  : "bg-white/80 text-[#4A4036] border-[#E38C40]/20"
              }`}
            >
              {isChecking ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : status === "unhealthy" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Activity className="h-4 w-4" />
              )}
              <span>
                {isChecking
                  ? "Checking..."
                  : status
                  ? `API ${status}`
                  : "Check Health"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-sm p-4">
            {error ? (
              <div>
                <div className="flex items-center gap-2 mb-2 font-medium text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Connection Error</span>
                </div>
                <p className="mb-2">{error}</p>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <p className="text-xs mb-1">API URL: {API_URL}</p>
                  <p className="text-xs mb-1">Last checked: {lastChecked?.toLocaleTimeString()}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                    <Server className="h-3 w-3" />
                    <p>Please check if your backend server is running</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-2">
                  {status === "healthy" 
                    ? "✅ Connection to API server is healthy" 
                    : "Checking connection to API server..."}
                </p>
                <div className="text-xs text-gray-600">
                  <p>API URL: {API_URL}</p>
                  <p>Last checked: {lastChecked?.toLocaleTimeString() || "Not checked yet"}</p>
                </div>
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
