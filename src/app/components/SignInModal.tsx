import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const { t } = useLanguage();
  const { login, isLoggedIn } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  
  // Close modal if user is already logged in
  if (isLoggedIn) {
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic password length validation
    if (password.length < 8) {
      toast.error('Passwort muss mindestens 8 Zeichen lang sein!');
      return;
    }
    
    // Try to login with credentials
    const success = login(email, password);
    
    if (!success) {
      toast.error('Anmeldung fehlgeschlagen!', {
        description: 'E-Mail oder Passwort ist falsch. Bitte überprüfen Sie Ihre Eingaben.',
      });
      return;
    }
    
    toast.success('Bestätigungscode wurde generiert!', {
      description: 'Bitte geben Sie den Code ein, um den Login abzuschließen.',
    });
    onClose();
    setEmail('');
    setPassword('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-gray-900 border border-white/10 rounded-lg w-full max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <h2 className="text-2xl text-white mb-2">{t('modal.signIn.title')}</h2>
          <p className="text-gray-400 mb-6">Welcome back to BlockHost</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">{t('modal.signIn.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre.email@beispiel.de"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">{t('modal.signIn.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Mindestens 8 Zeichen</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-600" />
                {t('modal.signIn.remember')}
              </label>
              <a 
                href="#" 
                className="text-green-500 hover:text-green-400 transition-colors" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setForgotPasswordOpen(true); 
                }}
              >
                {t('modal.signIn.forgot')}
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {t('modal.signIn.button')}
            </Button>

            <div className="text-center text-sm text-gray-400">
              {t('modal.signIn.noAccount')}{' '}
              <a href="#" className="text-green-500 hover:text-green-400 transition-colors">
                {t('modal.signIn.signUp')}
              </a>
            </div>
          </form>
        </div>
      </div>
      <ForgotPasswordModal isOpen={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} />
    </>
  );
}