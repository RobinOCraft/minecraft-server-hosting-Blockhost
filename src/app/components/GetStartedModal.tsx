import { X, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Password strength indicator component
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-500' : 'text-gray-500'}`}>
      {met ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      <span>{text}</span>
    </div>
  );
}

// Password validation function
function validatePassword(password: string) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~]/.test(password),
  };
}

export function GetStartedModal({ isOpen, onClose }: GetStartedModalProps) {
  const { t } = useLanguage();
  const { register, isLoggedIn, checkNameExists, checkEmailExists } = useUser();
  const { setIsCartOpen } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  
  const passwordRequirements = validatePassword(password);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  
  // Close modal if user is already logged in
  if (isLoggedIn) {
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if name already exists
    if (checkNameExists(name)) {
      toast.error('Dieser Name ist bereits vergeben!', {
        description: 'Bitte wählen Sie einen anderen Namen.'
      });
      return;
    }
    
    // Check if email already exists
    if (checkEmailExists(email)) {
      toast.error('Diese E-Mail-Adresse ist bereits registriert!', {
        description: 'Bitte verwenden Sie eine andere E-Mail oder melden Sie sich an.'
      });
      return;
    }
    
    if (!isPasswordValid) {
      toast.error('Passwort erfüllt nicht alle Anforderungen!', {
        description: 'Bitte überprüfen Sie die Passwortanforderungen unten.'
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein!');
      return;
    }
    
    // Try to register
    const success = register(name, email, password);
    
    if (!success) {
      toast.error('Registrierung fehlgeschlagen!', {
        description: 'Bitte versuchen Sie es erneut.'
      });
      return;
    }
    
    toast.success('Willkommen bei BlockHost!', {
      description: 'Ihr Konto wurde erfolgreich erstellt.',
    });
    onClose();
    
    // Open cart after registration
    setTimeout(() => {
      setIsCartOpen(true);
    }, 500);
    
    // Reset form
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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
          <h2 className="text-2xl text-white mb-2">{t('modal.getStarted.title')}</h2>
          <p className="text-gray-400 mb-6">Create your BlockHost account</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="signup-name" className="text-gray-300">{t('modal.getStarted.name')}</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Max Mustermann"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="signup-email" className="text-gray-300">{t('modal.getStarted.email')}</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="ihre.email@beispiel.de"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="signup-password" className="text-gray-300">{t('modal.getStarted.password')}</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
                onFocus={() => setShowPasswordHints(true)}
              />
              
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-2">
                    <div className={`h-1 flex-1 rounded ${passwordRequirements.length ? 'bg-green-500' : 'bg-gray-700'}`} />
                    <div className={`h-1 flex-1 rounded ${passwordRequirements.uppercase ? 'bg-green-500' : 'bg-gray-700'}`} />
                    <div className={`h-1 flex-1 rounded ${passwordRequirements.lowercase ? 'bg-green-500' : 'bg-gray-700'}`} />
                    <div className={`h-1 flex-1 rounded ${passwordRequirements.number ? 'bg-green-500' : 'bg-gray-700'}`} />
                    <div className={`h-1 flex-1 rounded ${passwordRequirements.special ? 'bg-green-500' : 'bg-gray-700'}`} />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    Passwortstärke: {' '}
                    <span className={isPasswordValid ? 'text-green-500 font-medium' : 'text-gray-400'}>
                      {isPasswordValid ? 'Sehr sicher ✓' : 'Zu schwach'}
                    </span>
                  </p>
                </div>
              )}
              
              {/* Password Requirements */}
              {showPasswordHints && (
                <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700 space-y-1">
                  <p className="text-xs text-gray-400 mb-2 font-medium">Passwort-Anforderungen:</p>
                  <PasswordRequirement met={passwordRequirements.length} text="Mindestens 8 Zeichen" />
                  <PasswordRequirement met={passwordRequirements.uppercase} text="Mindestens ein Großbuchstabe (A-Z)" />
                  <PasswordRequirement met={passwordRequirements.lowercase} text="Mindestens ein Kleinbuchstabe (a-z)" />
                  <PasswordRequirement met={passwordRequirements.number} text="Mindestens eine Zahl (0-9)" />
                  <PasswordRequirement 
                    met={passwordRequirements.special} 
                    text="Mindestens ein Sonderzeichen (z.B. !@#$%^&*)" 
                  />
                  <p className="text-xs text-gray-500 mt-2 pl-6">
                    Erlaubte Sonderzeichen: ! @ # $ % ^ &amp; * ( ) , . ? : - _ + = [ ] / ' " ~
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="signup-confirm-password" className="text-gray-300">
                {t('modal.getStarted.confirm')}
              </Label>
              <Input
                id="signup-confirm-password"
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
              />
            </div>

            <div className="text-sm">
              <label className="flex items-start gap-2 text-gray-300 cursor-pointer">
                <input type="checkbox" required className="mt-1 rounded border-gray-600" />
                <span>
                  {t('modal.getStarted.terms')}{' '}
                  <a href="#" className="text-green-500 hover:text-green-400 transition-colors">
                    {t('modal.getStarted.termsLink')}
                  </a>{' '}
                  {t('modal.getStarted.and')}{' '}
                  <a href="#" className="text-green-500 hover:text-green-400 transition-colors">
                    {t('modal.getStarted.privacy')}
                  </a>
                </span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {t('modal.getStarted.button')}
            </Button>

            <div className="text-center text-sm text-gray-400">
              {t('modal.getStarted.hasAccount')}{' '}
              <a href="#" className="text-green-500 hover:text-green-400 transition-colors">
                {t('modal.getStarted.signIn')}
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}