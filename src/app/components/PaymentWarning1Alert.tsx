import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { AlertTriangle, CreditCard, FileText, Clock, DollarSign } from 'lucide-react';

interface PaymentWarning1AlertProps {
  onGoToBilling?: () => void;
}

export function PaymentWarning1Alert({ onGoToBilling }: PaymentWarning1AlertProps) {
  const { t } = useLanguage();
  const { user } = useUser();

  // Don't show payment alerts for privileged users (Owner/Admin)
  const isPrivileged = user?.isAdmin || user?.isOwner;

  if (!user?.paymentStatus || user.paymentStatus !== 'warning1' || !user.currentPlan || !user.daysOverdue || isPrivileged) {
    return null;
  }

  const daysRemaining = 20 - user.daysOverdue;
  const warningFee = 10;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-CH', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getDescription = () => {
    return t('alert.warning1.description')
      .replace('{days}', user.daysOverdue.toString());
  };

  return (
    <div className="relative z-10 mb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-orange-600/20 to-orange-800/20 border-orange-500/30 border-2 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-600/20 border-2 border-orange-500/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-orange-400">
                        {t('alert.warning1.title')}
                      </h3>
                      <span className="px-2 py-0.5 bg-orange-600/20 border border-orange-500/30 rounded text-xs text-orange-300">
                        1/3
                      </span>
                    </div>
                    {user.nextPaymentDate && (
                      <div className="flex items-center gap-2 text-sm text-orange-300">
                        <Clock className="w-4 h-4" />
                        <span>{t('alert.paymentOverdue.dueDate')}: {formatDate(user.nextPaymentDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">
                  {getDescription()}
                </p>

                {/* Fee Information */}
                <div className="mb-4 p-4 bg-orange-600/10 border border-orange-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-orange-400" />
                      <span className="text-orange-400 font-medium">{t('alert.warning1.fee')}</span>
                    </div>
                    <span className="text-orange-400 font-bold">CHF {warningFee.toFixed(2)}</span>
                  </div>
                </div>

                {/* Next Step Warning */}
                <div className="mb-4 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-yellow-400">
                        ⚠️ {t('alert.warning1.nextStep')}
                      </p>
                      <p className="text-xs text-yellow-300 mt-1">
                        {daysRemaining} {daysRemaining === 1 ? 'Tag' : 'Tage'} verbleibend
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={onGoToBilling}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('alert.paymentOverdue.payNow')}
                  </Button>
                  <Button
                    onClick={onGoToBilling}
                    variant="outline"
                    className="border-orange-500/30 text-orange-400 hover:bg-orange-600/10"
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