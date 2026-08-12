import { Link } from "react-router-dom";
import type { VehicleVariable } from "../../types/vin";

interface VariableCardProps {
  variable: VehicleVariable;
}

export function VariableCard({ variable }: VariableCardProps) {
  return (
    <li className="border-b border-border last:border-b-0">
      <Link
        to={`/variables/${variable.ID}`}
        className="flex items-baseline gap-4 px-4 py-3 text-text no-underline hover:bg-surface-raised hover:no-underline"
      >
        <span className="min-w-[2.5em] flex-none font-mono text-xs text-text-muted">
          #{variable.ID}
        </span>
        <span className="font-medium">{variable.Name}</span>
      </Link>
    </li>
  );
}
