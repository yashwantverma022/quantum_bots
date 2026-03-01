import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Copy, Upload, Save, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download, FileIcon, ShieldCheck } from "lucide-react";
import { getApiBaseUrl } from "@/lib/api";

const Editor = () => {
  const { domain } = useParams(); // This gets the 'slug' from the URL

  const handleDownload = () => {
    // This sends the user directly to the FastAPI download route
    // It will trigger a browser download for the file stored on your SSD
    window.location.href = `${getApiBaseUrl()}/download/${domain}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileIcon className="text-primary" size={40} />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">File Ready to Download</h1>
        <p className="text-muted-foreground mb-8">
          Slug: <span className="text-accent font-mono">{domain}</span>
        </p>

        <Button 
          onClick={handleDownload}
          className="w-full py-6 rounded-full text-lg font-bold flex items-center justify-center gap-3"
        >
          <Download size={22} />
          DOWNLOAD NOW
        </Button>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} />
          <span>Self-destruct active. Secure AMD-powered storage.</span>
        </div>
      </div>
    </div>
  );
};

export default Editor;