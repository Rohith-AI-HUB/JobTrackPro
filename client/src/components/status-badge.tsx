import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "applied" | "interviewing" | "offer" | "rejected" | "Not Taking" | "Viewed Resume";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    applied: {
      label: "Applied",
      className: "bg-blue-100 text-blue-800",
    },
    interviewing: {
      label: "Interviewing", 
      className: "bg-orange-100 text-orange-800",
    },
    offer: {
      label: "Offer",
      className: "bg-green-100 text-green-800",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800",
    },
    Not_Taking: {
      label: "Not Taking",
      className: "bg-gray-100 text-gray-800",
    },
    Viewed_Resume: {
      label: "Viewed Resume",
      className: "bg-purple-100 text-purple-800",
    },
  };

  const config = statusConfig[status.replace(" ", "_") as keyof typeof statusConfig];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
