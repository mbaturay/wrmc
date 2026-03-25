import { useState, useEffect, useRef } from 'react';
import { SetupProgress } from '../../components/SetupProgress';

// ─── i18n ───────────────────────────────────────────────
const i18n = {
  en: {
    back: 'Back',
    // A_intro
    introTitle: 'Apply for your Walmart Rewards Mastercard',
    benefit1: '3% back at Walmart, 1% everywhere else',
    benefit2: 'No annual fee',
    benefit3: 'Up to $25 welcome bonus',
    startApp: 'Start application',
    seeDetails: 'What\u2019s included',
    detailsTitle: 'Walmart Rewards Mastercard',
    gotIt: 'Got it',
    termsFooter: 'Full terms and conditions at walmartrewards.ca',
    earnTitle: 'EARN REWARDS',
    earn1: '3% back at Walmart stores and Walmart.ca (including Marketplace)',
    earn2: '1% back everywhere else Mastercard is accepted',
    earn3: 'Rewards never expire',
    bonusTitle: 'WELCOME BONUS',
    bonus1: '$25 in Reward Dollars after one purchase of $75+ at Walmart within 30 days',
    bonus2: 'Credited within 5 business days of qualifying',
    featuresTitle: 'CARD FEATURES',
    feat1: 'No annual fee',
    feat2: 'Temporary Shopping Pass on instant approval',
    feat3: 'Zero liability protection',
    feat4: 'Mastercard Global Service',
    redeemTitle: 'REDEEM ANYWHERE AT WALMART',
    redeem1: 'In-store or Walmart.ca',
    redeem2: 'Minimum $5, in $5 increments',
    redeem3: 'Redeem for groceries, electronics, anything Walmart sells',
    close: 'Close',
    // A_personal
    personalTitle: 'Personal information',
    fullName: 'Full name',
    dob: 'Date of birth',
    phone: 'Phone number',
    email: 'Email',
    address: 'Home address',
    addressPlaceholder: 'Start typing your address...',
    enterManually: 'Enter address manually',
    searchForAddress: 'Search for address',
    notYourAddress: 'Not your address? Search again',
    streetAddress: 'Street address',
    unitApt: 'Unit / Apt (optional)',
    unitAptPlaceholder: 'e.g. 4B',
    city: 'City',
    province: 'Province',
    postalCode: 'Postal code',
    postalCodeError: 'Please enter a valid Canadian postal code (e.g. M5V 1J2)',
    sendCode: 'Send verification code',
    continue: 'Continue',
    step1of4: 'Step 1 of 4',
    // A_contact
    contactTitle: 'Almost there',
    contactBody: 'Add your contact details to complete your application.',
    // A_financial
    financialTitle: 'Financial information',
    income: 'Annual income',
    employment: 'Employment status',
    housing: 'Housing status',
    step2of4: 'Step 2 of 4',
    employed: 'Employed',
    selfEmployed: 'Self-employed',
    retired: 'Retired',
    student: 'Student',
    other: 'Other',
    own: 'Own',
    rent: 'Rent',
  },
  fr: {
    back: 'Retour',
    introTitle: 'Demandez votre Walmart Rewards Mastercard',
    benefit1: '3\u00a0% chez Walmart, 1\u00a0% partout ailleurs',
    benefit2: 'Aucuns frais annuels',
    benefit3: 'Jusqu\u2019\u00e0 25\u00a0$ de bonus de bienvenue',
    startApp: 'Commencer la demande',
    seeDetails: 'Ce qui est inclus',
    detailsTitle: 'Walmart Rewards Mastercard',
    gotIt: 'Compris',
    termsFooter: 'Conditions compl\u00e8tes sur walmartrewards.ca',
    earnTitle: 'GAGNER DES R\u00c9COMPENSES',
    earn1: '3\u00a0% de remise dans les magasins Walmart et sur Walmart.ca (incluant Marketplace)',
    earn2: '1\u00a0% de remise partout o\u00f9 Mastercard est accept\u00e9e',
    earn3: 'Les r\u00e9compenses n\u2019expirent jamais',
    bonusTitle: 'BONUS DE BIENVENUE',
    bonus1: '25\u00a0$ en dollars r\u00e9compenses apr\u00e8s un achat de 75\u00a0$+ chez Walmart en 30 jours',
    bonus2: 'Cr\u00e9dit\u00e9s dans les 5 jours ouvrables suivant l\u2019achat admissible',
    featuresTitle: 'CARACT\u00c9RISTIQUES DE LA CARTE',
    feat1: 'Aucuns frais annuels',
    feat2: 'Laissez-passer temporaire sur approbation instantan\u00e9e',
    feat3: 'Protection z\u00e9ro responsabilit\u00e9',
    feat4: 'Service mondial Mastercard',
    redeemTitle: '\u00c9CHANGER PARTOUT CHEZ WALMART',
    redeem1: 'En magasin ou sur Walmart.ca',
    redeem2: 'Minimum 5\u00a0$, par tranches de 5\u00a0$',
    redeem3: '\u00c9changez pour l\u2019\u00e9picerie, l\u2019\u00e9lectronique, tout ce que Walmart vend',
    close: 'Fermer',
    personalTitle: 'Renseignements personnels',
    fullName: 'Nom complet',
    dob: 'Date de naissance',
    phone: 'Num\u00e9ro de t\u00e9l\u00e9phone',
    email: 'Courriel',
    address: 'Adresse du domicile',
    addressPlaceholder: 'Commencez \u00e0 taper votre adresse...',
    enterManually: 'Entrer l\u2019adresse manuellement',
    searchForAddress: 'Rechercher une adresse',
    notYourAddress: 'Ce n\u2019est pas votre adresse\u00a0? Chercher \u00e0 nouveau',
    streetAddress: 'Adresse',
    unitApt: 'Unit\u00e9 / App. (facultatif)',
    unitAptPlaceholder: 'p. ex. 4B',
    city: 'Ville',
    province: 'Province',
    postalCode: 'Code postal',
    postalCodeError: 'Veuillez entrer un code postal canadien valide (p. ex. M5V 1J2)',
    sendCode: 'Envoyer le code de v\u00e9rification',
    continue: 'Continuer',
    step1of4: '\u00c9tape 1 de 4',
    contactTitle: 'Presque termin\u00e9',
    contactBody: 'Ajoutez vos coordonn\u00e9es pour compl\u00e9ter votre demande.',
    financialTitle: 'Renseignements financiers',
    income: 'Revenu annuel',
    employment: 'Situation d\u2019emploi',
    housing: 'Situation de logement',
    step2of4: '\u00c9tape 2 de 4',
    employed: 'Employ\u00e9',
    selfEmployed: 'Travailleur autonome',
    retired: 'Retrait\u00e9',
    student: '\u00c9tudiant',
    other: 'Autre',
    own: 'Propri\u00e9taire',
    rent: 'Locataire',
  },
};

// ─── Shared Back Button ─────────────────────────────────
function BackBtn({ onClick, lang }) {
  const T = i18n[lang] || i18n.en;
  return (
    <button
      onClick={onClick}
      style={{
        alignSelf: 'flex-start', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 4,
        fontSize: 13, color: 'var(--text-secondary)',
        background: 'none', border: 'none', cursor: 'pointer',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {T.back}
    </button>
  );
}

// ─── Custom Dropdown component ──────────────────────────
function Select({ id, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} id={id} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', height: 48, padding: '0 16px',
          border: '1px solid #E5E5E5', borderRadius: 8,
          background: '#fff', fontSize: 15, color: '#333',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span>{selected ? selected.label : ''}</span>
        <span style={{ color: '#999', fontSize: 14, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#x25BE;</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#fff', border: '1px solid #E5E5E5',
          borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 100, maxHeight: 240, overflowY: 'auto', marginTop: 4,
        }}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                height: 44, padding: '0 16px', fontSize: 15,
                color: '#333', display: 'flex', alignItems: 'center',
                cursor: 'pointer',
                background: opt.value === value ? '#F5F5F5' : 'transparent',
                fontWeight: opt.value === value ? 500 : 400,
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => { if (opt.value !== value) e.currentTarget.style.background = '#F5F5F5'; }}
              onMouseLeave={(e) => { if (opt.value !== value) e.currentTarget.style.background = 'transparent'; }}
            >
              <span>{opt.label}</span>
              {opt.value === value && <span style={{ color: '#000' }}>&#x2713;</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// A_disclosure — Terms acceptance gate
// ═══════════════════════════════════════════════════════
export function Disclosure({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="ob-screen" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <div style={{ padding: '0 20px', paddingTop: 8 }}>
        <BackBtn onClick={onBack} lang={lang} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8, paddingBottom: 120 }}>
        <h1 className="ob-title" style={{ marginBottom: 8, marginTop: 16 }}>
          {lang === 'fr' ? 'Avant de commencer' : 'Before you apply'}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
          {lang === 'fr'
            ? 'Veuillez lire et accepter les conditions suivantes avant de commencer votre demande.'
            : 'Please read and accept the following terms before starting your application.'}
        </p>

        <div style={{
          fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)',
          marginBottom: 20,
        }}>
          <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
            {lang === 'fr'
              ? 'Conditions de la demande de la Walmart Rewards Mastercard'
              : 'Walmart Rewards Mastercard application terms'}
          </p>
          <p style={{ marginBottom: 8 }}>
            {lang === 'fr'
              ? 'En continuant, vous acceptez une vérification de crédit, la collecte de renseignements personnels et les conditions de l\'entente du titulaire de carte sur walmartrewards.ca.'
              : 'By continuing you agree to a credit bureau check, collection of personal information, and the cardholder agreement terms at walmartrewards.ca.'}
          </p>
          <p style={{ marginBottom: 8 }}>
            {lang === 'fr'
              ? 'Vos renseignements personnels seront traités conformément à notre politique de confidentialité. Nous pouvons obtenir votre rapport de crédit et votre cote de crédit de un ou plusieurs bureaux de crédit.'
              : 'Your personal information will be handled in accordance with our privacy policy. We may obtain your credit report and credit score from one or more credit bureaus.'}
          </p>
          <p style={{ marginBottom: 8 }}>
            {lang === 'fr'
              ? 'L\'approbation de la carte est sous réserve de la vérification de l\'identité et de l\'évaluation du crédit. Les taux et les conditions sont susceptibles de changer.'
              : 'Card approval is subject to identity verification and credit assessment. Rates and terms are subject to change.'}
          </p>
          <p style={{ marginBottom: 8 }}>
            {lang === 'fr'
              ? 'Les taux d\'intérêt et les frais s\'appliquent à votre compte tel que décrit dans la déclaration de divulgation jointe à votre carte. Le taux d\'intérêt annuel pour les achats est de 19,99 %. Les avances de fonds sont assujetties à un taux distinct tel que divulgué.'
              : 'Interest rates and fees apply to your account as described in the disclosure statement enclosed with your card. The annual interest rate for purchases is 19.99%. Cash advances are subject to a separate rate as disclosed.'}
          </p>
          <p style={{ marginBottom: 8 }}>
            {lang === 'fr'
              ? 'Vous avez le droit d\'annuler cette demande à tout moment avant l\'émission de votre carte. Pour annuler, communiquez avec la Banque Fairstone du Canada au 1-888-331-6133.'
              : 'You have the right to cancel this application at any time before your card is issued. To cancel, contact Fairstone Bank of Canada at 1-888-331-6133.'}
          </p>
          <p style={{ marginBottom: 8 }}>
            {lang === 'fr'
              ? 'La Walmart Rewards Mastercard est émise par la Banque Fairstone du Canada en vertu d\'une licence de Mastercard International. Mastercard est une marque de commerce déposée de Mastercard International.'
              : 'The Walmart Rewards Mastercard is issued by Fairstone Bank of Canada pursuant to a license from Mastercard International. Mastercard is a registered trademark of Mastercard International.'}
          </p>
          <p>
            {lang === 'fr'
              ? 'En soumettant cette demande, vous confirmez que les renseignements fournis sont exacts et complets. La fourniture de renseignements inexacts peut entraîner l\'annulation de votre compte et peut être signalée aux bureaux de crédit.'
              : 'By submitting this application you confirm that the information provided is accurate and complete. Providing false information may result in cancellation of your account and may be reported to credit bureaus.'}
          </p>
        </div>

        <label
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            cursor: 'pointer', fontSize: 14, lineHeight: 1.4,
            color: 'var(--text-primary)',
          }}
          onClick={() => setAgreed(!agreed)}
        >
          <span style={{
            width: 22, height: 22, borderRadius: 4, flexShrink: 0, marginTop: 1,
            border: agreed ? 'none' : '2px solid var(--border)',
            background: agreed ? 'var(--accent)' : 'var(--surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}>
            {agreed && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          {lang === 'fr'
            ? 'J\'ai lu et j\'accepte les conditions'
            : 'I have read and agree to the terms'}
        </label>

        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => setShowTerms(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500,
              padding: 0, textDecoration: 'underline',
            }}
          >
            {lang === 'fr' ? 'Lire les conditions complètes' : 'Read full terms'}
          </button>
        </div>
      </div>

      <div style={{
        padding: '12px 20px',
        paddingBottom: 'calc(var(--nav-height) + 12px)',
        background: 'var(--surface)',
        borderTop: '0.5px solid var(--border)',
      }}>
        <button
          className="btn btn-primary"
          onClick={() => onNext()}
          disabled={!agreed}
          style={!agreed ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
        >
          {T.continue}
        </button>
      </div>

      {showTerms && (
        <div className="ob-modal-overlay">
          <div className="ob-modal-sheet">
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
              {lang === 'fr' ? 'Conditions complètes' : 'Full terms'}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'fr'
                ? 'Le document complet des conditions du titulaire de carte sera disponible sur walmartrewards.ca. Ce prototype utilise un contenu de remplacement.'
                : 'The full cardholder agreement document would be available at walmartrewards.ca. This prototype uses placeholder content.'}
            </p>
            <button className="btn btn-primary" onClick={() => setShowTerms(false)}>
              {T.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// A_intro — Apply intro
// ═══════════════════════════════════════════════════════
export function ApplyIntro({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [showDetails, setShowDetails] = useState(false);

  const benefits = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="#333" strokeWidth="1.5" fill="none" />
          <path d="M12 7V12L15 14" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      text: T.benefit1,
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#333" strokeWidth="1.5" fill="none" />
          <path d="M3 10H21" stroke="#333" strokeWidth="1.5" />
        </svg>
      ),
      text: T.benefit2,
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L15 8.5H22L16.5 13L18.5 20L12 15.5L5.5 20L7.5 13L2 8.5H9L12 2Z" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        </svg>
      ),
      text: T.benefit3,
    },
  ];

  return (
    <div className="ob-screen">
      <BackBtn onClick={onBack} lang={lang} />

      <h1 className="ob-title" style={{ marginBottom: 28 }}>{T.introTitle}</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32, width: '100%' }}>
        {benefits.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {b.icon}
            </div>
            <span style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.4 }}>{b.text}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={() => onNext()} style={{ marginBottom: 16 }}>
        {T.startApp}
      </button>

      <button
        onClick={() => setShowDetails(true)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500,
          padding: 8, alignSelf: 'center',
        }}
      >
        {T.seeDetails}
      </button>

      {/* Card details bottom sheet */}
      {showDetails && (
        <div className="ob-modal-overlay">
          <div className="ob-modal-sheet" style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, flexShrink: 0 }}>{T.detailsTitle}</h2>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
              {[
                { title: T.earnTitle, items: [T.earn1, T.earn2, T.earn3] },
                { title: T.bonusTitle, items: [T.bonus1, T.bonus2] },
                { title: T.featuresTitle, items: [T.feat1, T.feat2, T.feat3, T.feat4] },
                { title: T.redeemTitle, items: [T.redeem1, T.redeem2, T.redeem3] },
              ].map((section, si) => (
                <div key={si} style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 500, color: '#999',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    marginBottom: 8,
                  }}>
                    {section.title}
                  </div>
                  {section.items.map((item, ii) => (
                    <div key={ii} style={{
                      fontSize: 13, color: '#333', padding: '6px 0',
                      borderBottom: ii < section.items.length - 1 ? '0.5px solid #F0F0F0' : 'none',
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              ))}

              <div
                onClick={() => window.open('https://www.walmartrewards.ca', '_blank', 'noopener')}
                style={{
                  fontSize: 11, color: '#999', textAlign: 'center',
                  cursor: 'pointer', paddingTop: 4,
                }}
              >
                {T.termsFooter}
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowDetails(false)}
              style={{ flexShrink: 0 }}
            >
              {T.gotIt}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Address autocomplete suggestions ────────────────
const ADDRESS_SUGGESTIONS = [
  { street: '123 Queen St W', city: 'Toronto', province: 'ON', postal: 'M5V 1J2' },
  { street: '456 Sainte-Catherine St', city: 'Montr\u00e9al', province: 'QC', postal: 'H3B 1A8' },
  { street: '789 Robson St', city: 'Vancouver', province: 'BC', postal: 'V6Z 1A1' },
];

const PROVINCE_OPTIONS = [
  { value: 'AB', label: 'AB' }, { value: 'BC', label: 'BC' },
  { value: 'MB', label: 'MB' }, { value: 'NB', label: 'NB' },
  { value: 'NL', label: 'NL' }, { value: 'NS', label: 'NS' },
  { value: 'NT', label: 'NT' }, { value: 'NU', label: 'NU' },
  { value: 'ON', label: 'ON' }, { value: 'PE', label: 'PE' },
  { value: 'QC', label: 'QC' }, { value: 'SK', label: 'SK' },
  { value: 'YT', label: 'YT' },
];

const LocationPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

// ═══════════════════════════════════════════════════════
// A_personal — Personal information (Step 1 of 4)
// ═══════════════════════════════════════════════════════
export function PersonalInfo({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [form, setForm] = useState({
    name: 'Sarah Martin',
    dob: '1990-01-15',
    phone: '(416) 555-0123',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const canContinue = form.name.trim() && form.dob.trim() && form.phone.trim();

  const labelStyle = { fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 };

  const personalFields = [
    { id: 'name', label: T.fullName, type: 'text', key: 'name' },
    { id: 'dob', label: T.dob, type: 'text', key: 'dob', placeholder: 'YYYY-MM-DD' },
    { id: 'phone', label: T.phone, type: 'tel', key: 'phone' },
  ];

  return (
    <div className="ob-screen" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <div style={{ padding: '0 20px', paddingTop: 8 }}>
        <BackBtn onClick={onBack} lang={lang} />
        <SetupProgress steps={4} current={1} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8, paddingBottom: 120 }}>
        <h1 className="ob-title" style={{ marginBottom: 24, marginTop: 16 }}>{T.personalTitle}</h1>

        {/* Personal fields */}
        {personalFields.map((f) => (
          <div key={f.id} style={{ marginBottom: 14 }}>
            <label htmlFor={`personal-${f.id}`} style={labelStyle}>{f.label}</label>
            <input
              id={`personal-${f.id}`}
              type={f.type}
              className="input"
              value={form[f.key]}
              onChange={(e) => update(f.key, e.target.value)}
              placeholder={f.placeholder || ''}
            />
          </div>
        ))}
      </div>

      <div style={{
        padding: '12px 20px',
        paddingBottom: 'calc(var(--nav-height) + 12px)',
        background: 'var(--surface)',
        borderTop: '0.5px solid var(--border)',
      }}>
        <button
          className="btn btn-primary"
          onClick={() => onNext()}
          disabled={!canContinue}
          style={!canContinue ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
        >
          {T.sendCode}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// A_contact — Contact details (email + address)
// ═══════════════════════════════════════════════════════
export function ContactInfo({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [email, setEmail] = useState('sarah@example.com');

  // Address state
  const [addressMode, setAddressMode] = useState('search'); // 'search' | 'manual' | 'selected'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(false);
  const [addr, setAddr] = useState({ street: '', unit: '', city: '', province: '', postal: '' });
  const [postalTouched, setPostalTouched] = useState(false);
  const suggestionsRef = useRef(null);

  const updateAddr = (field, value) => setAddr((prev) => ({ ...prev, [field]: value }));

  const POSTAL_RE = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
  const postalValid = POSTAL_RE.test(addr.postal);
  const showPostalError = postalTouched && addr.postal.length > 0 && !postalValid;

  const formatPostal = (raw) => {
    const cleaned = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
    if (cleaned.length > 3) return cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
    return cleaned;
  };

  // Address complete check
  const addressComplete = addressMode === 'selected'
    ? true
    : (addr.street.trim() && addr.city.trim() && addr.province && postalValid);

  const canContinue = email.trim() && addressComplete;

  // Close suggestions on outside click
  useEffect(() => {
    if (!showSuggestions) return;
    const handle = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [showSuggestions]);

  const handleSearchInput = (val) => {
    setSearchQuery(val);
    setShowSuggestions(val.length >= 3);
  };

  const handleSelectSuggestion = (suggestion) => {
    setShowSuggestions(false);
    setSearchQuery('');
    setAddr({
      street: suggestion.street,
      unit: '',
      city: suggestion.city,
      province: suggestion.province,
      postal: suggestion.postal,
    });
    setAddressMode('selected');
    setSelectedCheck(true);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setAddr({ street: '', unit: '', city: '', province: '', postal: '' });
    setAddressMode('search');
    setSelectedCheck(false);
    setPostalTouched(false);
  };

  const handleToggleManual = () => {
    if (addressMode === 'manual') {
      setAddressMode('search');
    } else {
      setAddressMode('manual');
      setSearchQuery('');
      setShowSuggestions(false);
      setSelectedCheck(false);
      if (addressMode !== 'selected') {
        setAddr({ street: '', unit: '', city: '', province: '', postal: '' });
      }
    }
  };

  const labelStyle = { fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 };

  return (
    <div className="ob-screen" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <div style={{ padding: '0 20px', paddingTop: 8 }}>
        <BackBtn onClick={onBack} lang={lang} />
        <SetupProgress steps={4} current={1} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8, paddingBottom: 120 }}>
        <h1 className="ob-title" style={{ marginBottom: 8, marginTop: 16 }}>{T.contactTitle}</h1>
        <p className="ob-body" style={{ marginBottom: 24 }}>{T.contactBody}</p>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="contact-email" style={labelStyle}>{T.email}</label>
          <input
            id="contact-email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* ── Address section ── */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>{T.address}</label>

          {/* Search field — visible in search mode; read-only summary in selected mode */}
          {addressMode === 'selected' && (
            <div style={{
              position: 'relative', display: 'flex', alignItems: 'center',
              height: 48, padding: '0 36px 0 16px',
              border: '1px solid #E5E5E5', borderRadius: 8,
              background: '#F9F9F9', fontSize: 15, color: '#333',
            }}>
              {addr.street}, {addr.city}, {addr.province} {addr.postal}
              <span style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                display: 'flex', animation: 'scaleCheck 300ms ease-out',
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" fill="#16A34A"/>
                  <path d="M5.5 9L8 11.5L12.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          )}

          {addressMode === 'search' && (
            <div ref={suggestionsRef} style={{ position: 'relative' }}>
              <input
                type="text"
                className="input"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder={T.addressPlaceholder}
              />

              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: '#fff', border: '0.5px solid #E5E5E5',
                  borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  zIndex: 100, marginTop: 4, overflow: 'hidden',
                }}>
                  {ADDRESS_SUGGESTIONS.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectSuggestion(s)}
                      style={{
                        padding: '12px 16px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 10,
                        borderBottom: i < ADDRESS_SUGGESTIONS.length - 1 ? '0.5px solid #F0F0F0' : 'none',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#F9F9F9'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <LocationPin />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{s.street}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>{s.city}, {s.province} {s.postal}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Toggle link */}
          {addressMode !== 'selected' && (
            <button
              onClick={handleToggleManual}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--text-secondary)', padding: '8px 0 0',
                textDecoration: 'underline',
              }}
            >
              {addressMode === 'manual' ? T.searchForAddress : T.enterManually}
            </button>
          )}
        </div>

        {/* Structured address fields — visible after selection or in manual mode */}
        {(addressMode === 'selected' || addressMode === 'manual') && (
          <div style={{
            background: '#fff', border: '0.5px solid #E5E5E5',
            borderRadius: 10, marginBottom: 14, overflow: 'hidden',
          }}>
            {/* Street */}
            <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #F0F0F0' }}>
              <label style={{ ...labelStyle, marginBottom: 2 }}>{T.streetAddress}</label>
              <input
                type="text"
                className="input"
                value={addr.street}
                onChange={(e) => updateAddr('street', e.target.value)}
                style={{ border: 'none', padding: 0, height: 28, fontSize: 15 }}
              />
            </div>
            {/* Unit */}
            <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #F0F0F0' }}>
              <label style={{ ...labelStyle, marginBottom: 2 }}>{T.unitApt}</label>
              <input
                type="text"
                className="input"
                value={addr.unit}
                onChange={(e) => updateAddr('unit', e.target.value)}
                placeholder={T.unitAptPlaceholder}
                style={{ border: 'none', padding: 0, height: 28, fontSize: 15 }}
              />
            </div>
            {/* City */}
            <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #F0F0F0' }}>
              <label style={{ ...labelStyle, marginBottom: 2 }}>{T.city}</label>
              <input
                type="text"
                className="input"
                value={addr.city}
                onChange={(e) => updateAddr('city', e.target.value)}
                style={{ border: 'none', padding: 0, height: 28, fontSize: 15 }}
              />
            </div>
            {/* Province */}
            <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #F0F0F0' }}>
              <label style={{ ...labelStyle, marginBottom: 2 }}>{T.province}</label>
              <Select
                id="addr-province"
                value={addr.province}
                onChange={(v) => updateAddr('province', v)}
                options={PROVINCE_OPTIONS}
              />
            </div>
            {/* Postal code */}
            <div style={{ padding: '12px 16px' }}>
              <label style={{ ...labelStyle, marginBottom: 2 }}>{T.postalCode}</label>
              <input
                type="text"
                className="input"
                value={addr.postal}
                onChange={(e) => updateAddr('postal', formatPostal(e.target.value))}
                onBlur={() => setPostalTouched(true)}
                placeholder="A1A 1A1"
                maxLength={7}
                style={{ border: 'none', padding: 0, height: 28, fontSize: 15 }}
              />
              {showPostalError && (
                <div style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{T.postalCodeError}</div>
              )}
            </div>
          </div>
        )}

        {/* Reset link after selection */}
        {addressMode === 'selected' && (
          <button
            onClick={handleResetSearch}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: 'var(--text-secondary)', padding: '0 0 14px',
              textDecoration: 'underline',
            }}
          >
            {T.notYourAddress}
          </button>
        )}

        <style>{`@keyframes scaleCheck { from { transform: translateY(-50%) scale(0); } to { transform: translateY(-50%) scale(1); } }`}</style>
      </div>

      <div style={{
        padding: '12px 20px',
        paddingBottom: 'calc(var(--nav-height) + 12px)',
        background: 'var(--surface)',
        borderTop: '0.5px solid var(--border)',
      }}>
        <button
          className="btn btn-primary"
          onClick={() => onNext()}
          disabled={!canContinue}
          style={!canContinue ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
        >
          {T.continue}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// A_financial — Financial information (Step 2 of 4)
// ═══════════════════════════════════════════════════════
export function FinancialInfo({ onNext, onBack, lang, onIncomeSubmit }) {
  const T = i18n[lang] || i18n.en;
  const [form, setForm] = useState({
    income: '65000',
    employment: 'employed',
    housing: 'rent',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const employmentOptions = [
    { value: 'employed', label: T.employed },
    { value: 'self_employed', label: T.selfEmployed },
    { value: 'retired', label: T.retired },
    { value: 'student', label: T.student },
    { value: 'other', label: T.other },
  ];

  const housingOptions = [
    { value: 'own', label: T.own },
    { value: 'rent', label: T.rent },
    { value: 'other', label: T.other },
  ];

  return (
    <div className="ob-screen" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <div style={{ padding: '0 20px', paddingTop: 8 }}>
        <BackBtn onClick={onBack} lang={lang} />
        <SetupProgress steps={4} current={2} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8, paddingBottom: 120 }}>
        <h1 className="ob-title" style={{ marginBottom: 24, marginTop: 16 }}>{T.financialTitle}</h1>

        <div style={{ marginBottom: 14 }}>
          <label
            htmlFor="fin-income"
            style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
          >
            {T.income}
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: 14, color: 'var(--text-muted)',
            }}>$</span>
            <input
              id="fin-income"
              type="text"
              inputMode="numeric"
              className="input"
              value={form.income}
              onChange={(e) => update('income', e.target.value.replace(/\D/g, ''))}
              style={{ paddingLeft: 24 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label
            htmlFor="fin-employment"
            style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
          >
            {T.employment}
          </label>
          <Select
            id="fin-employment"
            value={form.employment}
            onChange={(v) => update('employment', v)}
            options={employmentOptions}
            lang={lang}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label
            htmlFor="fin-housing"
            style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
          >
            {T.housing}
          </label>
          <Select
            id="fin-housing"
            value={form.housing}
            onChange={(v) => update('housing', v)}
            options={housingOptions}
            lang={lang}
          />
        </div>
      </div>

      <div style={{
        padding: '12px 20px',
        paddingBottom: 'calc(var(--nav-height) + 12px)',
        background: 'var(--surface)',
        borderTop: '0.5px solid var(--border)',
      }}>
        <button className="btn btn-primary" onClick={() => {
          if (onIncomeSubmit) onIncomeSubmit(parseInt(form.income, 10) || 0);
          onNext();
        }}>
          {T.continue}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// A_create_password — Password creation (mandatory)
// ═══════════════════════════════════════════════════════
const passwordI18n = {
  en: {
    title: 'Create your password',
    sub: 'Create a password to access your account. You can set up Face ID and notification preferences once you\u2019re in.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    confirmLabel: 'Confirm password',
    req8: 'At least 8 characters',
    reqUpper: 'One uppercase letter',
    reqLower: 'One lowercase letter',
    reqNumber: 'One number',
    reqSpecial: 'One special character',
    mismatch: 'Passwords don\'t match',
    cta: 'Create password',
    back: 'Back',
  },
  fr: {
    title: 'Cr\u00e9ez votre mot de passe',
    sub: 'Cr\u00e9ez un mot de passe pour acc\u00e9der \u00e0 votre compte. Vous pourrez configurer Face ID et les pr\u00e9f\u00e9rences de notification une fois connect\u00e9.',
    emailLabel: 'Courriel',
    passwordLabel: 'Mot de passe',
    confirmLabel: 'Confirmer le mot de passe',
    req8: 'Au moins 8 caract\u00e8res',
    reqUpper: 'Une lettre majuscule',
    reqLower: 'Une lettre minuscule',
    reqNumber: 'Un chiffre',
    reqSpecial: 'Un caract\u00e8re sp\u00e9cial',
    mismatch: 'Les mots de passe ne correspondent pas',
    cta: 'Cr\u00e9er le mot de passe',
    back: 'Retour',
  },
};

export function CreatePassword({ onNext, onBack, lang, email = 'sarah@example.com' }) {
  const T = passwordI18n[lang] || passwordI18n.en;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showReqs, setShowReqs] = useState(false);

  const reqs = [
    { key: '8', label: T.req8, met: password.length >= 8 },
    { key: 'upper', label: T.reqUpper, met: /[A-Z]/.test(password) },
    { key: 'lower', label: T.reqLower, met: /[a-z]/.test(password) },
    { key: 'num', label: T.reqNumber, met: /\d/.test(password) },
    { key: 'special', label: T.reqSpecial, met: /[^A-Za-z0-9]/.test(password) },
  ];

  const allMet = reqs.every(r => r.met);
  const passwordsMatch = password === confirm && confirm.length > 0;
  const canContinue = allMet && passwordsMatch;

  return (
    <div className="ob-screen" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <div style={{ padding: '0 20px', paddingTop: 8 }}>
        <button
          onClick={onBack}
          style={{
            alignSelf: 'flex-start', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 13, color: 'var(--text-secondary)',
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {T.back}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8, paddingBottom: 120 }}>
        <h1 className="ob-title" style={{ marginBottom: 8, marginTop: 16 }}>{T.title}</h1>
        <p className="ob-body" style={{ marginBottom: 24 }}>{T.sub}</p>

        {/* Email (read-only) */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            {T.emailLabel}
          </label>
          <input type="email" className="input" value={email} disabled style={{ opacity: 0.6 }} />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            {T.passwordLabel}
          </label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowReqs(true)}
          />
        </div>

        {/* Requirements */}
        {showReqs && (
          <div style={{ marginBottom: 14, padding: '10px 14px', background: '#F9F9F9', borderRadius: 8 }}>
            {reqs.map(r => (
              <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 13 }}>
                <span style={{ color: r.met ? '#16A34A' : '#999', fontSize: 14 }}>{r.met ? '✓' : '○'}</span>
                <span style={{ color: r.met ? '#16A34A' : 'var(--text-secondary)' }}>{r.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Confirm password */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            {T.confirmLabel}
          </label>
          <input
            type="password"
            className="input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {confirm.length > 0 && !passwordsMatch && (
            <div style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{T.mismatch}</div>
          )}
        </div>
      </div>

      <div style={{
        padding: '12px 20px',
        paddingBottom: 'calc(var(--nav-height) + 12px)',
        background: 'var(--surface)',
        borderTop: '0.5px solid var(--border)',
      }}>
        <button
          className="btn btn-primary"
          onClick={() => onNext()}
          disabled={!canContinue}
          style={!canContinue ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
        >
          {T.cta}
        </button>
      </div>
    </div>
  );
}
