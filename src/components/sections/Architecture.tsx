
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WORKFLOW_STEPS } from "@/lib/constants";

const Architecture = () => {
  return (
    <section id="architecture" className="py-24 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              System Architecture
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Internal Workflow Pipeline
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Transparent view into how NovaPilot processes your requests and generates production-ready code.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute left-8 top-16 hidden h-full w-0.5 bg-gradient-to-b from-primary via-purple-500 to-green-500 lg:block" 
                 style={{ height: 'calc(100% - 8rem)' }} />

            <div className="space-y-8">
              {WORKFLOW_STEPS.map((step, index) => (
                <Card key={step.id} className="relative overflow-hidden lg:ml-20">
                  {/* Step Number Circle */}
                  <div className={`absolute -left-10 top-6 hidden h-16 w-16 items-center justify-center rounded-full text-white lg:flex ${step.color}`}>
                    <span className="text-2xl">{step.icon}</span>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 lg:space-x-0">
                      {/* Mobile Step Circle */}
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full text-white lg:hidden ${step.color}`}>
                        <span className="text-lg">{step.icon}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Step {step.id}
                          </Badge>
                          <h3 className="text-xl font-semibold">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tech Stack Grid */}
          <div className="mt-24">
            <div className="mb-12 text-center">
              <h3 className="mb-4 text-2xl font-bold">Technology Stack</h3>
              <p className="text-muted-foreground">
                Built on modern, production-ready technologies for optimal performance and developer experience.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "React 18", desc: "Latest features & concurrent rendering", icon: "⚛️" },
                { name: "TypeScript", desc: "Type safety & better DX", icon: "📘" },
                { name: "Tailwind CSS", desc: "Utility-first CSS framework", icon: "🎨" },
                { name: "Supabase", desc: "Full-stack backend solution", icon: "🚀" }
              ].map((tech) => (
                <Card key={tech.name} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-3">{tech.icon}</div>
                    <h4 className="font-semibold mb-2">{tech.name}</h4>
                    <p className="text-sm text-muted-foreground">{tech.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;
