import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
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
            Datenschutzerklärung
          </h1>
          <p className="text-gray-400">Stand: Dezember 2024</p>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 space-y-8 text-gray-300">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Verantwortliche Stelle</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              </p>
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 space-y-1">
                <p><strong className="text-white">BlockHost</strong></p>
                <p>St. Gallen, Schweiz</p>
                <p>E-Mail: support@blockhosts.org</p>
              </div>
              <p>
                Die verantwortliche Stelle entscheidet allein oder gemeinsam mit anderen über die Zwecke 
                und Mittel der Verarbeitung von personenbezogenen Daten (z.B. Namen, Kontaktdaten o.Ä.).
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Geltungsbereich</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Diese Datenschutzerklärung gilt für die Verarbeitung personenbezogener Daten im Rahmen 
                unserer Minecraft-Server-Hosting-Dienstleistungen und den Besuch unserer Website.
              </p>
              <p>
                Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und behandeln Ihre 
                personenbezogenen Daten vertraulich und entsprechend der gesetzlichen 
                Datenschutzvorschriften (DSGVO, DSG) sowie dieser Datenschutzerklärung.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Erhebung und Speicherung personenbezogener Daten</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.1 Beim Besuch der Website</h3>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum Einsatz kommenden 
                Browser automatisch Informationen an den Server unserer Website gesendet:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>IP-Adresse des anfragenden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners</li>
              </ul>
              <p>
                Diese Daten werden aus technischen Gründen automatisch erfasst und temporär in 
                sogenannten Server-Logfiles gespeichert. Eine Zusammenführung dieser Daten mit anderen 
                Datenquellen wird nicht vorgenommen.
              </p>
              <p>
                <strong className="text-white">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO 
                (berechtigtes Interesse an der Bereitstellung einer funktionsfähigen Website)
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Bei Registrierung und Bestellung</h3>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Bei der Registrierung und Bestellung unserer Hosting-Dienste erheben wir folgende Daten:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Vor- und Nachname</li>
                <li>E-Mail-Adresse</li>
                <li>Telefonnummer</li>
                <li>Rechnungsadresse (Straße, PLZ, Stadt, Land)</li>
                <li>Firma (optional)</li>
                <li>Gewählter Hosting-Plan und Konfiguration</li>
              </ul>
              <p>
                <strong className="text-white">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO 
                (Vertragserfüllung) und Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtungen)
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.3 Bei Zahlungsabwicklung</h3>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Je nach gewählter Zahlungsmethode erheben wir:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Kreditkarte/Debitkarte:</strong> Kartennummer (verschlüsselt), Ablaufdatum, Name auf Karte</li>
                <li><strong>PayPal:</strong> PayPal-E-Mail-Adresse</li>
                <li><strong>TWINT:</strong> Telefonnummer</li>
                <li><strong>Apple Pay:</strong> Geräte-Token</li>
                <li><strong>Rechnung:</strong> Rechnungsadresse</li>
              </ul>
              <p>
                Zahlungsdaten werden verschlüsselt übertragen und gesichert gespeichert. Eine direkte 
                Speicherung von Kreditkartendaten erfolgt nicht auf unseren Servern.
              </p>
              <p>
                <strong className="text-white">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Zweck der Datenverarbeitung</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Wir verwenden Ihre personenbezogenen Daten ausschließlich für folgende Zwecke:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Bereitstellung und Verwaltung Ihrer Minecraft-Server</li>
                <li>Abwicklung von Bestellungen und Zahlungen</li>
                <li>Erstellung von Rechnungen und Buchführung</li>
                <li>Kundensupport und technische Unterstützung</li>
                <li>Versand wichtiger Informationen (Server-Status, Wartungen, Rechnungen)</li>
                <li>Erfüllung gesetzlicher Aufbewahrungspflichten</li>
                <li>Verhinderung von Missbrauch und Betrug</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Weitergabe von Daten</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Eine Übermittlung Ihrer personenbezogenen Daten an Dritte erfolgt nur in folgenden Fällen:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong className="text-white">Zahlungsdienstleister:</strong> Zur Abwicklung von Zahlungen 
                  (PayPal, Stripe, TWINT, Apple Pay)
                </li>
                <li>
                  <strong className="text-white">Rechenzentrum:</strong> Server-Hosting in St. Gallen, Schweiz
                </li>
                <li>
                  <strong className="text-white">TCPShield:</strong> DDoS-Schutz-Anbieter (nur IP-Adressen)
                </li>
                <li>
                  <strong className="text-white">Gesetzliche Verpflichtung:</strong> Wenn wir rechtlich dazu 
                  verpflichtet sind (z.B. durch Gerichtsbeschluss)
                </li>
              </ul>
              <p>
                Alle Partner sind vertraglich zur Einhaltung der Datenschutzbestimmungen verpflichtet. 
                Es erfolgt keine Weitergabe zu Werbezwecken an Dritte.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Speicherdauer</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die genannten Zwecke 
                erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong className="text-white">Vertragsdaten:</strong> Während der Vertragslaufzeit und 
                  10 Jahre nach Vertragsende (steuerrechtliche Aufbewahrungspflicht)
                </li>
                <li>
                  <strong className="text-white">Rechnungen:</strong> 10 Jahre (gesetzliche Aufbewahrungspflicht)
                </li>
                <li>
                  <strong className="text-white">Server-Logs:</strong> 30 Tage
                </li>
                <li>
                  <strong className="text-white">Backups:</strong> Je nach Tarif 7-30 Tage
                </li>
                <li>
                  <strong className="text-white">Support-Anfragen:</strong> 3 Jahre nach letzter Kommunikation
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies und Tracking</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Unsere Website verwendet technisch notwendige Cookies, um die Funktionalität zu gewährleisten:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-white">Session-Cookie:</strong> Zur Verwaltung der Anmeldung (wird nach Beenden des Browsers gelöscht)</li>
                <li><strong className="text-white">Warenkorb-Cookie:</strong> Zur Speicherung Ihrer Produktauswahl</li>
                <li><strong className="text-white">Sprach-Cookie:</strong> Zur Speicherung Ihrer Sprachpräferenz (DE/EN)</li>
              </ul>
              <p>
                Wir verwenden <strong className="text-white">keine</strong> Marketing- oder Tracking-Cookies 
                von Drittanbietern. Es erfolgt keine Nutzer-Analyse durch Google Analytics, Facebook Pixel 
                oder ähnliche Dienste.
              </p>
              <p>
                Sie können Cookies in Ihren Browser-Einstellungen jederzeit löschen oder blockieren. 
                Beachten Sie, dass dadurch möglicherweise nicht alle Funktionen der Website zur Verfügung stehen.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Datensicherheit</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen 
                zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder den Zugriff 
                unberechtigter Personen zu schützen:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-white">SSL/TLS-Verschlüsselung:</strong> Alle Datenübertragungen sind verschlüsselt (256-bit)</li>
                <li><strong className="text-white">DDoS-Schutz:</strong> Bereitgestellt durch TCPShield</li>
                <li><strong className="text-white">Firewall:</strong> Schutz vor unbefugtem Zugriff</li>
                <li><strong className="text-white">Zugriffskontrolle:</strong> Nur autorisierte Mitarbeiter haben Zugang zu personenbezogenen Daten</li>
                <li><strong className="text-white">Regelmäßige Backups:</strong> Automatische Datensicherung</li>
                <li><strong className="text-white">Rechenzentrum:</strong> Physisch gesichertes Rechenzentrum in St. Gallen, Schweiz</li>
              </ul>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Ihre Rechte</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Sie haben jederzeit das Recht auf:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong className="text-white">Auskunft (Art. 15 DSGVO):</strong> Bestätigung, ob wir 
                  Ihre Daten verarbeiten und Auskunft über diese Daten
                </li>
                <li>
                  <strong className="text-white">Berichtigung (Art. 16 DSGVO):</strong> Korrektur unrichtiger 
                  oder Vervollständigung unvollständiger Daten
                </li>
                <li>
                  <strong className="text-white">Löschung (Art. 17 DSGVO):</strong> Löschung Ihrer Daten, 
                  sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen
                </li>
                <li>
                  <strong className="text-white">Einschränkung (Art. 18 DSGVO):</strong> Einschränkung der 
                  Verarbeitung Ihrer Daten
                </li>
                <li>
                  <strong className="text-white">Datenübertragbarkeit (Art. 20 DSGVO):</strong> Erhalt Ihrer 
                  Daten in einem strukturierten, maschinenlesbaren Format
                </li>
                <li>
                  <strong className="text-white">Widerspruch (Art. 21 DSGVO):</strong> Widerspruch gegen die 
                  Verarbeitung Ihrer Daten
                </li>
                <li>
                  <strong className="text-white">Beschwerde:</strong> Beschwerde bei einer Datenschutzaufsichtsbehörde
                </li>
              </ul>
              <p className="mt-4">
                Zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte per E-Mail oder schriftlich. 
                Wir werden Ihrem Anliegen innerhalb von 30 Tagen nachkommen.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Kinder</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Unsere Dienste richten sich nicht gezielt an Kinder unter 16 Jahren. Sollten wir feststellen, 
                dass wir Daten von Kindern ohne Einwilligung der Erziehungsberechtigten erhoben haben, 
                werden wir diese umgehend löschen.
              </p>
              <p>
                Eltern und Erziehungsberechtigte werden gebeten, die Online-Aktivitäten ihrer Kinder zu 
                überwachen und sicherzustellen, dass keine personenbezogenen Daten ohne ihre Zustimmung 
                weitergegeben werden.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Änderungen der Datenschutzerklärung</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte 
                Rechtslagen oder bei Änderungen unserer Dienste sowie der Datenverarbeitung anzupassen.
              </p>
              <p>
                Die jeweils aktuelle Fassung finden Sie auf dieser Seite. Bei wesentlichen Änderungen 
                werden wir Sie per E-Mail informieren.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Datenübermittlung in Drittländer</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Alle Server befinden sich in <strong className="text-white">St. Gallen, Schweiz</strong>. 
                Die Schweiz gilt gemäß Art. 45 DSGVO als sicheres Drittland mit angemessenem Datenschutzniveau.
              </p>
              <p>
                Einige unserer Zahlungsdienstleister (PayPal, Apple Pay) haben Ihren Sitz in den USA. 
                Die Datenübermittlung erfolgt auf Grundlage von EU-Standardvertragsklauseln und 
                zusätzlichen Sicherheitsgarantien.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="pt-4 border-t border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Kontakt Datenschutz</h2>
            <div className="space-y-3 text-sm">
              <p>
                Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte kontaktieren Sie uns:
              </p>
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 space-y-1">
                <p><strong className="text-white">BlockHost - Datenschutz</strong></p>
                <p>St. Gallen, Schweiz</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}