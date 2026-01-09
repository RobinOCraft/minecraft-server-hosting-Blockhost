import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { AlertTriangle, CreditCard, FileText, Clock, DollarSign, ShieldAlert } from 'lucide-react';

interface PaymentWarning3AlertProps {
  onGoToBilling?: () => void;
}

export function PaymentWarning3Alert({ onGoToBilling }: PaymentWarning3AlertProps) {
  const { t } = useLanguage();
  const { user } = useUser();

  // Don't show payment alerts for privileged users (Owner/Admin)
  const isPrivileged = user?.isAdmin || user?.isOwner;

  if (!user?.paymentStatus || user.paymentStatus !== 'warning3' || !user.currentPlan || !user.daysOverdue || isPrivileged) {
    return null;
  }

  const daysUntilSuspension = 40 - user.daysOverdue;
  const previousFees = 30; // 10 + 20
  const newFee = 30;
  const totalFees = previousFees + newFee;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-CH', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getDescription = () => {
    return t('alert.warning3.description')
      .replace('{days}', user.daysOverdue.toString());
  };

  return (
    <div className="relative z-10 mb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-700/30 to-red-900/30 border-red-500/50 border-2 rounded-lg p-6 backdrop-blur-sm shadow-xl shadow-red-600/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-red-600/30 border-2 border-red-500/50 rounded-full flex items-center justify-center animate-pulse">
                  <ShieldAlert className="w-8 h-8 text-red-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-bold text-red-400">
                        {t('alert.warning3.title')}
                      </h3>
                      <span className="px-2 py-0.5 bg-red-600/30 border border-red-500/50 rounded text-xs text-red-200 animate-pulse">
                        3/3 - FINAL
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
                
                <p className="text-gray-200 mb-4 font-medium">
                  {getDescription()}
                </p>

                {/* Critical Warning */}
                <div className="mb-4 p-4 bg-red-600/20 border-2 border-red-500/40 rounded-lg animate-pulse">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-200 font-bold mb-1">
                        🚨 {t('alert.warning3.critical')}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-red-300">{t('alert.warning3.daysUntilSuspension')}:</span>
                        <span className="px-3 py-1 bg-red-600/30 border border-red-500/40 rounded text-red-200 font-bold">
                          {daysUntilSuspension} {daysUntilSuspension === 1 ? 'Tag' : 'Tage'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee Information */}
                <div className="mb-4 p-4 bg-red-600/15 border border-red-500/40 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-medium">{t('alert.warning3.previousFees')}</span>
                    </div>
                    <span className="text-red-400">CHF {previousFees.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-medium">{t('alert.warning3.newFee')}</span>
                    </div>
                    <span className="text-red-400 font-bold">+ CHF {newFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-red-500/40">
                    <div className="flex items-center justify-between">
                      <span className="text-red-300 font-bold text-lg">{t('alert.warning1.totalDue')}</span>
                      <span className="text-red-300 font-bold text-2xl">CHF {totalFees.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={onGoToBilling}
                    className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('alert.paymentOverdue.payNow')}
                  </Button>
                  <Button
                    onClick={onGoToBilling}
                    variant="outline"
                    className="border-red-500/50 text-red-300 hover:bg-red-600/15"
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