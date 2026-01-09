import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface TermsOfServiceProps {
  onBack?: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onBack ? onBack() : window.location.href = '/'}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-4">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>
          <p className="text-gray-400">Stand: Dezember 2024</p>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 space-y-8 text-gray-300">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Geltungsbereich</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen BlockHost 
                (nachfolgend "Anbieter") mit Sitz in St. Gallen, Schweiz, und dem Kunden über die Bereitstellung 
                von Minecraft-Server-Hosting-Dienstleistungen.
              </p>
              <p>
                Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen des Kunden werden 
                nicht Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich zugestimmt.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Vertragsgegenstand</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Der Anbieter stellt dem Kunden Serverkapazitäten zur Verfügung, auf denen der Kunde 
                Minecraft-Server betreiben kann. Die konkrete Leistung ergibt sich aus dem gewählten 
                Hosting-Plan und den Produktbeschreibungen auf der Website.
              </p>
              <p>
                Der Anbieter bietet folgende Hosting-Pläne an:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Basic:</strong> 2GB RAM, 10GB Storage, bis zu 20 Spieler</li>
                <li><strong>Pro:</strong> 4GB RAM, 25GB Storage, bis zu 50 Spieler</li>
                <li><strong>Premium:</strong> 8GB RAM, 50GB Storage, bis zu 100 Spieler</li>
                <li><strong>Enterprise:</strong> Konfigurierbare Ressourcen nach Bedarf</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Vertragsschluss</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Die Darstellung der Produkte auf der Website stellt kein rechtlich bindendes Angebot dar, 
                sondern eine Aufforderung zur Bestellung.
              </p>
              <p>
                Durch Klicken auf "Bestellung abschließen" gibt der Kunde ein verbindliches Angebot zum 
                Abschluss eines Vertrages ab. Der Vertrag kommt zustande, wenn der Anbieter das Angebot 
                durch eine Auftragsbestätigung per E-Mail annimmt.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Preise und Zahlung</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Alle Preise verstehen sich in Schweizer Franken (CHF) und sind Endpreise inklusive der 
                gesetzlichen Mehrwertsteuer von 8,1% (Stand 2024).
              </p>
              <p>
                Die Abrechnung erfolgt monatlich im Voraus. Der erste Rechnungsbetrag ist bei Vertragsschluss 
                fällig, weitere Zahlungen jeweils zu Beginn des neuen Abrechnungszeitraums.
              </p>
              <p>
                Folgende Zahlungsmethoden werden akzeptiert:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Kreditkarte (Visa, Mastercard, American Express)</li>
                <li>Debitkarte (EC, Maestro, V PAY)</li>
                <li>PayPal</li>
                <li>TWINT</li>
                <li>Apple Pay</li>
                <li>Rechnung (Zahlungsziel 30 Tage)</li>
              </ul>
              <p>
                Bei Zahlungsverzug ist der Anbieter berechtigt, Verzugszinsen in Höhe von 5% p.a. zu berechnen 
                und den Zugang zum Server zu sperren.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Leistungsumfang und Verfügbarkeit</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Der Anbieter bemüht sich um eine möglichst hohe Verfügbarkeit der Server. Eine 
                Verfügbarkeit von 99,5% im Jahresmittel wird angestrebt, jedoch nicht garantiert.
              </p>
              <p>
                Ausgenommen von der Verfügbarkeitsberechnung sind:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Geplante Wartungsarbeiten (werden mindestens 48 Stunden vorher angekündigt)</li>
                <li>Höhere Gewalt</li>
                <li>DDoS-Angriffe und andere externe Sicherheitsbedrohungen</li>
                <li>Probleme außerhalb des Einflussbereichs des Anbieters</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Pflichten des Kunden</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Der Kunde verpflichtet sich:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Die Server ausschließlich zu rechtmäßigen Zwecken zu nutzen</li>
                <li>Keine urheberrechtlich geschützten Inhalte ohne Berechtigung zu verwenden</li>
                <li>Keine rassistischen, gewaltverherrlichenden oder pornografischen Inhalte bereitzustellen</li>
                <li>Keine Aktivitäten durchzuführen, die andere Server oder Nutzer beeinträchtigen</li>
                <li>Seine Zugangsdaten vertraulich zu behandeln und bei Verdacht auf Missbrauch unverzüglich zu ändern</li>
                <li>Regelmäßig Backups seiner Daten zu erstellen (zusätzlich zu den automatischen Backups)</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. DDoS-Schutz</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Alle Server sind durch TCPShield DDoS-Schutz gesichert. Dieser Schutz filtert schädlichen 
                Datenverkehr und gewährleistet die Erreichbarkeit des Servers auch bei Angriffen.
              </p>
              <p>
                Bei außergewöhnlich starken Angriffen behält sich der Anbieter vor, zusätzliche Schutzmaßnahmen 
                zu ergreifen, die vorübergehend die Leistung beeinträchtigen können.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Backups</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Der Anbieter erstellt je nach Tarif automatische Backups:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Basic:</strong> Tägliche Backups, 7 Tage Aufbewahrung, max. 3 Backups</li>
                <li><strong>Pro:</strong> Stündliche Backups, 10 Tage Aufbewahrung, max. 7 Backups</li>
                <li><strong>Premium:</strong> Echtzeit-Backups, 14 Tage Aufbewahrung, max. 10 Backups</li>
                <li><strong>Enterprise:</strong> Echtzeit-Backups, 14 Tage Aufbewahrung, max. 10 Backups</li>
              </ul>
              <p>
                Der Kunde ist dennoch verpflichtet, eigene Sicherungskopien anzufertigen. Eine Haftung für 
                Datenverlust wird ausgeschlossen, soweit gesetzlich zulässig.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Vertragslaufzeit und Kündigung</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Der Vertrag wird auf unbestimmte Zeit geschlossen und kann von beiden Parteien mit einer 
                Frist von 14 Tagen zum Monatsende gekündigt werden.
              </p>
              <p>
                Die Kündigung muss in Textform (E-Mail ausreichend) erfolgen. Bei Kündigung durch den Kunden 
                werden bereits gezahlte Beträge nicht erstattet.
              </p>
              <p>
                Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Ein wichtiger 
                Grund liegt insbesondere vor bei:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Schwerwiegenden oder wiederholten Verstößen gegen diese AGB</li>
                <li>Zahlungsverzug von mehr als 30 Tagen</li>
                <li>Rechtswidrigem Verhalten des Kunden</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Haftung</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder 
                der Gesundheit sowie für Schäden, die auf einer vorsätzlichen oder grob fahrlässigen 
                Pflichtverletzung beruhen.
              </p>
              <p>
                Für leicht fahrlässige Pflichtverletzungen haftet der Anbieter nur bei Verletzung 
                vertragswesentlicher Pflichten (Kardinalpflichten). In diesem Fall ist die Haftung auf den 
                vertragstypischen, vorhersehbaren Schaden begrenzt.
              </p>
              <p>
                Die Haftung für Datenverlust wird auf den typischen Wiederherstellungsaufwand beschränkt, 
                der bei regelmäßiger und gefahrentsprechender Anfertigung von Sicherungskopien durch den 
                Kunden entstanden wäre.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Datenschutz</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Der Anbieter behandelt alle personenbezogenen Daten vertraulich und gemäß den geltenden 
                Datenschutzbestimmungen (DSGVO und DSG). Weitere Informationen finden Sie in unserer 
                separaten Datenschutzerklärung.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Schlussbestimmungen</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Es gilt das Recht der Schweiz unter Ausschluss des UN-Kaufrechts (CISG).
              </p>
              <p>
                Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist St. Gallen, Schweiz, soweit 
                der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches 
                Sondervermögen ist.
              </p>
              <p>
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit 
                der übrigen Bestimmungen hiervon unberührt.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="pt-4 border-t border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Kontakt</h2>
            <div className="space-y-2 text-sm">
              <p><strong className="text-white">BlockHost</strong></p>
              <p>St. Gallen, Schweiz</p>
              <p>E-Mail: support@blockhosts.org</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}