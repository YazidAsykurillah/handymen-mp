import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-6 md:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Brand & Description */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-0 mb-2">
              <Image src="/images/logo-transparent.png" alt="Handyman Logo" width={32} height={32} className="object-contain" />
              <h3 className="font-heading font-bold text-lg text-primary uppercase tracking-wider mb-0">
                {process.env.NEXT_PUBLIC_APP_NAME || "Handyman"}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium marketplace connecting discerning clients with elite craftsmen.
            </p>
            <p className="text-xs text-muted-foreground/70 pt-4">
              &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME || "Handyman"} Premium Marketplace. All rights reserved.
            </p>
          </div>

          {/* Column 2: Legal */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider">Legal</h4>
            <ul className="space-y-0">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider text-xs">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider text-xs">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider">Trust</h4>
            <ul className="space-y-0">
              <li>
                <Link href="/trust" className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider text-xs">
                  Insurance & Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Partners */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider">Partners</h4>
            <ul className="space-y-0">
              <li>
                <Link href="/become-a-pro" className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider text-xs">
                  Become a Pro
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
