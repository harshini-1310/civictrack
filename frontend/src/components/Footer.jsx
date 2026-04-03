import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight, Heart, Send } from 'lucide-react';

const footerData = {
  quickLinks: [
    { name: 'Report Issue', path: '/', description: 'Submit a new complaint' },
    { name: 'Track Status', path: '/track-status', description: 'Check complaint progress' },
    { name: 'Admin Portal', path: '/admin-login', description: 'Administrator access' },
  ],
  categories: [
    { name: 'Roads & Potholes', icon: '🛣️' },
    { name: 'Electricity', icon: '⚡' },
    { name: 'Water & Drainage', icon: '💧' },
    { name: 'Public Safety', icon: '🛡️' },
  ],
  contact: [
    { icon: Mail, label: 'Email', value: 'support@civictrack.com', href: 'mailto:support@civictrack.com' },
    { icon: Phone, label: 'Phone', value: '+1-800-CITIZEN', href: 'tel:+18001234567' },
    { icon: MapPin, label: 'Address', value: 'City Hall, Main Street', href: null },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div>
        <div>
          <div className="logo-column">
            <Link to="/">
              <span>CT</span>
              <div>
                <span>CivicTrack</span>
                <span>Community First</span>
              </div>
            </Link>

            <p>
              Empowering citizens to report public issues and helping create better communities through transparent governance.
            </p>

            <div>
              {['GitHub', 'Twitter', 'LinkedIn'].map((platform) => (
                <a key={platform} href="#">
                  {platform.slice(0, 2).toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              {footerData.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>
                    <ArrowUpRight size={16} />
                    <div>
                      <span>{link.name}</span>
                      <span>{link.description}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Categories</h4>
            <ul>
              {footerData.categories.map((cat) => (
                <li key={cat.name}>
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contact Us</h4>
            <ul>
              {footerData.contact.map((item) => {
                const Icon = item.icon;
                const Wrapper = item.href ? 'a' : 'div';
                const props = item.href ? { href: item.href } : {};

                return (
                  <li key={item.label}>
                    <Wrapper {...props}>
                      <Icon size={18} />
                      <div>
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                    </Wrapper>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div>
          <div>
            <div>
              <h5>Stay Updated</h5>
              <p>Get notified about community improvements</p>
            </div>

            <div>
              <input type="email" placeholder="Enter your email" />
              <button type="button">
                <Send size={18} />
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div>
            <p>
              <span>&copy; {currentYear} CivicTrack.</span>
              <span>Made with</span>
              <Heart size={14} className="heart-icon" />
              <span>for communities</span>
            </p>

            <nav>
              {['Privacy', 'Terms', 'Accessibility'].map((item) => (
                <a key={item} href="#">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
