import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LinkCardProps {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

const LinkCard: React.FC<LinkCardProps> = ({
  href,
  icon,
  children,
  className,
  external = false,
}) => {
  const content = (
    <div className="link-card group border-l-2 border-primary">
      <span className="flex items-center">
        {icon && <span className="mr-4 text-barbershop-gold">{icon}</span>}
        <span className="text-lg font-medium">{children}</span>
      </span>
      <span className="text-barbershop-gold">→</span>
    </div>
  );

  if (external) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <Link href={href} className={cn(className)}>
      {content}
    </Link>
  );
};

export default LinkCard;
