import { useState, useCallback } from 'react';
import { Welcome, Apply, Language, ExistingCardVerify } from './onboarding/Stage1';
import { VerifyIntro, IDScan, SelfieCheck, CreditConsent, OTPVerify, Processing } from './onboarding/Stage2';
import { Approval, VirtualCard, WhatsNext } from './onboarding/Stage3';
import { BiometricSetup, PINSetup, EStatement, NotificationPrefs } from './onboarding/Stage4';

export function OnboardingFlow({ onComplete, language, setLanguage }) {
  const [step, setStep] = useState('welcome');
  const [path, setPath] = useState(null);
  const [history, setHistory] = useState([]);

  const goTo = useCallback((nextStep) => {
    setHistory(prev => [...prev, step]);
    setStep(nextStep);
  }, [step]);

  const goBack = useCallback((target) => {
    if (target === 'welcome') {
      setStep('welcome');
      setHistory([]);
      setPath(null);
      return;
    }
    setHistory(prev => {
      const newHist = [...prev];
      const prevStep = newHist.pop();
      if (prevStep) setStep(prevStep);
      return newHist;
    });
  }, []);

  const lang = language;

  switch (step) {
    case 'welcome':
      return (
        <div>
          <Welcome
            onNext={(selectedPath) => {
              setPath(selectedPath);
              if (selectedPath === 'apply') {
                goTo('apply');
              } else if (selectedPath === 'existing') {
                goTo('language');
              } else {
                // approved
                goTo('language');
              }
            }}
            lang={lang}
          />
        </div>
      );

    case 'apply':
      return (
        <div>
          <Apply
            onNext={() => goTo('language')}
            onBack={() => goBack()}
            lang={lang}
          />
        </div>
      );

    case 'language':
      return (
        <div>
          <Language
            onNext={(selectedLang) => {
              setLanguage(selectedLang);
              if (path === 'existing') {
                goTo('existingCardVerify');
              } else {
                goTo('verifyIntro');
              }
            }}
            lang={lang}
          />
        </div>
      );

    case 'existingCardVerify':
      return (
        <div>
          <ExistingCardVerify
            onNext={() => onComplete(false)}
            onBack={(target) => goBack(target)}
            lang={lang}
          />
        </div>
      );

    case 'verifyIntro':
      return (
        <div>
          <VerifyIntro
            onNext={() => goTo('idScan')}
            onBack={() => goBack()}
            lang={lang}
          />
        </div>
      );

    case 'idScan':
      return (
        <div>
          <IDScan
            onNext={() => goTo('selfie')}
            onBack={() => goBack()}
            lang={lang}
          />
        </div>
      );

    case 'selfie':
      return (
        <div>
          <SelfieCheck
            onNext={() => goTo('creditConsent')}
            onBack={() => goBack()}
            lang={lang}
          />
        </div>
      );

    case 'creditConsent':
      return (
        <div>
          <CreditConsent
            onNext={() => goTo('otpVerify')}
            onBack={() => goBack()}
            lang={lang}
          />
        </div>
      );

    case 'otpVerify':
      return (
        <div>
          <OTPVerify
            onNext={() => goTo('processing')}
            onBack={() => goBack()}
            lang={lang}
          />
        </div>
      );

    case 'processing':
      return (
        <div>
          <Processing
            onNext={() => goTo('approval')}
            lang={lang}
          />
        </div>
      );

    case 'approval':
      return (
        <div>
          <Approval
            onNext={() => goTo('virtualCard')}
            lang={lang}
          />
        </div>
      );

    case 'virtualCard':
      return (
        <div>
          <VirtualCard
            onNext={() => goTo('whatsNext')}
            onBack={() => goBack()}
            lang={lang}
          />
        </div>
      );

    case 'whatsNext':
      return (
        <div>
          <WhatsNext
            onNext={() => goTo('biometric')}
            onBack={() => goBack()}
            lang={lang}
          />
        </div>
      );

    case 'biometric':
      return (
        <div>
          <BiometricSetup
            onNext={() => goTo('pin')}
            onBack={() => goBack()}
            lang={lang}
          />
        </div>
      );

    case 'pin':
      return (
        <div>
          <PINSetup
            onNext={() => goTo('estatement')}
            onBack={() => goBack()}
            lang={lang}
          />
        </div>
      );

    case 'estatement':
      return (
        <div>
          <EStatement
            onNext={() => goTo('notifications')}
            onBack={() => goBack()}
            lang={lang}
          />
        </div>
      );

    case 'notifications':
      return (
        <div>
          <NotificationPrefs
            onNext={() => onComplete(true)}
            onBack={() => goBack()}
            lang={lang}
          />
        </div>
      );

    default:
      return <div>Unknown step: {step}</div>;
  }
}
