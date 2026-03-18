import { useState, useEffect, useRef } from 'react';
import { SetupProgress } from '../../components/SetupProgress';

// ─── i18n ───────────────────────────────────────────────
const i18n = {
  en: {
    back: 'Back',
    // A_intro
    introTitle: 'Apply for your Walmart Rewards Mastercard',
    benefit1: '1.25% back on every Walmart purchase',
    benefit2: 'No annual fee',
    benefit3: 'Up to $25 welcome bonus',
    startApp: 'Start application',
    seeDetails: 'See full card details',
    detailsTitle: 'Card Details',
    detailsBody: 'Full card terms and conditions will be available here.',
    close: 'Close',
    // A_personal
    personalTitle: 'Personal information',
    fullName: 'Full name',
    dob: 'Date of birth',
    phone: 'Phone number',
    email: 'Email',
    address: 'Home address',
    postalCode: 'Postal code',
    postalCodeError: 'Please enter a valid Canadian postal code (e.g. M5V 1J2)',
    continue: 'Continue',
    step1of4: 'Step 1 of 4',
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
    benefit1: '1,25\u00a0% de remise sur chaque achat Walmart',
    benefit2: 'Aucuns frais annuels',
    benefit3: 'Jusqu\u2019\u00e0 25\u00a0$ de bonus de bienvenue',
    startApp: 'Commencer la demande',
    seeDetails: 'Voir les d\u00e9tails de la carte',
    detailsTitle: 'D\u00e9tails de la carte',
    detailsBody: 'Les conditions g\u00e9n\u00e9rales compl\u00e8tes de la carte seront disponibles ici.',
    close: 'Fermer',
    personalTitle: 'Renseignements personnels',
    fullName: 'Nom complet',
    dob: 'Date de naissance',
    phone: 'Num\u00e9ro de t\u00e9l\u00e9phone',
    email: 'Courriel',
    address: 'Adresse du domicile',
    postalCode: 'Code postal',
    postalCodeError: 'Veuillez entrer un code postal canadien valide (p. ex. M5V 1J2)',
    continue: 'Continuer',
    step1of4: '\u00c9tape 1 de 4',
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8 }}>
        <h1 className="ob-title" style={{ marginBottom: 8, marginTop: 16 }}>
          {lang === 'fr' ? 'Avant de commencer' : 'Before you apply'}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
          {lang === 'fr'
            ? 'Veuillez lire et accepter les conditions suivantes avant de commencer votre demande.'
            : 'Please read and accept the following terms before starting your application.'}
        </p>

        <div style={{
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          padding: 16, maxHeight: 220, overflowY: 'auto',
          fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)',
          background: 'var(--bg)', marginBottom: 20,
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
          <p>
            {lang === 'fr'
              ? 'L\'approbation de la carte est sous réserve de la vérification de l\'identité et de l\'évaluation du crédit. Les taux et les conditions sont susceptibles de changer.'
              : 'Card approval is subject to identity verification and credit assessment. Rates and terms are subject to change.'}
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

      {/* Card details modal */}
      {showDetails && (
        <div className="ob-modal-overlay">
          <div className="ob-modal-sheet">
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{T.detailsTitle}</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              {T.detailsBody}
            </p>
            <button className="btn btn-primary" onClick={() => setShowDetails(false)}>
              {T.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// A_personal — Personal information (Step 1 of 4)
// ═══════════════════════════════════════════════════════
export function PersonalInfo({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [form, setForm] = useState({
    name: 'Sarah Martin',
    dob: '1990-01-15',
    phone: '(416) 555-0123',
    email: 'sarah@example.com',
    address: '123 Queen St W, Toronto, ON',
    postalCode: 'M5V 1J2',
  });
  const [postalTouched, setPostalTouched] = useState(false);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const POSTAL_RE = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
  const postalValid = POSTAL_RE.test(form.postalCode);
  const showPostalError = postalTouched && !postalValid;

  const formatPostal = (raw) => {
    const cleaned = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
    if (cleaned.length > 3) return cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
    return cleaned;
  };

  const fieldDefs = [
    { id: 'name', label: T.fullName, type: 'text', key: 'name' },
    { id: 'dob', label: T.dob, type: 'text', key: 'dob', placeholder: 'YYYY-MM-DD' },
    { id: 'phone', label: T.phone, type: 'tel', key: 'phone' },
    { id: 'email', label: T.email, type: 'email', key: 'email' },
    { id: 'address', label: T.address, type: 'text', key: 'address' },
  ];

  return (
    <div className="ob-screen" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <div style={{ padding: '0 20px', paddingTop: 8 }}>
        <BackBtn onClick={onBack} lang={lang} />
        <SetupProgress steps={4} current={1} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8 }}>
        <h1 className="ob-title" style={{ marginBottom: 24, marginTop: 16 }}>{T.personalTitle}</h1>

        {fieldDefs.map((f) => (
          <div key={f.id} style={{ marginBottom: 14 }}>
            <label
              htmlFor={`personal-${f.id}`}
              style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
            >
              {f.label}
            </label>
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

        {/* Postal code with validation */}
        <div style={{ marginBottom: 14 }}>
          <label
            htmlFor="personal-postalCode"
            style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
          >
            {T.postalCode}
          </label>
          <input
            id="personal-postalCode"
            type="text"
            className={`input ${showPostalError ? 'error' : ''}`}
            value={form.postalCode}
            onChange={(e) => update('postalCode', formatPostal(e.target.value))}
            onBlur={() => setPostalTouched(true)}
            placeholder="A1A 1A1"
            autoComplete="postal-code"
            maxLength={7}
          />
          {showPostalError && (
            <div className="field-error">{T.postalCodeError}</div>
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
          disabled={!postalValid}
          style={!postalValid ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
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
export function FinancialInfo({ onNext, onBack, lang }) {
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8 }}>
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
        <button className="btn btn-primary" onClick={() => onNext()}>
          {T.continue}
        </button>
      </div>
    </div>
  );
}
