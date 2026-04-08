import { Globe } from "lucide-react";

const links = [
  "FAQ",
  "Help Center",
  "Account",
  "Media Center",
  "Investor Relations",
  "Jobs",
  "Ways to Watch",
  "Devices",
  "Privacy",
  "Cookie Preferences",
  "Terms of Use",
  "Do Not Sell or Share My Personal Information",
  "Speed Test",
  "Corporate Information",
  "Contact Us",
];

const Footer = () => (
  <footer className="bg-background/80 border-t-8 border-[hsl(0,0%,13%)] py-10 md:py-14">
    <div className="max-w-[1000px] mx-auto px-4 md:px-8">
      <p className="text-muted-foreground mb-6 text-sm">
        Questions? Call 1-844-505-2993
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="text-muted-foreground hover:text-foreground text-xs md:text-sm underline transition-colors"
          >
            {link}
          </a>
        ))}
      </div>

      <button className="flex items-center gap-1 border border-muted-foreground/40 rounded px-3 py-1 text-muted-foreground text-sm mb-6 hover:border-muted-foreground transition-colors">
        <Globe size={16} />
        English
      </button>

      <p className="text-muted-foreground text-xs">Streamflix</p>
    </div>
  </footer>
);

export default Footer;
