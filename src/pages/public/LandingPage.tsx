import { Link } from 'react-router-dom';
import {
  Truck,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Play,
  WifiOff,
  CheckCircle2,
  Smartphone,
  Zap,
  MapPin
} from 'lucide-react';
import { Button, Card, Badge, Spinner } from '@/components/ui';
import { Container } from '@/components/layout';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useBranches } from '@/hooks';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
} as const;

const features = [
  {
    icon: Truck,
    title: 'Free Pickup & Delivery',
    description: 'We come to you! Schedule convenient pickups and deliveries right at your doorstep.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Clock,
    title: '24-Hour Turnaround',
    description: 'Quick service without compromising quality. Express options available for urgent needs.',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon: Shield,
    title: 'Garment Protection',
    description: 'Your clothes are in safe hands. We use premium detergents and handle with care.',
    gradient: 'from-orange-500/20 to-red-500/20',
  },
  {
    icon: Star,
    title: 'Quality Guarantee',
    description: "Not satisfied? We'll re-clean for free. Your satisfaction is our priority.",
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
];

const services = [
  {
    name: 'Wash & Fold',
    description: 'Professional washing and perfectly folded clothes ready to wear.',
    price: 'From ₦200/item',
    image: '🧺',
    color: 'from-primary/10 to-primary/5',
    borderColor: 'border-primary/20'
  },
  {
    name: 'Dry Cleaning',
    description: 'Expert care for delicate fabrics, suits, and special garments.',
    price: 'From ₦500/item',
    image: '👔',
    color: 'from-accent/10 to-accent/5',
    borderColor: 'border-accent/20'
  },
  {
    name: 'Iron & Press',
    description: 'Crisp, wrinkle-free results that look professionally pressed.',
    price: 'From ₦150/item',
    image: '👕',
    color: 'from-secondary/10 to-secondary/5',
    borderColor: 'border-secondary/20'
  },
  {
    name: 'Express Service',
    description: 'Same-day or next-day delivery when you need it urgently.',
    price: '+50% express fee',
    image: '⚡',
    color: 'from-warning/10 to-warning/5',
    borderColor: 'border-warning/20'
  },
];

export const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const { data: branches, isLoading: isLoadingBranches } = useBranches();

  // Featured branches for display
  const featuredBranches = branches?.filter(b => b.isActive).slice(0, 3) || [];

  return (
    <div className="overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center bg-background overflow-hidden">
        {/* Background Gradients */}
        {/* Background Video & Gradients */}
        <div className="absolute inset-0 z-0">
          {/* Video Element */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-40"
              poster="https://images.unsplash.com/photo-1582735689369-26b976c534dd?q=80&w=2070"
            >
              <source src="https://videos.pexels.com/video-files/6192775/6192775-uhd_2560_1440_25fps.mp4" type="video/mp4" />
              {/* Fallback to image if video fails or while loading */}
              <img
                src="https://images.unsplash.com/photo-1582735689369-26b976c534dd?q=80&w=2070"
                alt="Laundry Service"
                className="w-full h-full object-cover"
              />
            </video>
          </div>

          {/* Dark Overlay for Contrast */}
          <div className="absolute inset-0 bg-background/80" />

          {/* Gradient Accents */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-background/50 to-background/80 mix-blend-multiply" />

          {/* Animated Blobs */}
          <div className="absolute -top-[500px] -left-[500px] w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-[-200px] w-[800px] h-[800px] bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <Container className="relative z-10 py-20 lg:py-32">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/10 backdrop-blur-md rounded-full border border-foreground/10 mb-8 shadow-xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
              <span className="text-sm font-medium text-foreground tracking-wide">Nigeria's #1 Premium Laundry Service</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight [text-shadow:_0_4px_24px_rgba(0,0,0,0.1)]"
            >
              Laundry Done <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent drop-shadow-sm">
                The Right Way.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Experience the ultimate convenience with our premium pickup & delivery service.
              Professional care for your clothes, reclaimed time for you.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto min-w-[200px] h-14 text-lg shadow-primary/25 shadow-xl hover:shadow-2xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button size="lg" variant="glass" className="w-full sm:w-auto min-w-[200px] h-14 text-lg">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  See How It Works
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-border flex flex-wrap justify-center gap-x-12 gap-y-6">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-foreground">15k+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Happy Users</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-foreground">4.9/5</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Rating</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-foreground">24h</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Turnaround</span>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Social Proof Strip */}
      <div className="py-8 bg-muted/30 border-b border-border">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {['Paystack', 'Flutterwave', 'Interswitch', 'PiggyVest', 'Cowrywise'].map((brand) => (
              <span key={brand} className="text-xl font-bold text-muted-foreground hover:text-primary transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </Container>
      </div>

      {/* Offline First Feature - Highly Requested */}
      <section className="py-20 bg-background relative overflow-hidden">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[2rem] transform rotate-3 blur-lg opacity-50" />
                <Card className="relative p-8 border-0 shadow-2xl bg-card overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <WifiOff className="w-32 h-32" />
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                      <Smartphone className="w-8 h-8" />
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                      <Zap className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">No Internet? No Problem.</h3>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    Washy is built with an <strong>Offline First</strong> architecture. This means you can open the app, view your orders, and even schedule new ones without an active internet connection. We sync everything automatically when you're back online.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Works flawlessly in low connectivity areas',
                      'Instant app loading speeds',
                      'Never lose your order data',
                      'Syncs automatically in background'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-foreground">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <Badge variant="primary" className="mb-4">Technology</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                Designed for the <br />
                <span className="text-primary">Real World</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                We understand that connectivity isn't always perfect. That's why we built Washy to be robust, reliable, and always accessible, ensuring your laundry experience is smooth regardless of your network status.
              </p>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                Learn About Our Tech
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-neutral-50 relative overflow-hidden">
        <Container>
          <div className="text-center mb-20">
            <Badge variant="primary" className="mb-4">Why Choose Us</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Redefining Laundry Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We combine cutting-edge technology with expert care to deliver a service that's
              simply unmatched.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card
                  className="group relative h-full bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
                  padding="lg"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`} />

                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.gradient} text-white rounded-2xl mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-32 bg-background relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <Badge variant="info" className="mb-4">Our Services</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                Comprehensive Care for <br />
                <span className="text-primary">Every Fabric</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                From your daily wear to your most delicate couture, we handle it all with precision.
              </p>
            </div>
            <Link to="/services">
              <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Pricing
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="group bg-card rounded-3xl p-2 border border-border hover:border-primary/30 transition-colors duration-300"
              >
                <div className={`h-full p-6 lb:p-8 rounded-2xl bg-gradient-to-br ${service.color} border border-transparent group-hover:${service.borderColor} transition-all duration-300`}>
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{service.image}</div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{service.name}</h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-sm md:text-base">{service.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-lg text-foreground">{service.price}</span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm"
                    >
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Local Branches Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <Container>
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <Badge variant="primary" className="mb-4">Local Presence</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                Operating in Your <br />
                <span className="text-primary">Neighborhood</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                With multiple branches across the city, we ensure fast turnaround and personalized service.
              </p>
            </div>
            <Link to="/register">
              <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Join Our Network
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {isLoadingBranches ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-64 rounded-3xl bg-neutral-100 animate-pulse" />
              ))
            ) : featuredBranches.length > 0 ? (
              featuredBranches.map((branch, idx) => (
                <motion.div
                  key={branch._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={(branch as any).image || `https://images.unsplash.com/photo-1545173168-9f1947eebb8f?q=80&w=800`}
                        alt={branch.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="success" size="sm" className="bg-success text-success-foreground border-none shadow-lg">Open Now</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">{branch.address.city}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{branch.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-1">{branch.address.street}, {branch.address.area}</p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-neutral-100 overflow-hidden">
                              <img src={`https://i.pravatar.cc/100?img=${i + idx * 5}`} alt="User" />
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">100+ Customers served here</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 py-12 text-center bg-card rounded-3xl border-2 border-dashed border-border">
                <p className="text-muted-foreground">Expanding to more locations soon!</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-neutral-50">
        <Container>
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-4">Simple Process</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Laundry Day, Solved in 3 Steps
            </h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  step: '01',
                  title: 'Schedule Pickup',
                  description: "Book instantly via app or web. We'll be at your door at your chosen time.",
                  icon: '📱'
                },
                {
                  step: '02',
                  title: 'Expert Cleaning',
                  description: 'We wash, dry, fold, and press using eco-friendly products and techniques.',
                  icon: '✨'
                },
                {
                  step: '03',
                  title: 'Fast Delivery',
                  description: 'Fresh, neatly packaged clothes delivered back to you in as little as 24 hours.',
                  icon: '🚚'
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.5 }}
                  className="relative bg-background pt-8 group"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-card border-4 border-primary/10 rounded-full flex items-center justify-center z-10 shadow-sm group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
                    <span className="text-lg font-bold text-primary">{item.step}</span>
                  </div>

                  <div className="text-center px-6">
                    <div className="text-6xl mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">{item.icon}</div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-background relative overflow-hidden">
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[40px] md:rounded-[60px] p-10 md:p-24 text-center text-primary-foreground shadow-2xl overflow-hidden relative"
          >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-foreground/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            {/* Subtle Texture Overlay */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
            />

            <div className="relative z-10 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-20 h-20 bg-primary-foreground/20 rounded-3xl flex items-center justify-center mb-10 mx-auto backdrop-blur-md border border-primary-foreground/20 shadow-xl"
              >
                <Zap className="w-10 h-10 text-primary-foreground fill-current" />
              </motion.div>

              <h2 className="text-4xl md:text-7xl font-black text-primary-foreground mb-8 tracking-tight leading-[1.1]">
                Ready for a <br className="hidden sm:block" />
                <span className="text-primary-foreground/80 italic">Laundry-Free</span> Life?
              </h2>

              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-14 leading-relaxed font-medium max-w-2xl mx-auto opacity-90">
                Join thousands of satisfied customers who have taken back their free time.
                Get <span className="text-secondary font-bold">20% off</span> your first order today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    size="xl"
                    className="w-full sm:w-auto h-20 px-12 text-2xl font-black bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-none shadow-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    Claim Your Discount
                  </Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button
                    size="xl"
                    variant="glass"
                    className="w-full sm:w-auto h-20 px-12 text-2xl font-bold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>

              <div className="mt-14 flex items-center justify-center gap-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-muted overflow-hidden shadow-lg">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-primary-foreground/80 font-bold uppercase tracking-widest ml-2">
                  15,000+ Active Users • Instant Activation
                </p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
