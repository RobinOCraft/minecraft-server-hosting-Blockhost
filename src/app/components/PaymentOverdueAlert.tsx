import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { AlertTriangle, CreditCard, FileText, Clock } from 'lucide-react';

interface PaymentOverdueAlertProps {
  onGoToBilling?: () => void;
}

export function PaymentOverdueAlert({ onGoToBilling }: PaymentOverdueAlertProps) {
  const { t } = useLanguage();
  const { user } = useUser();

  if (!user?.paymentStatus || user.paymentStatus !== 'overdue' || !user.currentPlan || !user.daysOverdue) {
    return null;
  }

  const daysUntilSuspension = 7 - user.daysOverdue;
  const isCritical = daysUntilSuspension <= 2; // Last 2 days before suspension

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-CH', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getDescription = () => {
    if (user.daysOverdue === 1) {
      return t('alert.paymentOverdue.descriptionSingular')
        .replace('{plan}', user.currentPlan || '')
        .replace('{days}', user.daysOverdue.toString());
    }
    return t('alert.paymentOverdue.description')
      .replace('{plan}', user.currentPlan || '')
      .replace('{days}', user.daysOverdue.toString());
  };

  const getWarning = () => {
    if (isCritical) {
      // Final warning for last 2 days
      if (daysUntilSuspension === 1) {
        return t('alert.paymentOverdue.finalWarningSingular')
          .replace('{days}', daysUntilSuspension.toString());
      }
      return t('alert.paymentOverdue.finalWarning')
        .replace('{days}', daysUntilSuspension.toString());
    } else {
      // Regular warning
      if (daysUntilSuspension === 1) {
        return t('alert.paymentOverdue.warningSingular')
          .replace('{days}', daysUntilSuspension.toString());
      }
      return t('alert.paymentOverdue.warning')
        .replace('{days}', daysUntilSuspension.toString());
    }
  };

  return (
    <div className="relative z-10 mb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`${
            isCritical 
              ? 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border-red-500/40' 
              : 'bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border-orange-500/30'
          } border rounded-lg p-6 backdrop-blur-sm`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 ${
                  isCritical ? 'bg-red-600/20 border-red-500/30' : 'bg-orange-600/20 border-orange-500/30'
                } rounded-full flex items-center justify-center border ${
                  isCritical ? 'animate-pulse' : ''
                }`}>
                  <AlertTriangle className={`w-6 h-6 ${
                    isCritical ? 'text-red-400' : 'text-orange-400'
                  }`} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {t('alert.paymentOverdue.title')}
                  </h3>
                  {user.nextPaymentDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{t('alert.paymentOverdue.dueDate')}: {formatDate(user.nextPaymentDate)}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-300 mb-3">
                  {getDescription()}
                </p>

                {isCritical && (
                  <div className="mb-4 p-3 bg-red-600/10 border border-red-600/30 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">
                      {getWarning()}
                    </p>
                  </div>
                )}

                {!isCritical && daysUntilSuspension > 0 && (
                  <div className="mb-4 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg flex items-start gap-2">
                    <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-400">
                      {getWarning()}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={onGoToBilling}
                    className={`${
                      isCritical 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-orange-600 hover:bg-orange-700'
                    } text-white`}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('alert.paymentOverdue.payNow')}
                  </Button>
                  <Button
                    onClick={onGoToBilling}
                    variant="outline"
                    className={`${
                      isCritical 
                        ? 'border-red-500/30 text-red-400 hover:bg-red-600/10' 
                        : 'border-orange-500/30 text-orange-400 hover:bg-orange-600/10'
                    }`}
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