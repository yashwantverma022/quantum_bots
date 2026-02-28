import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Copy, Upload, Save, Lock } from "lucide-react";

const Editor = () => {
  const { domain } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <nav className="px-6 py-4">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-1.5 rounded-full bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors border border-border"
        >
          Home
        </button>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex gap-4 px-6 pb-4">
        {/* Text area panel */}
        <div className="flex-1 relative rounded-lg border border-accent/40 bg-card overflow-hidden flex flex-col">
          {/* Banner */}
          <div className="text-center py-2 text-sm text-muted-foreground border-b border-accent/30">
            Share anything instantly with{" "}
            <span className="text-accent font-medium">dropp.in/{domain}</span>
          </div>

          {/* Textarea + copy */}
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text and hit save button"
              className="w-full h-full resize-none bg-transparent p-4 text-foreground text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Copy text"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-56 rounded-lg border border-primary/40 bg-card flex flex-col items-center p-4 gap-6">
          <div className="text-sm text-muted-foreground">
            Follow us on{" "}
            <span className="text-accent">@dropp</span>
          </div>

          <div className="flex-1" />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              // Handle file upload logic here
              console.log(e.target.files);
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors w-full justify-center"
          >
            <Upload size={16} />
            Upload File
          </button>

          <div className="flex-1" />
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="flex items-center justify-center gap-4 px-6 py-4">
        <button className="px-10 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors min-w-[120px]">
          Save
        </button>
        <button className="px-10 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors min-w-[120px] flex items-center gap-2 justify-center">
          <Lock size={16} />
          Lock
        </button>
      </div>
    </div>
  );
};

export default Editor;
