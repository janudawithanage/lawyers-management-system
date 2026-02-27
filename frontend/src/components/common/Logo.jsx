import { Scale } from "lucide-react";

export default function Logo() {
  return (
    <a href="#home" className="flex items-center gap-2.5 group" aria-label="SL-LMS Home">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl gradient-gold-btn shadow-lg shadow-gold-500/20 group-hover:shadow-gold-500/35 transition-shadow duration-300">
        <Scale className="w-5 h-5 text-dark-950" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-neutral-50">
          SL-LMS
        </span>
        <span className="text-[10px] tracking-widest uppercase text-neutral-500">
          Legal Platform
        </span>
      </div>
    </a>
  );
}
