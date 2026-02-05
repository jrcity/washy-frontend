import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const quickLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

const serviceLinks = [
  { href: '/services/wash-and-fold', label: 'Wash & Fold' },
  { href: '/services/dry-cleaning', label: 'Dry Cleaning' },
  { href: '/services/ironing', label: 'Ironing' },
  { href: '/services/express', label: 'Express Service' },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 py-8">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Washy</span>
            </Link>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              Premium laundry and dry cleaning services with doorstep pickup and delivery.
              Experience the cleanest clothes with Washy's expert care.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase text-xs tracking-widest opacity-80">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-neutral-300 hover:text-primary-300 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase text-xs tracking-widest opacity-80">Our Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-neutral-300 hover:text-primary-300 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase text-xs tracking-widest opacity-80">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-neutral-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-500" />
                <span className="text-sm leading-relaxed">15 Ahmadu Bello Way, Kaduna, Nigeria</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-primary-500" />
                <a href="tel:+2348012345678" className="text-sm text-neutral-300 hover:text-primary-300 transition-colors">
                  +234 801 234 5678
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-primary-500" />
                <a href="mailto:support@washy.com.ng" className="text-sm text-neutral-300 hover:text-primary-300 transition-colors">
                  support@washy.com.ng
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-neutral-500 font-medium">
              © {currentYear} Washy. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <Link to="/privacy" className="text-xs font-medium text-neutral-500 hover:text-primary-400 transition-colors uppercase tracking-wider">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs font-medium text-neutral-500 hover:text-primary-400 transition-colors uppercase tracking-wider">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
