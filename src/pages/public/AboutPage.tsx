import { Link } from 'react-router-dom';
import { Users, Target, Heart, Award, ArrowRight } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { Container } from '@/components/layout';

const values = [
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Every decision we make starts with our customers in mind. Your satisfaction is our success.',
  },
  {
    icon: Award,
    title: 'Quality Excellence',
    description: 'We never compromise on quality. Premium products and expert care for every garment.',
  },
  {
    icon: Target,
    title: 'Reliability',
    description: 'We show up when we say we will. Consistent, dependable service you can count on.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We create jobs and support local communities. Growth that benefits everyone.',
  },
];

const team = [
  {
    name: 'Amina Ibrahim',
    role: 'Founder & CEO',
    image: '👩🏾‍💼',
  },
  {
    name: 'Chidi Okonkwo',
    role: 'Head of Operations',
    image: '👨🏾‍💼',
  },
  {
    name: 'Fatima Yusuf',
    role: 'Customer Success Lead',
    image: '👩🏾‍💻',
  },
  {
    name: 'Emmanuel Adebayo',
    role: 'Logistics Manager',
    image: '👨🏾‍🔧',
  },
];

export const AboutPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Our Story
            </h1>
            <p className="text-lg text-neutral-600">
              Born from a simple idea: laundry shouldn't steal your precious time. 
              We're on a mission to give Nigerians back their weekends.
            </p>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                Making Laundry Stress-Free Since 2022
              </h2>
              <div className="space-y-4 text-neutral-600">
                <p>
                  Washy started when our founder, Amina, found herself spending every weekend 
                  doing laundry instead of spending time with her family. She knew there had to 
                  be a better way.
                </p>
                <p>
                  What began as a small operation in Kaduna has grown into a trusted service 
                  serving thousands of customers across Nigeria. We've built a team of dedicated 
                  professionals who care about your clothes as much as you do.
                </p>
                <p>
                  Today, Washy isn't just about cleaning clothes—it's about giving you back your 
                  time. Time for family, friends, hobbies, and the things that truly matter.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl p-8 text-center">
              <div className="text-6xl mb-4">🧺</div>
              <h3 className="text-4xl font-bold text-neutral-900 mb-2">50,000+</h3>
              <p className="text-neutral-600">Orders delivered with love</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 bg-neutral-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Values</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} variant="default" className="bg-white">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-xl mb-4">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{value.title}</h3>
                <p className="text-neutral-600 text-sm">{value.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              The passionate people behind Washy
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-lg font-semibold text-neutral-900">{member.name}</h3>
                <p className="text-neutral-500">{member.role}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Experience Washy?
            </h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
              Join our growing community of happy customers
            </p>
            <Link to="/register">
              <Button 
                variant="secondary" 
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="bg-white text-primary-600 hover:bg-neutral-100"
              >
                Get Started Today
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
