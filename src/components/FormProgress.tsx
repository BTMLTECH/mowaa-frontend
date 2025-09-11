import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: string;
  description: string;
}

interface FormProgressProps {
  currentSection: number;
  sections: Section[];
}

export const FormProgress: React.FC<FormProgressProps> = ({ currentSection, sections }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center flex-1">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                  index < currentSection
                    ? "bg-success text-success-foreground shadow-glow"
                    : index === currentSection
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index < currentSection ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="ml-3 hidden md:block">
                <h3
                  className={cn(
                    "text-sm font-medium",
                    index <= currentSection ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {section.title}
                </h3>
              </div>
            </div>
            {index < sections.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-all duration-300",
                  index < currentSection ? "bg-success" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Mobile section title */}
      <div className="md:hidden text-center">
        <h3 className="text-lg font-medium text-foreground">
          {sections[currentSection].title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {sections[currentSection].description}
        </p>
      </div>
    </div>
  );
};