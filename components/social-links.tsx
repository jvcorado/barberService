import Link from "next/link";
import React from "react";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface SocialLinksProps {
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  whatsappUrl?: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label }) => {
  if (!href) return null;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="social-icon text-secondary bg-white/60 p-1 rounded-full hover:text-primary transition"
    >
      {icon}
    </Link>
  );
};

const SocialLinks: React.FC<SocialLinksProps> = ({
  instagramUrl,
  facebookUrl,
  tiktokUrl,
  whatsappUrl,
}) => {
  return (
    <div className="flex justify-center gap-4 mt-6 mb-8">
      {instagramUrl && (
        <SocialLink
          href={instagramUrl}
          label="Instagram"
          icon={
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      )}

      {facebookUrl && (
        <SocialLink
          href={facebookUrl}
          label="Facebook"
          icon={
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      )}

      {tiktokUrl && (
        <SocialLink
          href={tiktokUrl}
          label="TikTok"
          icon={
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      )}

      {whatsappUrl && (
        <SocialLink
          href={whatsappUrl}
          label="WhatsApp"
          icon={
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M17.6 6.2A8.3 8.3 0 0 0 3.2 12.8c0 1.7.5 3.4 1.3 4.8l-1.2 4.2 4.5-1.2a8.2 8.2 0 0 0 4.1 1.1 8.3 8.3 0 0 0 8.3-8.3 8.2 8.2 0 0 0-2.6-6.2zm-5.9 12.7a6.9 6.9 0 0 1-3.6-1l-.2-.2-2.5.6.7-2.4-.2-.2a6.8 6.8 0 0 1-1.3-4 6.8 6.8 0 0 1 11.7-4.7 6.8 6.8 0 0 1 2 4.8 6.8 6.8 0 0 1-6.6 7zm3.7-5.1c-.2-.1-1.3-.7-1.5-.7-.2-.1-.4-.1-.5.1-.2.2-.7.7-.8.9-.2.1-.3.1-.5 0-.7-.3-1.2-.6-1.7-1.2-.1-.2.1-.3.2-.3l.4-.5c.1-.1.1-.2.2-.4 0-.1 0-.3-.1-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.2-.2.2-.7.7-.7 1.8s.8 2.1.9 2.2c.1.1 1.4 2.2 3.4 3.1.5.2.8.3 1.1.4.5.2.9.1 1.2.1.4-.1 1.1-.5 1.3-.9.2-.5.2-.9.1-1 0-.1-.3-.1-.5-.2z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      )}
    </div>
  );
};

export default SocialLinks;
