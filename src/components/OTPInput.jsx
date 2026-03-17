import { useRef, useState } from 'react';
import '../onboarding.css';

export function OTPInput({ length = 6, onComplete }) {
  const [values, setValues] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const focusInput = (index) => {
    if (index >= 0 && index < length && inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

  const handleChange = (index, e) => {
    const val = e.target.value;

    // Only allow single digit
    if (val && !/^\d$/.test(val)) return;

    const next = [...values];
    next[index] = val;
    setValues(next);

    if (val && index < length - 1) {
      focusInput(index + 1);
    }

    // Check completion
    if (val && next.every((v) => v !== '')) {
      onComplete?.(next.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (values[index]) {
        const next = [...values];
        next[index] = '';
        setValues(next);
      } else if (index > 0) {
        const next = [...values];
        next[index - 1] = '';
        setValues(next);
        focusInput(index - 1);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight') {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    const next = [...values];
    for (let i = 0; i < length; i++) {
      next[i] = pasted[i] || '';
    }
    setValues(next);

    // Focus the next empty or last box
    const nextEmpty = next.findIndex((v) => v === '');
    focusInput(nextEmpty === -1 ? length - 1 : nextEmpty);

    if (next.every((v) => v !== '')) {
      onComplete?.(next.join(''));
    }
  };

  return (
    <div className="otp-container">
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          className={`otp-box${val ? ' filled' : ''}`}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}
