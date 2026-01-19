import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { Container } from '@/components/layout';
import { formatCurrency } from '@/lib/utils';
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
  const [activeCategory, setActiveCategory] = useState<string>('all');

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <Container>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <Badge variant="primary" className="mb-4">Professional Care</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 tracking-tight">
              Our Services
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Premium laundry and cleaning services tailored to your needs. 
              Transparent pricing, clear timelines, and exceptional quality.
            </p>
          </div>
        </Container>
      </section>

      {/* Services List */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {SERVICES_DATA.map((service) => (
              <Card 
                key={service.name} 
                className="flex flex-col h-full border border-neutral-100 hover:border-primary-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                padding="lg"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">{service.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-neutral-500">
                      <div className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-lg">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span>{service.estimatedDuration.standard}h</span>
                      </div>
                      {service.isExpressAvailable && (
                        <Badge variant="warning" size="sm" className="bg-warning-50 text-warning-700 border-none">
                          Express: {service.estimatedDuration.express}h
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Pricing Table */}
                <div className="flex-1 bg-neutral-50/50 rounded-xl p-4 border border-neutral-100/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-neutral-400 border-b border-neutral-200/50">
                        <th className="pb-2 font-medium">Item</th>
                        <th className="pb-2 font-medium text-right">Standard</th>
                        {service.isExpressAvailable && (
                          <th className="pb-2 font-medium text-right">Express</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {service.pricing.map((price) => (
                        <tr key={price.garmentType} className="group hover:bg-white transition-colors">
                          <td className="py-2.5 font-medium text-neutral-700 capitalize group-hover:text-primary-700 transition-colors">
                            {price.garmentType.replace('_', ' ')}
                          </td>
                          <td className="py-2.5 text-right text-neutral-600">
                            {formatCurrency(price.basePrice)}
                          </td>
                          {service.isExpressAvailable && (
                            <td className="py-2.5 text-right font-medium text-warning-600">
                              {formatCurrency(price.basePrice * price.expressMultiplier)}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <Link to="/login" className="block">
                    <Button variant="outline" className="w-full justify-between group">
                      Book {service.name}
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Premium Standard
            </h2>
            <p className="text-neutral-500">Every service includes our signature care package</p>
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
              <div key={benefit} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-success-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                </div>
                <span className="text-neutral-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545173168-9f1947eebb8f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <Container>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to experience the difference?
            </h2>
            <p className="text-neutral-400 mb-10 text-lg">
              Join thousands of satisfied customers who trust Washy with their wardrobe.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button 
                  size="xl"
                  className="bg-white text-neutral-900 hover:bg-neutral-100 border-none min-w-[200px]"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="xl"
                  className="border-neutral-700 text-white hover:bg-neutral-800 hover:border-neutral-600 min-w-[200px]"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ServicesPage;
