import { ClassCard } from "./components/classCard";
import Link from "next/link";
import { classNames } from "./utils/constants";
import { ModeToggle } from "./components/theme-toggle";

export default function Page(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">
          Choose Your Class
        </h1>
        <ModeToggle />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {classNames.map((className: string) => (
          <div
            key={className}
            className="w-full max-w-[350px] transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <Link href={`/${className.toLowerCase()}`} className="block">
              <ClassCard className={className} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
