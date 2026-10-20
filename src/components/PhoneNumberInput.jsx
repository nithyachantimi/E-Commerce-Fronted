import React, { useMemo, useRef, useState } from 'react';
import { PhoneInput as InternationalPhoneInput, defaultCountries, parseCountry } from 'react-international-phone';
import { ChevronDown, Search } from 'lucide-react';
import 'react-international-phone/style.css';

const countries = defaultCountries.map(parseCountry);

function countryFlag(iso2) {
  return [...iso2.toUpperCase()].map((letter) => String.fromCodePoint(letter.charCodeAt(0) + 127397)).join('');
}

export const PhoneNumberInput = ({
  id = 'phoneNumber',
  label = 'Mobile Number',
  phoneRegion = 'IN',
  value = '',
  onChange,
  onCountryChange,
  error,
  required = false,
  helperText,
}) => {
  const phoneInputRef = useRef(null);
  const searchRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selected = countries.find((country) => country.iso2 === phoneRegion.toLowerCase()) || countries.find((country) => country.iso2 === 'in');
  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return countries;
    return countries.filter(({ name, iso2, dialCode }) =>
      name.toLowerCase().includes(query) || iso2.includes(query) || `+${dialCode}`.includes(query),
    );
  }, [search]);

  const chooseCountry = (country) => {
    phoneInputRef.current?.setCountry(country.iso2);
    onCountryChange?.({ dialCode: `+${country.dialCode}`, region: country.iso2.toUpperCase() });
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="phone-field">
      <label className="phone-field__label" htmlFor={id}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      <div className={`phone-field__control${error ? ' phone-field__control--error' : ''}`}>
        <button
          type="button"
          className="phone-field__country-button"
          aria-label={`Country: ${selected.name}, +${selected.dialCode}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-country-options`}
          onClick={() => {
            setIsOpen((open) => !open);
            setTimeout(() => searchRef.current?.focus(), 0);
          }}
        >
          <span aria-hidden="true">{countryFlag(selected.iso2)}</span>
          <span>+{selected.dialCode}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </button>
        {isOpen && (
          <div className="phone-field__menu">
            <div className="phone-field__search">
              <Search size={15} aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => { if (event.key === 'Escape') setIsOpen(false); }}
                placeholder="Search countries or calling codes"
                aria-label="Search countries or calling codes"
              />
            </div>
            <div id={`${id}-country-options`} className="phone-field__options" role="listbox" aria-label="Countries">
              {filteredCountries.map((country) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={country.iso2 === selected.iso2}
                  className="phone-field__option"
                  key={country.iso2}
                  onClick={() => chooseCountry(country)}
                >
                  <span aria-hidden="true">{countryFlag(country.iso2)}</span>
                  <span>{country.name}</span>
                  <span className="phone-field__dial">+{country.dialCode}</span>
                </button>
              ))}
              {filteredCountries.length === 0 && <p className="phone-field__empty">No countries found.</p>}
            </div>
          </div>
        )}
        <InternationalPhoneInput
          ref={phoneInputRef}
          defaultCountry={selected.iso2}
          value={value}
          onChange={(phone, meta) => {
            onChange?.(phone, meta.country.iso2.toUpperCase());
            onCountryChange?.({ dialCode: `+${meta.country.dialCode}`, region: meta.country.iso2.toUpperCase() });
          }}
          hideDropdown
          inputProps={{
            id,
            required,
            autoComplete: 'tel',
            'aria-label': label,
            'aria-invalid': Boolean(error),
            'aria-describedby': error ? `${id}-error` : helperText ? `${id}-help` : undefined,
          }}
          inputClassName="phone-field__input"
        />
      </div>
      {error ? <span id={`${id}-error`} className="phone-field__message" role="alert">{error}</span> :
        helperText ? <span id={`${id}-help`} className="phone-field__helper">{helperText}</span> : null}
    </div>
  );
};
