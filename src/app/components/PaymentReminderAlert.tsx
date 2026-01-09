import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { Bell, CreditCard, FileText, Clock, AlertCircle } from 'lucide-react';

interface PaymentReminderAlertProps {
  onGoToBilling?: () => void;
}

export function PaymentReminderAlert({ onGoToBilling }: PaymentReminderAlertProps) {
  const { t } = useLanguage();
  const { user } = useUser();

  // Don't show payment alerts for privileged users (Owner/Admin)
  const isPrivileged = user?.isAdmin || user?.isOwner;
  
  if (!user?.paymentStatus || user.paymentStatus !== 'reminder' || !user.currentPlan || !user.daysOverdue || isPrivileged) {
    return null;
  }

  const daysRemaining = 10 - user.daysOverdue;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-CH', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getDescription = () => {
    if (user.daysOverdue === 1) {
      return t('alert.reminder.descriptionSingular')
        .replace('{plan}', user.currentPlan || '')
        .replace('{days}', user.daysOverdue.toString())
        .replace('{remaining}', daysRemaining.toString());
    }
    return t('alert.reminder.description')
      .replace('{plan}', user.currentPlan || '')
      .replace('{days}', user.daysOverdue.toString())
      .replace('{remaining}', daysRemaining.toString());
  };

  return (
    <div className="relative z-10 mb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 border-blue-500/30 border rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600/20 border-blue-500/30 rounded-full flex items-center justify-center border">
                  <Bell className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {t('alert.reminder.title')}
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

                <div className="mb-4 p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-green-400" />
                    <p className="text-sm text-green-400">
                      ✓ {t('alert.reminder.noFee')}
                    </p>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <p className="text-sm text-yellow-400">
                      ⚠️ {t('alert.reminder.nextStep')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={onGoToBilling}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('alert.paymentOverdue.payNow')}
                  </Button>
                  <Button
                    onClick={onGoToBilling}
                    variant="outline"
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-600/10"
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