import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { AlertTriangle, CreditCard, FileText, Clock, DollarSign } from 'lucide-react';

interface PaymentWarning2AlertProps {
  onGoToBilling?: () => void;
}

export function PaymentWarning2Alert({ onGoToBilling }: PaymentWarning2AlertProps) {
  const { t } = useLanguage();
  const { user } = useUser();

  // Don't show payment alerts for privileged users (Owner/Admin)
  const isPrivileged = user?.isAdmin || user?.isOwner;

  if (!user?.paymentStatus || user.paymentStatus !== 'warning2' || !user.currentPlan || !user.daysOverdue || isPrivileged) {
    return null;
  }

  const daysRemaining = 30 - user.daysOverdue;
  const previousFees = 10;
  const newFee = 20;
  const totalFees = previousFees + newFee;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-CH', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getDescription = () => {
    return t('alert.warning2.description')
      .replace('{days}', user.daysOverdue.toString());
  };

  return (
    <div className="relative z-10 mb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-600/25 to-orange-600/25 border-red-500/40 border-2 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-600/20 border-2 border-red-500/40 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-red-400">
                        {t('alert.warning2.title')}
                      </h3>
                      <span className="px-2 py-0.5 bg-red-600/20 border border-red-500/40 rounded text-xs text-red-300">
                        2/3
                      </span>
                    </div>
                    {user.nextPaymentDate && (
                      <div className="flex items-center gap-2 text-sm text-red-300">
                        <Clock className="w-4 h-4" />
                        <span>{t('alert.paymentOverdue.dueDate')}: {formatDate(user.nextPaymentDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-200 mb-4">
                  {getDescription()}
                </p>

                {/* Fee Information */}
                <div className="mb-4 p-4 bg-red-600/10 border border-red-500/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-medium">{t('alert.warning2.previousFees')}</span>
                    </div>
                    <span className="text-red-400">CHF {previousFees.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-medium">{t('alert.warning2.newFee')}</span>
                    </div>
                    <span className="text-red-400 font-bold">+ CHF {newFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-red-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-red-300 font-bold">{t('alert.warning1.totalDue')}</span>
                      <span className="text-red-300 font-bold text-lg">CHF {totalFees.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Next Step Warning */}
                <div className="mb-4 p-3 bg-red-600/15 border border-red-600/30 rounded-lg animate-pulse">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-sm text-red-400 font-bold">
                        ⚠️ {t('alert.warning2.nextStep')}
                      </p>
                      <p className="text-xs text-red-300 mt-1">
                        {daysRemaining} {daysRemaining === 1 ? 'Tag' : 'Tage'} verbleibend
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={onGoToBilling}
                    className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('alert.paymentOverdue.payNow')}
                  </Button>
                  <Button
                    onClick={onGoToBilling}
                    variant="outline"
                    className="border-red-500/40 text-red-400 hover:bg-red-600/10"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {t('alert.paymentOverdue.viewInvoice')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}