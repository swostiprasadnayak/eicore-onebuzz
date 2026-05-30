import { motion } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight,
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { name: "Product Information", confidence: 92, status: "high" },
  { name: "Plans", confidence: 92, status: "high" },
  { name: "Coverage Details", confidence: 92, status: "high" },
  { name: "Member Eligibility", confidence: 93, status: "high" },
  { name: "Benefits & Covers", confidence: 89, status: "high" },
  { name: "Risk Factors", confidence: 91, status: "high" },
  { name: "Waiting Periods", confidence: 78, status: "medium" },
  { name: "Premium Raters", confidence: 64, status: "medium" },
];

const PLAN_EXTRACTION = [
  { field: "Mini", value: "Entry-level plan with sum insured of Rs.4L or Rs.5L. Floater available for Self+Spouse/LP+Children.", source: "BRD", confidence: 92 },
  { field: "Medi", value: "Mid-tier plan with sum insured from Rs.6L to Rs.10L. Floater available for Self+Spouse/LP+Children+2Parents.", source: "BRD", confidence: 92 },
  { field: "Max", value: "Top-tier plan with sum insured from Rs.11L to Rs.15L. Floater available for extended family.", source: "BRD", confidence: 92 },
];

export default function AIPreview() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>("Plans");

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-8 ml-4">
            <StepperStep number={1} label="Upload" completed />
            <StepperStep number={2} label="Generate" completed />
            <StepperStep number={3} label="Review & Confirm" active />
            <StepperStep number={4} label="Product Builder" />
          </div>
        </div>

        <button 
          onClick={() => navigate("/builder")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
        >
          Proceed to Product Builder
          <ArrowRight size={18} />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Document Viewer */}
        <div className="w-1/2 border-r bg-slate-100 flex flex-col">
          <div className="flex bg-white border-b overflow-x-auto shrink-0">
            <DocTab label="BRD_DIY_Health.docx" active />
            <DocTab label="Policy Wording.docx" />
            <DocTab label="Proposal Form.docx" />
            <DocTab label="DIY Rates.xlsx" />
          </div>
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="bg-white shadow-sm border rounded-lg min-h-[1000px] p-12 max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold mb-8">Business Requirement Document (BRD)</h1>
              <section className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">1. Product Overview</h2>
                  <p className="text-slate-600 leading-relaxed">
                    The D.I.Y Health Insurance product is designed to provide customizable coverage for individuals and families. 
                    It offers three primary tiers: Mini, Medi, and Max, catering to different sum insured requirements.
                  </p>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <h3 className="font-bold text-indigo-900 mb-2">2. Plan Tiers</h3>
                  <ul className="space-y-3 text-sm text-indigo-800">
                    <li><strong>Mini:</strong> Sum insured options of ₹4 Lakh and ₹5 Lakh. Covers Self, Spouse, and up to 3 children.</li>
                    <li><strong>Medi:</strong> Mid-tier coverage ranging from ₹6 Lakh to ₹10 Lakh. Includes Parents and Parents-in-law.</li>
                    <li><strong>Max:</strong> Premium coverage from ₹11 Lakh up to ₹15 Lakh. Includes extended family members.</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">3. Coverage Highlights</h2>
                  <p className="text-slate-600 leading-relaxed">
                    All plans include In-patient hospitalisation, Pre and Post hospitalisation, and Day care procedures. 
                    OPD Cover is available as a base benefit in Superior and Premiere tiers, and mental-illness only in Vital.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Right Panel: Extraction Results */}
        <div className="w-1/2 bg-white flex flex-col overflow-hidden">
          <div className="p-6 border-b shrink-0 bg-slate-50/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeDasharray="100, 100"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="89, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="text-[8px] font-bold text-center fill-emerald-600" textAnchor="middle">89%</text>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Extraction Confidence: Good</h3>
                  <p className="text-sm text-slate-500">130 of 145 fields extracted with high confidence</p>
                </div>
              </div>
              <div className="flex gap-2">
                <ConfidenceBadge count={6} type="high" />
                <ConfidenceBadge count={2} type="medium" />
                <ConfidenceBadge count={0} type="low" />
              </div>
            </div>

            <div className="space-y-2">
              <ExtractorNote label="Ambiguous values" count={2} icon={<AlertTriangle size={14} className="text-amber-500" />} />
              <ExtractorNote label="Multi-source variants" count={1} icon={<Info size={14} className="text-blue-500" />} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Extracted Sections</h4>
              <button className="text-xs font-medium text-indigo-600">Expand All</button>
            </div>
            
            {SECTIONS.map((section) => (
              <div key={section.name} className="border rounded-xl overflow-hidden bg-white shadow-sm hover:border-slate-300 transition-colors">
                <button 
                  onClick={() => setExpandedSection(expandedSection === section.name ? null : section.name)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {section.status === "high" ? <CheckCircle2 size={18} className="text-emerald-500" /> : <AlertTriangle size={18} className="text-amber-500" />}
                    <span className="font-semibold text-slate-800">{section.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded",
                      section.status === "high" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    )}>
                      {section.confidence}%
                    </span>
                    {expandedSection === section.name ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </div>
                </button>

                {expandedSection === section.name && (
                  <div className="p-4 bg-slate-50/50 border-t space-y-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-slate-400 text-[10px] uppercase font-bold text-left border-b pb-2">
                          <th className="pb-2 font-bold tracking-wider">Field</th>
                          <th className="pb-2 font-bold tracking-wider">Extracted Value</th>
                          <th className="pb-2 font-bold tracking-wider text-right">Conf</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {PLAN_EXTRACTION.map((row, i) => (
                          <tr key={i} className="group hover:bg-white transition-colors">
                            <td className="py-3 font-medium text-slate-700 align-top pr-4 w-20">{row.field}</td>
                            <td className="py-3 text-slate-600 leading-relaxed">
                              {row.value}
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                                  <FileText size={10} />
                                  From: {row.source}
                                </span>
                                <button className="text-[10px] text-indigo-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  View Source <ExternalLink size={10} />
                                </button>
                              </div>
                            </td>
                            <td className="py-3 text-right align-top">
                              <div className="flex items-center justify-end gap-1 font-bold text-emerald-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {row.confidence}%
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepperStep({ number, label, active, completed }: { number: number; label: string; active?: boolean; completed?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", active ? "text-indigo-600" : completed ? "text-emerald-600" : "text-slate-400")}>
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all",
        active ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" : 
        completed ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-200 bg-white"
      )}>
        {completed ? <CheckCircle2 size={12} /> : number}
      </div>
      <span className="text-xs font-semibold">{label}</span>
      {number < 4 && <div className="w-4 h-[1px] bg-slate-200 ml-2 shrink-0" />}
    </div>
  );
}

function DocTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <button className={cn(
      "px-6 py-3 text-xs font-semibold whitespace-nowrap border-r transition-all",
      active ? "bg-white text-indigo-600 border-b-2 border-b-indigo-600" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
    )}>
      {label}
    </button>
  );
}

function ConfidenceBadge({ count, type }: { count: number; type: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-emerald-50 text-emerald-700",
    medium: "bg-amber-50 text-amber-700",
    low: "bg-red-50 text-red-700",
  };
  const labels = {
    high: "High",
    medium: "Medium",
    low: "Needs Attention",
  };
  return (
    <div className={cn("px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2", styles[type])}>
      {type === "high" && <CheckCircle2 size={14} />}
      {type === "medium" && <AlertTriangle size={14} />}
      {type === "low" && <Clock size={14} />}
      {count} {labels[type]}
    </div>
  );
}

function ExtractorNote({ label, count, icon }: { label: string; count: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm hover:border-slate-300 transition-colors cursor-pointer group">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon}
        {label}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{count}</span>
        <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
      </div>
    </div>
  );
}
