import { X, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { useState } from 'react';
import { toast } from 'sonner';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'email' | 'code' | 'newPassword' | 'success';

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const { t } = useLanguage();
  const { resetPassword, checkEmailExists } = useUser();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email exists
    if (!checkEmailExists(email)) {
      toast.error('E-Mail-Adresse nicht gefunden!', {
        description: 'Diese E-Mail ist nicht registriert. Bitte überprüfen Sie Ihre Eingabe.',
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate sending email with code
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate random 6-digit code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(randomCode);
    
    setIsLoading(false);
    toast.success('Bestätigungscode wurde an Ihre E-Mail gesendet!', {
      description: 'Bitte überprüfen Sie Ihr E-Mail-Postfach.',
    });
    setStep('code');
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code === generatedCode) {
      toast.success('Code erfolgreich verifiziert!');
      setStep('newPassword');
    } else {
      toast.error('Ungültiger Code. Bitte versuchen Sie es erneut.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      toast.error('Passwort muss mindestens 8 Zeichen lang sein!');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein!');
      return;
    }
    
    // Actually reset the password in the database
    const success = resetPassword(email, newPassword);
    
    if (success) {
      toast.success('Passwort erfolgreich zurückgesetzt!', {
        description: 'Das alte Passwort wurde gelöscht. Sie können sich jetzt mit dem neuen Passwort anmelden.',
      });
      setStep('success');
    } else {
      toast.error('Fehler beim Zurücksetzen des Passworts!');
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setGeneratedCode('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className="bg-gray-900 border border-white/10 rounded-lg w-full max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Step 1: Email Input */}
          {step === 'email' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl text-white">Passwort vergessen?</h2>
                  <p className="text-gray-400 text-sm">Kein Problem, wir senden Ihnen einen Code</p>
                </div>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email" className="text-gray-300">E-Mail-Adresse</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="ihre.email@beispiel.de"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Geben Sie die E-Mail-Adresse Ihres Kontos ein
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Code wird gesendet...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Code senden
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="w-full text-gray-400 hover:text-white"
                >
                  Zurück zur Anmeldung
                </Button>
              </form>
            </>
          )}

          {/* Step 2: Code Verification */}
          {step === 'code' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl text-white">Code eingeben</h2>
                  <p className="text-gray-400 text-sm">Bestätigungscode wurde gesendet</p>
                </div>
              </div>

              {/* Simulated Email Preview */}
              <div className="bg-gray-800/50 border border-green-500/20 rounded-lg p-4 mb-6">
                <div className="bg-gray-900 rounded-lg p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Von: noreply@blockhosts.org</p>
                      <p className="text-xs text-gray-400">An: {email}</p>
                      <p className="text-xs text-white mt-1">Betreff: Passwort zurücksetzen</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <p className="text-xs text-gray-300">Hallo,</p>
                    <p className="text-xs text-gray-400">
                      Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt. Verwenden Sie den folgenden Code:
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-green-500/10 border-2 border-green-500 rounded-lg px-6 py-3">
                      <span className="text-2xl font-mono font-bold text-green-500 tracking-widest">
                        {generatedCode}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Dieser Code ist 10 Minuten gültig.
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <Label htmlFor="verification-code" className="text-gray-300">Verifizierungs-Code</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="123456"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1 text-center text-2xl tracking-widest font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Geben Sie den 6-stelligen Code aus Ihrer E-Mail ein
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Code verifizieren
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('email')}
                  className="w-full text-gray-400 hover:text-white"
                >
                  Code erneut senden
                </Button>
              </form>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 'newPassword' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl text-white">Neues Passwort</h2>
                  <p className="text-gray-400 text-sm">Erstellen Sie ein sicheres Passwort</p>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="new-password" className="text-gray-300">Neues Passwort</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mindestens 8 Zeichen
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="text-gray-300">Passwort bestätigen</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
                  />
                </div>

                {newPassword && confirmPassword && (
                  <div className={`p-3 rounded-lg border ${
                    newPassword === confirmPassword
                      ? 'bg-green-600/10 border-green-600/20'
                      : 'bg-red-600/10 border-red-600/20'
                  }`}>
                    <p className={`text-xs ${
                      newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {newPassword === confirmPassword
                        ? '✓ Passwörter stimmen überein'
                        : '✗ Passwörter stimmen nicht überein'}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Passwort zurücksetzen
                </Button>
              </form>
            </>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <>
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl text-white mb-3">Erfolgreich!</h2>
                <p className="text-gray-400 mb-8">
                  Ihr Passwort wurde erfolgreich zurückgesetzt.<br />
                  Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
                </p>
                <Button
                  onClick={handleClose}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Zur Anmeldung
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}