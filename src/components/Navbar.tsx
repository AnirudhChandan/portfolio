import ThemeToggle from "./ThemeToggle";

// Absolute-hash hrefs so the nav works from sub-pages (e.g. /blog) too. Home and Lab drop on phones to fit.
const navItems = [
  { name: "Home", href: "/#home", phone: false },
  { name: "Work", href: "/#work", phone: true },
  { name: "Services", href: "/#services", phone: true },
  { name: "Lab", href: "/lab", phone: false },
  { name: "Writing", href: "/blog", phone: true },
  { name: "Contact", href: "/#contact", phone: true },
];

export default function Navbar() {
  return (
    <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 print:hidden">
      <nav className="flex items-center gap-0.5 p-1 rounded-full border border-white/10 bg-slate-950/90 backdrop-blur-md">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`${item.phone ? "" : "hidden sm:block"} px-2.5 sm:px-3.5 py-1.5 text-sm text-slate-300 hover:text-teal-400 transition-colors rounded-full`}
          >
            {item.name}
          </a>
        ))}
        <ThemeToggle />
      </nav>
    </div>
  );
}
