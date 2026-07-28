import {
  FlaskConical, Beaker, Droplets, Microscope, Bug, Dna, Wind, Activity,
  BarChart3, TestTube2, Stethoscope, ShieldCheck, BadgeCheck, Workflow,
  HeartPulse, AlertTriangle, ScanLine, type LucideIcon,
} from "lucide-react";

const byCategory: Record<string, LucideIcon> = {
  "ИХЛА": FlaskConical,
  "Биохимия": Beaker,
  "Гемостаз": Droplets,
  "Гематология": Microscope,
  "Микробиология": Bug,
  "ПЦР": Dna,
  "Аллергология": Wind,
  "КЩС": Activity,
  "ВЭЖХ": BarChart3,
  "Клинический анализ": TestTube2,
  "Генетика": Dna,
  "Функциональная диагностика": Stethoscope,
  "Биодеконтаминация": ShieldCheck,
  "Контроль качества": BadgeCheck,
  "Автоматизированная лаборатория": Workflow,
  "Иммуногематология": HeartPulse,
  "Токсикология": AlertTriangle,
  "Клиническая диагностика": FlaskConical,
  "Скрининг": ScanLine,
};

export function categoryIcon(category?: string): LucideIcon {
  return (category && byCategory[category]) || FlaskConical;
}
