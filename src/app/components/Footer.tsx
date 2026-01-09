import { Server, Facebook, Twitter, Github, MessageCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface FooterProps {
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
}

export function Footer({ onNavigateToTerms, onNavigateToPrivacy }: FooterProps) {
  const { t } = useLanguage();
  
  return (
    <footer id="support" className="bg-black border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-8 h-8 text-green-500" />
              <span className="text-xl text-white">BlockHost</span>
            </div>
            <p className="text-gray-400 text-sm">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white mb-4">{t('footer.product')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">{t('footer.features')}</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">{t('footer.pricing')}</a></li>
              <li><a href="#servers" className="text-gray-400 hover:text-white transition-colors">{t('footer.locations')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.contact')}</a></li>
              <li>
                <a 
                  href="https://discord.com/channels/1454209771015245867/1454209772394905734" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={onNavigateToPrivacy}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  {t('footer.privacy')}
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateToTerms}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  {t('footer.terms')}
                </button>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 BlockHost. {t('footer.rights')}
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}