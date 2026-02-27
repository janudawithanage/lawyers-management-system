import {
  Scale,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowUp,
} from "lucide-react";
import { FOOTER_LINKS } from "../../constants";
import { Container } from "../ui";

function FooterLinkSection({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-neutral-100 uppercase tracking-wider mb-4">
        {title}
      </h3>
      <ul className="space-y-3" role="list">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-neutral-500 hover:text-gold-400 transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      className="bg-dark-950 pt-16 pb-8 border-t border-white/4"
      role="contentinfo"
    >
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-white/6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <a href="#home" className="flex items-center gap-2.5 mb-4" aria-label="SL-LMS Home">
              <div className="w-10 h-10 rounded-xl gradient-gold-btn flex items-center justify-center">
                <Scale className="w-5 h-5 text-dark-950" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-lg font-bold text-neutral-50">SL-LMS</div>
                <div className="text-[10px] text-neutral-600 uppercase tracking-widest">Legal Platform</div>
              </div>
            </a>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-xs">
              Sri Lanka&apos;s premier platform connecting verified lawyers with
              clients. Built with trust, security, and accessibility in mind.
            </p>

            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Instagram, label: "Instagram" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/4 border border-white/6 flex items-center justify-center text-neutral-500 hover:bg-gold-500/10 hover:text-gold-400 hover:border-gold-500/20 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterLinkSection title="Platform" links={FOOTER_LINKS.platform} />
          <FooterLinkSection title="Legal" links={FOOTER_LINKS.legal} />
          <FooterLinkSection title="Resources" links={FOOTER_LINKS.resources} />

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-100 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3" role="list">
              <li>
                <a
                  href="mailto:info@sl-lms.lk"
                  className="flex items-center gap-2 text-sm text-neutral-500 hover:text-gold-400 transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  info@sl-lms.lk
                </a>
              </li>
              <li>
                <a
                  href="tel:+94112345678"
                  className="flex items-center gap-2 text-sm text-neutral-500 hover:text-gold-400 transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  +94 11 234 5678
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2 text-sm text-neutral-500">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  Colombo 07, Sri Lanka
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} SL-LMS. All rights reserved. Made with ❤️ in Sri Lanka.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-neutral-600 hover:text-gold-400 transition-colors cursor-pointer group"
            aria-label="Scroll to top"
          >
            Back to top
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </Container>
    </footer>
  );
}
