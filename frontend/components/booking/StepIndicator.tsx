import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookingStep } from '@/types';

interface StepIndicatorProps {
  steps: BookingStep[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0" />
        
        {/* Active line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-600 z-0 transition-all duration-300" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.id || index} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors duration-300",
                  isCompleted ? "bg-teal-600 border-teal-600 text-white" : 
                  isCurrent ? "bg-amber-500 border-amber-500 text-white shadow-md" : 
                  "bg-white border-slate-300 text-slate-400"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : (index + 1)}
              </div>
              
              <span 
                className={cn(
                  "absolute -bottom-6 text-xs whitespace-nowrap hidden md:block font-medium",
                  isCurrent ? "text-slate-900" : isCompleted ? "text-teal-700" : "text-slate-500"
                )}
              >
                {/* Assuming step.title could be a string or localized object, handle string for simplicity or render */}
                {typeof step.title === 'string' ? step.title : (step.title as any)?.en}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
