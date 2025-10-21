import { Instagram, Facebook, Twitter, Mail, Phone } from "lucide-react";
import { APP_TITLE } from "@/const";
import { SOCIAL_LINKS, CONTACT_INFO } from "@shared/const";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold gradient-text mb-4">{APP_TITLE}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Wearing Freedom 🇵🇸
            </p>
            <p className="text-sm text-muted-foreground">
              Premium Palestinian streetwear with meaningful designs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <a href="#products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Products
              </a>
              <a href="#custom" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Custom Design
              </a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex flex-col gap-3 mb-4">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                {CONTACT_INFO.email}
              </a>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                {CONTACT_INFO.phone}
              </a>
            </div>
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_TITLE}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Made with ❤️ for Palestine 🇵🇸
          </p>
        </div>
      </div>
    </footer>
  );
}

