import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { ShieldAlert, CreditCard, MessageCircle, Clock, XCircle } from 'lucide-react';

interface ServerSuspendedAlertProps {
  onGoToBilling?: () => void;
}

export function ServerSuspendedAlert({ onGoToBilling }: ServerSuspendedAlertProps) {
  const { t } = useLanguage();
  const { user } = useUser();

  // Don't show payment alerts for privileged users (Owner/Admin)
  const isPrivileged = user?.isAdmin || user?.isOwner;

  if (!user?.paymentStatus || user.paymentStatus !== 'suspended' || !user.currentPlan || !user.daysOverdue || isPrivileged) {
    return null;
  }

  const daysSinceSuspension = user.daysOverdue - 40;
  const daysUntilDeletion = 30 - daysSinceSuspension;
  const isNearDeletion = daysUntilDeletion <= 7;
  const totalWarningFees = user.warningFees || 60; // Default to 60 (10+20+30)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-CH', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getSuspendedText = () => {
    if (daysSinceSuspension === 1) {
      return t('alert.serverSuspended.suspendedSinceSingular')
        .replace('{days}', daysSinceSuspension.toString());
    }
    return t('alert.serverSuspended.suspendedSince')
      .replace('{days}', daysSinceSuspension.toString());
  };

  return (
    <div className="relative z-10 mb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-700/30 to-red-900/30 border-red-500/50 border-2 rounded-lg p-6 backdrop-blur-sm shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-red-600/30 border-2 border-red-500/50 rounded-full flex items-center justify-center animate-pulse">
                  <ShieldAlert className="w-8 h-8 text-red-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-red-400 mb-1">
                      {t('alert.serverSuspended.title')}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-red-300">
                      <Clock className="w-4 h-4" />
                      <span>{getSuspendedText()}</span>
                      {user.nextPaymentDate && (
                        <span className="ml-2">({formatDate(user.nextPaymentDate)})</span>
                      )}
                    </div>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                
                <p className="text-gray-200 mb-4 font-medium">
                  {t('alert.serverSuspended.description')}
                </p>

                {/* Data deletion warning */}
                {isNearDeletion && (
                  <div className="mb-4 p-4 bg-red-600/20 border-2 border-red-500/40 rounded-lg animate-pulse">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="w-6 h-6 text-red-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-200 font-bold mb-1">
                          ⚠️ Kritische Warnung: Daten werden in {daysUntilDeletion} Tagen gelöscht!
                        </p>
                        <p className="text-sm text-red-300">
                          {t('alert.serverSuspended.warningDelete')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!isNearDeletion && (
                  <div className="mb-4 p-3 bg-red-600/10 border border-red-600/30 rounded-lg">
                    <p className="text-sm text-red-300">
                      {t('alert.serverSuspended.warningDelete')}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={onGoToBilling}
                    className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('alert.serverSuspended.unlockNow')}
                  </Button>
                  <Button
                    onClick={onGoToBilling}
                    variant="outline"
                    className="border-red-500/50 text-red-300 hover:bg-red-600/20"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t('alert.serverSuspended.contactSupport')}
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