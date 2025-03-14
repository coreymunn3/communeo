import Link from "next/link";

interface PageProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

/**
 * This component is a layout that displays a title and subtitle message on the full page
 * @param props PageProps
 * @returns A Component
 */
const FullPageMessageLayout = ({
  icon,
  title,
  subtitle,
  children,
}: PageProps) => {
  return (
    <div className="min-h-[90vh] flex flex-col justify-center items-center px-4">
      <div className="text-center flex flex-col justify-center items-center space-y-8">
        {/* Reddit-like Logo */}
        {icon}

        {/* Title */}
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {title}
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-slate-400 mb-8">
          {subtitle}
        </p>

        {children}
      </div>
    </div>
  );
};
export default FullPageMessageLayout;
