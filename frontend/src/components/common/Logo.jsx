import { Link } from "react-router-dom";
import logoImage from "../../assets/images.jpeg";

export default function Logo({ variant = "default", className = "" }) {
  const isCompact = variant === "compact";

  return (
    <Link
      to="/"
      className={`flex items-center gap-2.5 group ${className}`}
      aria-label="SL-LMS Home"
    >
      {/* Logo Image */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-gold-500/20 group-hover:shadow-gold-500/35 transition-shadow duration-300 ring-1 ring-white/10">
        <img
          src={logoImage}
          alt="SL-LMS Logo"
          className="w-full h-full object-cover mix-blend-lighten"
          width={40}
          height={40}
          loading="eager"
          draggable={false}
        />
      </div>

      {/* Text */}
      {!isCompact && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-tight text-neutral-50">
            SL-LMS
          </span>
          <span className="text-[10px] tracking-widest uppercase text-neutral-500">
            Legal Platform
          </span>
        </div>
      )}
    </Link>
  );
}
