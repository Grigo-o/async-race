import type { JSX, FormEvent } from 'react';
import { MAX_CAR_NAME_LENGTH } from '../../../utils/constants';

interface CarFormProps {
  name: string;
  color: string;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  disabled?: boolean;
}

function CarForm({
  name,
  color,
  onNameChange,
  onColorChange,
  onSubmit,
  submitLabel,
  disabled = false,
}: CarFormProps): JSX.Element {
  const trimmedName = name.trim();
  const isNameValid = trimmedName.length > 0 && trimmedName.length <= MAX_CAR_NAME_LENGTH;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isNameValid) {
      onSubmit();
    }
  };

  return (
    <form className="car-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        placeholder="Car name"
        maxLength={MAX_CAR_NAME_LENGTH}
        onChange={(event) => onNameChange(event.target.value)}
        disabled={disabled}
      />
      <input
        type="color"
        value={color}
        onChange={(event) => onColorChange(event.target.value)}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !isNameValid}>
        {submitLabel}
      </button>
      {!isNameValid && trimmedName.length > 0 && (
        <span className="form-error">Name must be 1-{MAX_CAR_NAME_LENGTH} characters</span>
      )}
    </form>
  );
}

export default CarForm;
