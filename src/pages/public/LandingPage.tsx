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
  Zap
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { Container } from '@/components/layout';
import { motion, useScroll, useTransform } from 'framer-motion';

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
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Clock,
    title: '24-Hour Turnaround',
    description: 'Quick service without compromising quality. Express options available for urgent needs.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Garment Protection',
    description: 'Your clothes are in safe hands. We use premium detergents and handle with care.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Star,
    title: 'Quality Guarantee',
    description: "Not satisfied? We'll re-clean for free. Your satisfaction is our priority.",
    gradient: 'from-green-500 to-emerald-500',
  },
];

const services = [
  {
    name: 'Wash & Fold',
    description: 'Professional washing and perfectly folded clothes ready to wear.',
    price: 'From ₦200/item',
    image: '🧺',
    color: 'from-primary-50 to-primary-100/50',
    borderColor: 'border-primary-100'
  },
  {
    name: 'Dry Cleaning',
    description: 'Expert care for delicate fabrics, suits, and special garments.',
    price: 'From ₦500/item',
    image: '👔',
    color: 'from-accent-50 to-accent-100/50',
    borderColor: 'border-accent-100'
  },
  {
    name: 'Iron & Press',
    description: 'Crisp, wrinkle-free results that look professionally pressed.',
    price: 'From ₦150/item',
    image: '👕',
    color: 'from-secondary-50 to-secondary-100/50',
    borderColor: 'border-secondary-100'
  },
  {
    name: 'Express Service',
    description: 'Same-day or next-day delivery when you need it urgently.',
    price: '+50% express fee',
    image: '⚡',
    color: 'from-warning-50 to-warning-100/50',
    borderColor: 'border-warning-100'
  },
];

export const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center bg-neutral-50 overflow-hidden">
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
          <div className="absolute inset-0 bg-neutral-900/80" />
          
          {/* Gradient Accents */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-neutral-900/50 to-neutral-950/80 mix-blend-multiply" />
          
          {/* Animated Blobs */}
          <div className="absolute -top-[500px] -left-[500px] w-[1000px] h-[1000px] bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-[-200px] w-[800px] h-[800px] bg-accent-600/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
        
        <Container className="relative z-10 py-20 lg:py-32">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-8 shadow-xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-500"></span>
              </span>
              <span className="text-sm font-medium text-white tracking-wide">Nigeria's #1 Premium Laundry Service</span>
            </motion.div>
            
            {/* Headline */}
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-bold !text-white mb-8 leading-[1.1] tracking-tight text-shadow-lg">
              Laundry Done <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary-300 via-primary-100 to-white bg-clip-text text-transparent">
                The Right Way.
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p variants={itemVariants} className="text-xl md:text-2xl !text-neutral-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light text-shadow">
              Experience the ultimate convenience with our premium pickup & delivery service. 
              Professional care for your clothes, reclaimed time for you.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto min-w-[200px] h-14 text-lg shadow-primary-500/25 shadow-xl hover:shadow-2xl">
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
            <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-x-12 gap-y-6">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-white">15k+</span>
                <span className="text-sm text-neutral-400 uppercase tracking-wider">Happy Users</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-white">4.9/5</span>
                <span className="text-sm text-neutral-400 uppercase tracking-wider">Rating</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-white">24h</span>
                <span className="text-sm text-neutral-400 uppercase tracking-wider">Turnaround</span>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Social Proof Strip */}
      <div className="py-8 bg-neutral-50 border-b border-neutral-100">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {['Paystack', 'Flutterwave', 'Interswitch', 'PiggyVest', 'Cowrywise'].map((brand) => (
              <span key={brand} className="text-xl font-bold text-neutral-400 hover:text-primary-600 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </Container>
      </div>

      {/* Offline First Feature - Highly Requested */}
      <section className="py-20 bg-white relative overflow-hidden">
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
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-[2rem] transform rotate-3 blur-lg opacity-50" />
                <Card className="relative p-8 border-0 shadow-2xl bg-white overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <WifiOff className="w-32 h-32" />
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary-100 rounded-2xl text-primary-600">
                      <Smartphone className="w-8 h-8" />
                    </div>
                    <div className="p-3 bg-secondary-100 rounded-2xl text-secondary-600">
                      <Zap className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">No Internet? No Problem.</h3>
                  <p className="text-neutral-600 text-lg mb-6 leading-relaxed">
                    Washy is built with an <strong>Offline First</strong> architecture. This means you can open the app, view your orders, and even schedule new ones without an active internet connection. We sync everything automatically when you're back online.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Works flawlessly in low connectivity areas',
                      'Instant app loading speeds',
                      'Never lose your order data',
                      'Syncs automatically in background'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-neutral-700">
                        <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0" />
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
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
                Designed for the <br />
                <span className="text-primary-600">Real World</span>
              </h2>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                We understand that connectivity isn't always perfect. That's why we built Washy to be robust, reliable, and always accessible, ensuring your laundry experience is smooth regardless of your network status.
              </p>
              <Button variant="outline" size="lg" className="border-primary-600 text-primary-600 hover:bg-primary-50">
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
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              Redefining Laundry Excellence
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
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
                  className="group relative h-full bg-white border border-neutral-100 hover:border-primary-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-900/5"
                  padding="lg"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`} />
                  
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.gradient} text-white rounded-2xl mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-32 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <Badge variant="info" className="mb-4">Our Services</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
                Comprehensive Care for <br />
                <span className="text-primary-600">Every Fabric</span>
              </h2>
              <p className="text-xl text-neutral-600">
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
                className="group bg-white rounded-3xl p-2 border border-neutral-200 hover:border-primary-200 transition-colors duration-300"
              >
                <div className={`h-full p-6 lb:p-8 rounded-2xl bg-gradient-to-br ${service.color} border border-transparent group-hover:${service.borderColor} transition-all duration-300`}>
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{service.image}</div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">{service.name}</h3>
                  <p className="text-neutral-600 mb-8 leading-relaxed text-sm md:text-base">{service.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-lg text-neutral-900">{service.price}</span>
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                    >
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-neutral-50">
        <Container>
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-4">Simple Process</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              Laundry Day, Solved in 3 Steps
            </h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-primary-100 via-primary-300 to-primary-100" />
            
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
                  className="relative bg-neutral-50 pt-8 group"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border-4 border-primary-50 rounded-full flex items-center justify-center z-10 shadow-sm group-hover:border-primary-100 group-hover:scale-110 transition-all duration-300">
                    <span className="text-lg font-bold text-primary-600">{item.step}</span>
                  </div>
                  
                  <div className="text-center px-6">
                    <div className="text-6xl mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">{item.icon}</div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-600/10 rounded-full blur-[100px]" />
        </div>

        <Container className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-900 to-primary-950 rounded-3xl p-8 md:p-16 text-center border border-white/10 shadow-2xl overflow-hidden relative"
          >
            <div 
              className="absolute top-0 left-0 w-full h-full opacity-10" 
              style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Ready for a Laundry-Free Life?
              </h2>
              <p className="text-xl text-primary-100 mb-10 leading-relaxed">
                Join thousands of satisfied customers who have taken back their free time. 
                Get 20% off your first order when you sign up today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 text-lg font-bold shadow-lg shadow-secondary-900/20">
                    Claim Your Layout
                  </Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 text-lg border-white/20 text-white hover:bg-white/10 hover:border-white/40">
                    Contact Sales
                  </Button>
                </Link>
              </div>
              
              <p className="mt-6 text-sm text-white/50">
                No credit card required for account creation.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
