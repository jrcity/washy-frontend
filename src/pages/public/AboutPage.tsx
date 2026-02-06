import { Link } from 'react-router-dom';
import { Users, Target, Heart, Award, ArrowRight } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { Container } from '@/components/layout';
import { motion } from 'framer-motion';

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
      <section className="bg-gradient-to-br from-primary/10 to-background py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <Badge variant="primary" className="mb-4">Our Journey</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
              Born from a simple idea: laundry shouldn't steal your precious time.
              We're on a mission to give Nigerians back their weekends.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Making Laundry Stress-Free Since 2022
              </h2>
              <div className="space-y-4 text-muted-foreground">
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
            <div className="bg-card rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden group border border-border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-50" />
              <div className="relative z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">🧺</div>
                <h3 className="text-6xl font-extrabold text-foreground mb-2 tracking-tighter">50,000+</h3>
                <p className="text-primary text-lg font-semibold uppercase tracking-widest">Orders delivered with love</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} variant="default" className="bg-card">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl mb-4">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-20 bg-background">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Washy
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                className="text-center group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-7xl mb-6 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 filter drop-shadow-xl">{member.image}</div>
                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-muted-foreground font-medium">{member.role}</p>
              </motion.div>
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
            className="bg-secondary rounded-[40px] md:rounded-[60px] p-10 md:p-20 text-center text-secondary-foreground shadow-2xl relative overflow-hidden"
          >
            {/* Background Texture */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: 'radial-gradient(circle, #000000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, rotate: -10 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                className="w-16 h-16 bg-secondary-foreground/20 rounded-2xl flex items-center justify-center mb-8 mx-auto backdrop-blur-md border border-secondary-foreground/20"
              >
                <Heart className="w-8 h-8 text-secondary-foreground fill-current" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-black text-secondary-foreground mb-6 tracking-tight">
                Ready to Experience <br className="hidden sm:block" />
                <span className="text-secondary-foreground/80">Washy</span> Excellence?
              </h2>

              <p className="text-xl text-secondary-foreground/90 mb-12 font-medium leading-relaxed opacity-90">
                Join our growing community of happy customers and reclaim your weekends today.
                We handle the dirty work, you enjoy your life.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    size="xl"
                    className="w-full sm:w-auto h-18 px-12 text-xl font-extrabold bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90 border-none shadow-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    Get Started Today
                  </Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button
                    variant="glass"
                    size="xl"
                    className="w-full sm:w-auto h-18 px-12 text-xl border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 backdrop-blur-sm font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    Find Out More
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
