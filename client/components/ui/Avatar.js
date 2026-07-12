import Image from "next/image";

/**
 * Reusable avatar — shows photo if available, else initial letter.
 * @param {string} src - avatar URL
 * @param {string} name - user name (for fallback initial + alt text)
 * @param {string} className - wrapper className (controls size/shape)
 * @param {string} textClassName - className for the fallback letter
 */
export default function Avatar({ src, name, className = "", textClassName = "" }) {
  const initial = name?.[0]?.toUpperCase() ?? "U";
  return (
    <div className={`relative overflow-hidden gradient-primary ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={name ?? "User avatar"}
          fill
          sizes="128px"
          className="object-cover"
          unoptimized
        />
      ) : (
        <span className={`absolute inset-0 flex items-center justify-center font-extrabold text-primary-foreground ${textClassName}`}>
          {initial}
        </span>
      )}
    </div>
  );
}
