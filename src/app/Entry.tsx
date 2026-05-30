import { motion } from "motion/react";
import { Sparkles, Layout, MousePointer2, FileUp, X, CheckCircle2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Entry() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([
    { name: "BRD_DIY_Health_Ver 0.11_16_march.docx", size: "5.4 MB", status: "Ready" },
    { name: "D.I.Y Health policy wording.docx", size: "587.9 KB", status: "Ready" },
    { name: "D.I.Y Health Proposal Form.docx", size: "113.8 KB", status: "Ready" }
  ]);

  const handleExtract = () => {
    setIsUploading(true);
    setTimeout(() => {
      navigate("/ai-preview");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8 md:p-12 lg:p-16">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <span>Eicore</span>
          <ChevronRight size={14} />
          <span>Products</span>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium">Product Config</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Choose how to build your product</h1>
        <p className="text-slate-500 mt-2">Pick a method to start configuring your insurance product.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl">
        {/* AI Method */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col ring-2 ring-primary ring-offset-4 ring-offset-slate-50 shadow-xl"
        >
          <div className="p-8 flex-1">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <Sparkles size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Generate via AI</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Upload your documents (BRD, policy wording, rate card) and the AI will auto-fill the configuration for your review.
            </p>

            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Files Added (3/25)</div>
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-medium text-slate-700 truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-400">{file.size} • {file.status}</span>
                  </div>
                  <button className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-4">
                <FileUp size={14} />
                Add more files
              </button>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <button 
              onClick={handleExtract}
              disabled={isUploading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
            >
              {isUploading ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Sparkles size={18} />
                  </motion.div>
                  Extracting...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Upload & Extract
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Template Method */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col grayscale opacity-60"
        >
          <div className="p-8 flex-1">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Layout size={24} />
            </div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-slate-900">Select from Template</h2>
              <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded uppercase">Coming Soon</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Start from a pre-built industry standard template and customize it for your specific needs.
            </p>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
            <button disabled className="w-full bg-slate-200 text-slate-500 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
              Select Template
            </button>
          </div>
        </motion.div>

        {/* Manual Method */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:border-indigo-200 transition-all hover:shadow-md cursor-pointer group"
          onClick={() => navigate("/builder")}
        >
          <div className="p-8 flex-1">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MousePointer2 size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Manual Configure</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Start with a blank canvas and build your product field-by-field with complete manual control.
            </p>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
            <button className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
              Configure Manually
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
