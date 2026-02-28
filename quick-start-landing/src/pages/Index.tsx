import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, ArrowRight, Info, Clock, Lock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const Navbar = () => (
  <nav className="flex items-center justify-between px-6 py-4">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full border-2 border-accent flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-accent" />
      </div>
      <span className="text-lg font-bold">
        <span className="text-accent">Dr</span>
        <span className="text-foreground">opp</span>
      </span>
    </div>
    <div className="flex items-center gap-2">
      <button className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
        Home
      </button>
      <button className="px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground text-sm transition-colors">
        About Us
      </button>
      <button className="px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground text-sm transition-colors">
        Terms & Conditions
      </button>
    </div>
  </nav>
);

const timeOptions = ["1 hr", "3 hrs", "5 hrs", "10 hrs", "24 hrs", "48 hrs", "2 days", "4 days", "7 days"];

const Index = () => {
  const navigate = useNavigate();
  const [domainName, setDomainName] = useState("");
  const [selectedTime, setSelectedTime] = useState("48 hrs");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);


  const handleCopy = () => {
    navigator.clipboard.writeText(`dropp.in/${domainName}`);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !domainName) return;
  
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('custom_slug', domainName);
    formData.append('hours', "1"); // or hook this to a state if they have a timer dropdown
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/upload', formData);
      alert("Uploaded! Link: " + response.data.share_url);
    } catch (error) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="flex flex-col items-center justify-center px-4 pt-24 pb-16">
        {/* Hero heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
          <span className="text-accent">Write, Upload, Save</span>
          <span className="text-foreground"> & </span>
          <span className="text-primary">Share</span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-6">
          No Login Required!
        </h2>

        {/* Subtitle */}
        <p className="text-muted-foreground text-center mb-10 text-sm md:text-base">
          "Upload <span className="text-accent">Files, Texts, Codes</span> once, access on any device using domain name"
        </p>

        {/* Domain input */}
        <div className="flex items-center bg-secondary rounded-lg overflow-hidden mb-8 w-full max-w-lg border border-border">
          <span className="px-4 py-3 text-muted-foreground text-sm bg-secondary border-r border-border whitespace-nowrap">
            dropp.in/
          </span>
          <input
            type="text"
            placeholder="Enter domain name"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
            className="flex-1 bg-card px-4 py-3 text-foreground text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy size={18} />
          </button>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-4 mb-3">
          
          <button className="text-primary hover:text-primary/80 transition-colors">
            <Info size={18} />
          </button>

          {/* Set Time */}
          <div className="relative">
            <button
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="px-8 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Clock size={16} />
              Set Time
            </button>
            {showTimeDropdown && (
              <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                {timeOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTime(t);
                      setShowTimeDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                      selectedTime === t ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Set Password */}
          <div className="relative">
            <button
              onClick={() => setShowPasswordInput(!showPasswordInput)}
              className="px-8 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Lock size={16} />
              Set Password
            </button>
            {showPasswordInput && (
              <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-lg shadow-lg z-10 p-3 min-w-[200px]">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>

          <button className="text-primary hover:text-primary/80 transition-colors">
            <Info size={18} />
          </button>
        </div>

        {/* Default time label */}
        <p className="text-muted-foreground text-sm mb-8">
          Default Time: {selectedTime}
        </p>

        {/* Submit button */}
        <button
          onClick={() => {
            if (domainName.trim()) {
              navigate(`/${domainName.trim()}`);
            } else {
              toast.error("Please enter a domain name first");
            }
          }}
          className="px-16 py-3 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center gap-3 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
        >
          SUBMIT
          <ArrowRight size={20} />
        </button>
      </main>
    </div>
  );
};

export default Index;
