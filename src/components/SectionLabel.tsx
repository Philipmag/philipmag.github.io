interface SectionLabelProps {
  number?: string;
  label: string;
}
export default function SectionLabel({ label }: SectionLabelProps) {
  return <div className="section-label">{label}</div>;
}
