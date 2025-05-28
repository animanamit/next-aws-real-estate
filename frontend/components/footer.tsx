import Link from "next/link"
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  renters: [
    { label: "Search Properties", href: "/properties" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Support", href: "/support" },
  ],
  landlords: [
    { label: "List Property", href: "/list-property" },
    { label: "Property Management", href: "/management" },
    { label: "Resources", href: "/resources" },
    { label: "Tools", href: "/tools" },
  ],
}

const socialLinks = [
  { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
  { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
  { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
  { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
]

export default function Footer() {
  return (
    <footer className="bg-soft-black text-pure-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-muted-red rounded-lg">
                <Home className="h-6 w-6 text-pure-white" />
              </div>
              <span className="font-neue font-bold text-2xl">RentEase</span>
            </Link>
            <p className="font-neue text-warm-grey mb-6 max-w-md">
              Making rental housing accessible, transparent, and stress-free for everyone. Find your perfect home or
              list your property with confidence.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-red" />
                <span className="font-neue text-sm">hello@rentease.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-red" />
                <span className="font-neue text-sm">1-800-RENTEASE</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-red" />
                <span className="font-neue text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-neue font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-neue text-warm-grey hover:text-pure-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-neue font-semibold text-lg mb-4">For Renters</h3>
            <ul className="space-y-2">
              {footerLinks.renters.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-neue text-warm-grey hover:text-pure-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-neue font-semibold text-lg mb-4">For Landlords</h3>
            <ul className="space-y-2">
              {footerLinks.landlords.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-neue text-warm-grey hover:text-pure-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-charcoal-grey mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-neue text-warm-grey text-sm mb-4 md:mb-0">© 2024 RentEase. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="text-warm-grey hover:text-muted-red transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
