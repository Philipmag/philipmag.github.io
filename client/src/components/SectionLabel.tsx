interface SectionLabelProps {
  number?: string;
  label: string;
}

export default function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {number && (
        <span className="font-mono font-bold text-sm text-primary/70 tracking-wider">
          {number}
        </span>
      )}
      <div className="h-px w-8 bg-primary/40" />
      <span className="text-sm font-semibold text-primary tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}
