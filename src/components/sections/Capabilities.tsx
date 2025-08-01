
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CAPABILITIES } from "@/lib/constants";
import { CheckCircle } from "lucide-react";

const Capabilities = () => {
  return (
    <section id="capabilities" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              Core Superpowers
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              What Makes NovaPilot Special
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Advanced AI capabilities that go beyond code generation to deliver production-ready applications with exceptional design and architecture.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {CAPABILITIES.map((capability, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
                
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-3xl">{capability.icon}</div>
                    <CardTitle className="text-xl">{capability.title}</CardTitle>
                  </div>
                  <p className="text-muted-foreground">{capability.description}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {capability.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Success Metrics */}
          <div className="mt-24">
            <div className="mb-12 text-center">
              <h3 className="mb-4 text-2xl font-bold">Success Metrics & Outcomes</h3>
              <p className="text-muted-foreground">
                When you work with NovaPilot, expect these results every time.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Fully functional applications in first iteration",
                "Modern, accessible UI that users love",
                "Clean, maintainable code that scales",
                "Database and auth properly configured",
                "Mobile responsive across all devices",
                "Production deployment ready to share"
              ].map((metric, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{metric}</span>
                    </div>
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

export default Capabilities;
