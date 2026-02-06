import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { Container } from '@/components/layout';
import { formatCurrency } from '@/lib/utils';
import { useComponentLogger } from '@/hooks';
import { motion } from 'framer-motion';
import type { Service } from '@/types';

// Hardcoded data as requested by the user
const SERVICES_DATA: Service[] = [
  {
    _id: '1',
    slug: 'wash-and-fold',
    description: 'Everyday laundry washed, dried, and folded.',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Wash & Fold",
    serviceType: "wash_and_fold",
    category: "laundry",
    estimatedDuration: { standard: 48, express: 24 },
    isExpressAvailable: true,
    sortOrder: 1,
    pricing: [
      { garmentType: "shirt", basePrice: 200, expressMultiplier: 1.5 },
      { garmentType: "trouser", basePrice: 250, expressMultiplier: 1.5 },
      { garmentType: "dress", basePrice: 400, expressMultiplier: 1.5 },
      { garmentType: "skirt", basePrice: 300, expressMultiplier: 1.5 },
      { garmentType: "towel", basePrice: 150, expressMultiplier: 1.5 },
      { garmentType: "bedsheet", basePrice: 400, expressMultiplier: 1.5 },
      { garmentType: "underwear", basePrice: 100, expressMultiplier: 1.5 }
    ]
  },
  {
    _id: '2',
    slug: 'wash-and-iron',
    description: 'Washed, dried, and professionally ironed.',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Wash & Iron",
    serviceType: "wash_and_iron",
    category: "laundry",
    estimatedDuration: { standard: 48, express: 24 },
    isExpressAvailable: true,
    sortOrder: 2,
    pricing: [
      { garmentType: "shirt", basePrice: 300, expressMultiplier: 1.5 },
      { garmentType: "trouser", basePrice: 350, expressMultiplier: 1.5 },
      { garmentType: "dress", basePrice: 500, expressMultiplier: 1.5 },
      { garmentType: "skirt", basePrice: 400, expressMultiplier: 1.5 },
      { garmentType: "native_attire", basePrice: 600, expressMultiplier: 1.5 },
      { garmentType: "jacket", basePrice: 500, expressMultiplier: 1.5 }
    ]
  },
  {
    _id: '3',
    slug: 'dry-cleaning',
    description: 'Professional care for delicate fabrics.',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Dry Cleaning",
    serviceType: "dry_clean",
    category: "dry_cleaning",
    estimatedDuration: { standard: 72, express: 48 },
    isExpressAvailable: true,
    sortOrder: 3,
    pricing: [
      { garmentType: "suit", basePrice: 2500, expressMultiplier: 1.5 },
      { garmentType: "dress", basePrice: 1500, expressMultiplier: 1.5 },
      { garmentType: "jacket", basePrice: 1800, expressMultiplier: 1.5 },
      { garmentType: "native_attire", basePrice: 2000, expressMultiplier: 1.5 },
      { garmentType: "duvet", basePrice: 3500, expressMultiplier: 1.5 },
      { garmentType: "curtain", basePrice: 2000, expressMultiplier: 1.5 },
      { garmentType: "blanket", basePrice: 2500, expressMultiplier: 1.5 }
    ]
  },
  {
    _id: '4',
    slug: 'iron-only',
    description: 'Professional pressing for clean clothes.',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Iron Only",
    serviceType: "iron_only",
    category: "laundry",
    estimatedDuration: { standard: 24, express: 6 },
    isExpressAvailable: true,
    sortOrder: 4,
    pricing: [
      { garmentType: "shirt", basePrice: 150, expressMultiplier: 1.5 },
      { garmentType: "trouser", basePrice: 150, expressMultiplier: 1.5 },
      { garmentType: "dress", basePrice: 200, expressMultiplier: 1.5 },
      { garmentType: "skirt", basePrice: 150, expressMultiplier: 1.5 },
      { garmentType: "native_attire", basePrice: 300, expressMultiplier: 1.5 },
      { garmentType: "suit", basePrice: 400, expressMultiplier: 1.5 }
    ]
  },
  {
    _id: '5',
    slug: 'starch-and-iron',
    description: 'Crisp finish for your formal wear.',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Starch & Iron",
    serviceType: "starch",
    category: "laundry",
    estimatedDuration: { standard: 48, express: 24 },
    isExpressAvailable: true,
    sortOrder: 5,
    pricing: [
      { garmentType: "native_attire", basePrice: 800, expressMultiplier: 1.5 },
      { garmentType: "shirt", basePrice: 400, expressMultiplier: 1.5 },
      { garmentType: "trouser", basePrice: 400, expressMultiplier: 1.5 }
    ]
  },
  {
    _id: '6',
    slug: 'express-service',
    description: 'Quick turnaround for urgent needs.',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Express Service",
    serviceType: "express",
    category: "laundry",
    estimatedDuration: { standard: 12, express: 6 },
    isExpressAvailable: false,
    sortOrder: 6,
    pricing: [
      { garmentType: "shirt", basePrice: 450, expressMultiplier: 1 },
      { garmentType: "trouser", basePrice: 500, expressMultiplier: 1 },
      { garmentType: "dress", basePrice: 700, expressMultiplier: 1 },
      { garmentType: "native_attire", basePrice: 900, expressMultiplier: 1 },
      { garmentType: "suit", basePrice: 3500, expressMultiplier: 1 }
    ]
  }
];

export const ServicesPage = () => {
  useComponentLogger('ServicesPage');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-background py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <Badge variant="primary" className="mb-4">Professional Care</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Premium laundry and cleaning services tailored to your needs.
              Transparent pricing, clear timelines, and exceptional quality.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Services List */}
      <section className="py-20 bg-background">
        <Container>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {SERVICES_DATA.map((service, idx) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  className="flex flex-col h-full border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  padding="lg"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{service.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-lg">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{service.estimatedDuration.standard}h</span>
                        </div>
                        {service.isExpressAvailable && (
                          <Badge variant="warning" size="sm" className="bg-warning/10 text-warning border-none">
                            Express: {service.estimatedDuration.express}h
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Table */}
                  <div className="flex-1 bg-muted/50 rounded-xl p-4 border border-border/50">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b border-border/50">
                          <th className="pb-2 font-medium">Item</th>
                          <th className="pb-2 font-medium text-right">Standard</th>
                          {service.isExpressAvailable && (
                            <th className="pb-2 font-medium text-right">Express</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {service.pricing.map((price) => (
                          <tr key={price.garmentType} className="group hover:bg-background transition-colors">
                            <td className="py-2.5 font-medium text-foreground capitalize group-hover:text-primary transition-colors">
                              {price.garmentType.replace('_', ' ')}
                            </td>
                            <td className="py-2.5 text-right text-muted-foreground">
                              {formatCurrency(price.basePrice)}
                            </td>
                            {service.isExpressAvailable && (
                              <td className="py-2.5 text-right font-medium text-warning">
                                {formatCurrency(price.basePrice * price.expressMultiplier)}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <Link to="/login" className="block">
                      <Button variant="outline" className="w-full justify-between group">
                        Book {service.name}
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Premium Standard
            </h2>
            <p className="text-muted-foreground">Every service includes our signature care package</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              'Free Pickup & Delivery',
              'Premium Detergents',
              'Garment Inspection',
              'Quality Guarantee',
              'Real-time Tracking',
              'Eco-friendly Options',
              'Stain Treatment',
              'Packaging',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <span className="text-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background relative overflow-hidden">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[40px] md:rounded-[60px] p-10 md:p-20 text-center text-primary-foreground shadow-2xl relative overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-full h-full">
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-foreground/10 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-16 h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mb-8 mx-auto backdrop-blur-md border border-primary-foreground/10"
              >
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-black text-primary-foreground mb-6 tracking-tight">
                Experience the <span className="text-primary-foreground/80 italic">Washy</span> Difference
              </h2>

              <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 font-medium leading-relaxed">
                Join thousands of satisfied customers who trust Washy with their entire wardrobe.
                Premium care is just a tap away.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    size="xl"
                    className="w-full sm:w-auto h-18 px-12 text-xl font-extrabold bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-none shadow-xl shadow-primary/40 transition-all hover:scale-105 active:scale-95"
                  >
                    Get Started Now
                  </Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button
                    variant="glass"
                    size="xl"
                    className="w-full sm:w-auto h-18 px-12 text-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    Contact Support
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-bold text-primary-foreground/60 uppercase tracking-widest">Available in 12 Cities</span>
                </div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-primary-foreground/20" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-foreground/40" />
                  <span className="text-xs font-bold text-primary-foreground/60 uppercase tracking-widest">Satisfaction Guaranteed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default ServicesPage;
