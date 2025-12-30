import { UserPlus, ImagePlus, CreditCard, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up for free in under 60 seconds with just your email",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: ImagePlus,
    title: "Add Your Product",
    description: "Upload photos, add details, and set your price",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: CreditCard,
    title: "Pay ₹300",
    description: "One-time listing fee. No hidden charges, no commissions",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: MessageCircle,
    title: "Get Leads on WhatsApp",
    description: "Buyers contact you directly. Close deals your way",
    color: "bg-accent/10 text-accent",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            How It Works
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Start selling in 4 simple steps. No complicated processes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="absolute top-16 left-0 right-0 hidden h-0.5 bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div 
                key={step.title} 
                className="relative text-center animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground lg:static lg:mx-auto lg:mb-4">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`mx-auto mb-4 mt-6 lg:mt-0 flex h-16 w-16 items-center justify-center rounded-2xl ${step.color} shadow-soft`}>
                  <step.icon className="h-8 w-8" />
                </div>

                {/* Content */}
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
