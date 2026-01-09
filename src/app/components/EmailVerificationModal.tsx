import { Mail, X, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useUser } from '../contexts/UserContext';
import { useState } from 'react';
import { toast } from 'sonner';

export function EmailVerificationModal() {
  const { pendingVerification, verifyEmail, cancelVerification } = useUser();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  
  if (!pendingVerification) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError(true);
      toast.error('Bitte geben Sie einen 6-stelligen Code ein!');
      return;
    }
    
    const success = verifyEmail(code);
    
    if (!success) {
      setError(true);
      toast.error('Ungültiger Bestätigungscode!', {
        description: 'Bitte überprüfen Sie den Code in Ihrer E-Mail.',
      });
      return;
    }
    
    toast.success('E-Mail erfolgreich bestätigt!', {
      description: 'Sie sind jetzt angemeldet.',
    });
    setCode('');
    setError(false);
  };

  const handleCancel = () => {
    cancelVerification();
    setCode('');
    setError(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={handleCancel}
      >
        {/* Modal */}
        <div
          className="bg-gray-900 border border-white/10 rounded-lg w-full max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl text-white">E-Mail Bestätigung</h2>
              <p className="text-sm text-gray-400">Verify your login</p>
            </div>
          </div>

          {/* Email Notification */}
          <div className="bg-gray-800/50 border border-green-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-white font-medium mb-1">Bestätigungscode wurde gesendet</p>
                <p className="text-gray-400 text-xs">
                  Ein 6-stelliger Bestätigungscode wurde an{' '}
                  <span className="text-green-500">{pendingVerification.email}</span> gesendet.
                  Bitte überprüfen Sie Ihr E-Mail-Postfach.
                </p>
              </div>
            </div>
            
            {/* Simulated Email Preview */}
            <div className="bg-gray-900 rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                <Mail className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Von: noreply@blockhosts.org</p>
                  <p className="text-xs text-gray-400">An: {pendingVerification.email}</p>
                  <p className="text-xs text-white mt-1">Betreff: Ihr Login-Bestätigungscode</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <p className="text-xs text-gray-300">Hallo,</p>
                <p className="text-xs text-gray-400">
                  Sie haben versucht, sich bei BlockHost anzumelden. Verwenden Sie den folgenden Code, um Ihre Anmeldung zu bestätigen:
                </p>
              </div>
              
              <div className="flex items-center justify-center my-4">
                <div className="bg-green-500/10 border-2 border-green-500 rounded-lg px-6 py-3">
                  <span className="text-3xl font-mono font-bold text-green-500 tracking-widest">
                    {pendingVerification.code}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Dieser Code ist 5 Minuten gültig.
              </p>
              <p className="text-xs text-gray-500 text-center mt-2">
                Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="verification-code" className="text-white mb-2">
                Bestätigungscode eingeben
              </Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError(false);
                }}
                maxLength={6}
                className={`bg-gray-800 border-white/10 text-white placeholder:text-gray-500 text-center text-2xl font-mono tracking-widest ${
                  error ? 'border-red-500 focus:border-red-500' : ''
                }`}
                autoComplete="off"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">Ungültiger Code. Bitte überprüfen Sie Ihre E-Mail.</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Bestätigen
              </Button>
            </div>
          </form>

          {/* Help text */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-gray-500 text-center">
              Haben Sie keine E-Mail erhalten?{' '}
              <button
                type="button"
                onClick={handleCancel}
                className="text-green-500 hover:text-green-400 underline"
              >
                Erneut versuchen
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}