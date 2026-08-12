import { useState, type FormEvent } from "react";
import { VIN_MAX_LENGTH } from "../../utils/vinValidation";

interface VinFormProps {
  onSubmit: (vin: string) => void;
  isLoading: boolean;
}

export function VinForm({ onSubmit, isLoading }: VinFormProps) {
  const [vin, setVin] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(vin);
  };

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit}
      aria-label="Форма розшифровки VIN-коду"
    >
      <label
        className="text-sm font-semibold uppercase tracking-wider text-text-muted"
        htmlFor="vin-input"
      >
        VIN-код автомобіля
      </label>
      <div className="flex flex-wrap gap-2 max-[480px]:flex-col">
        <input
          id="vin-input"
          className="min-w-0 flex-1 basis-[260px] rounded border border-border bg-bg px-3.5 py-3 font-mono text-base tracking-wider text-text placeholder:font-sans placeholder:tracking-normal placeholder:text-text-muted focus-visible:border-accent focus-visible:outline-none"
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="напр. 1FTFW1CT5DFC10312"
          maxLength={VIN_MAX_LENGTH}
          value={vin}
          onChange={(event) => setVin(event.target.value.toUpperCase())}
          aria-describedby="vin-form-hint"
        />
        <button
          className="flex-none whitespace-nowrap rounded bg-accent px-5 py-3 text-sm font-bold text-[#0c211d] transition-colors hover:not-disabled:bg-[#26bfa8] disabled:cursor-not-allowed disabled:opacity-60 max-[480px]:w-full"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Розшифровка…" : "Розшифрувати"}
        </button>
      </div>
      <p id="vin-form-hint" className="text-xs text-text-muted">
        {vin.length}/{VIN_MAX_LENGTH} символів
      </p>
    </form>
  );
}
