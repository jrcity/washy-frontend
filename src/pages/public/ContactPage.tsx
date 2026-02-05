import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    Send,
    Clock,
    Headphones,
    Zap,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import { Button, Input, Card, Badge } from '@/components/ui';
import { Container } from '@/components/layout';
import { Link } from 'react-router-dom';

interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const ContactPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>();

    const onSubmit = async (data: ContactForm) => {
        // Simulated form submission
        console.log('Form data:', data);
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert('Thank you for your message! We will get back to you soon.');
    };

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-50 to-white py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center relative z-10"
                    >
                        <Badge variant="primary" className="mb-6 px-4 py-1.5 text-sm uppercase tracking-wider font-bold">Get In Touch</Badge>
                        <h1 className="text-5xl md:text-7xl font-black text-neutral-900 mb-8 tracking-tight leading-[1.1]">
                            We're Here <br />
                            <span className="text-primary-600 italic">For You.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-500 leading-relaxed font-medium">
                            Have questions or need assistance? Our team is ready to help you reclaim your time.
                        </p>
                    </motion.div>
                </Container>
            </section>

            {/* Main Content Section */}
            <section className="py-20 relative">
                <Container>
                    <div className="grid lg:grid-cols-5 gap-12 items-start">
                        {/* Left Side: Contact Info - Styled like Support Page */}
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-primary-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group"
                            >
                                {/* Decorative Circles */}
                                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-secondary-400/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700 delay-150" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20 shadow-xl">
                                        <Headphones className="w-8 h-8 text-white" />
                                    </div>

                                    <h2 className="text-3xl font-black mb-6 tracking-tight">How can we help?</h2>
                                    <p className="text-primary-100 font-medium leading-relaxed mb-10 opacity-90">
                                        Our dedicated support team is available to assist you with any inquiries,
                                        feedback, or service requests. We typically respond within 2 hours.
                                    </p>

                                    <div className="space-y-5">
                                        <div className="flex items-center gap-5 p-5 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-default">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                                <Mail className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Email Us</p>
                                                <p className="font-bold text-white text-lg">hello@washy.ng</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-5 p-5 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-default">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                                <Phone className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Call Us</p>
                                                <p className="font-bold text-white text-lg">+234 800-WASHY</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-5 p-5 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-default">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                                <MapPin className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Our HQ</p>
                                                <p className="font-bold text-white text-lg">Kaduna, Nigeria</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse" />
                                            <span className="text-xs font-bold text-primary-100 uppercase tracking-widest">Live Support Active</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* FAQ Preview Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-neutral-50 rounded-[40px] p-8 border border-neutral-100"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-white rounded-xl shadow-sm">
                                        <MessageSquare className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900">Quick Answer?</h3>
                                </div>
                                <p className="text-neutral-600 mb-6 font-medium">
                                    Check our Help Center for instant answers to frequently asked questions.
                                </p>
                                <Link to="/about">
                                    <Button variant="outline" className="w-full rounded-2xl h-12 border-neutral-200">
                                        Visit Help Center
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Right Side: Contact Form */}
                        <div className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <Card className="p-10 md:p-14 border-neutral-100 shadow-2xl rounded-[40px] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                        <Send className="w-48 h-48" />
                                    </div>

                                    <div className="relative z-10">
                                        <h3 className="text-3xl font-black text-neutral-900 mb-2 tracking-tight">Send a Message</h3>
                                        <p className="text-neutral-500 mb-10 font-medium text-lg">
                                            We'll get back to you across the wire as fast as we can.
                                        </p>

                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Full Name</label>
                                                    <Input
                                                        {...register('name', { required: 'Name is required' })}
                                                        placeholder="John Doe"
                                                        className="bg-neutral-50 border-neutral-100 focus-within:bg-white h-14 rounded-2xl px-6 text-lg"
                                                        error={errors.name?.message}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Email Address</label>
                                                    <Input
                                                        {...register('email', {
                                                            required: 'Email is required',
                                                            pattern: {
                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                message: 'Invalid email address'
                                                            }
                                                        })}
                                                        placeholder="john@example.com"
                                                        className="bg-neutral-50 border-neutral-100 focus-within:bg-white h-14 rounded-2xl px-6 text-lg"
                                                        error={errors.email?.message}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Subject</label>
                                                <Input
                                                    {...register('subject', { required: 'Subject is required' })}
                                                    placeholder="How can we help?"
                                                    className="bg-neutral-50 border-neutral-100 focus-within:bg-white h-14 rounded-2xl px-6 text-lg"
                                                    error={errors.subject?.message}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Message</label>
                                                <textarea
                                                    {...register('message', { required: 'Message is required' })}
                                                    placeholder="Tell us more about your inquiry..."
                                                    rows={6}
                                                    className="w-full bg-neutral-50 border-neutral-100 border rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                                />
                                                {errors.message && (
                                                    <p className="text-sm text-error-500 mt-1 ml-1 font-medium">{errors.message.message}</p>
                                                )}
                                            </div>

                                            <Button
                                                type="submit"
                                                isLoading={isSubmitting}
                                                className="w-full h-18 rounded-[20px] text-xl font-black shadow-xl shadow-primary-200 uppercase tracking-widest bg-primary-600 hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-95"
                                                rightIcon={<Send className="w-5 h-5" />}
                                            >
                                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                            </Button>
                                        </form>
                                    </div>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Improved High-Contrast CTA at Bottom */}
            <section className="py-24 bg-white relative overflow-hidden">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-primary-600 rounded-[40px] md:rounded-[60px] p-10 md:p-24 text-center text-white shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-secondary-400/10 rounded-full blur-3xl animate-pulse delay-700" />
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-10 mx-auto backdrop-blur-md border border-white/10 shadow-xl"
                            >
                                <Zap className="w-10 h-10 text-primary-400 fill-current" />
                            </motion.div>

                            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]">
                                Ready for <br className="hidden sm:block" />
                                <span className="text-primary-400 italic">Fresh</span> Clothes?
                            </h2>

                            <p className="text-xl md:text-2xl text-neutral-300 mb-14 leading-relaxed font-medium max-w-2xl mx-auto">
                                Join thousands of satisfied customers who have taken back their free time.
                                Get started with Nigeria's #1 premium laundry service today.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link to="/register" className="w-full sm:w-auto">
                                    <Button
                                        size="xl"
                                        className="w-full sm:w-auto h-20 px-12 text-2xl font-black bg-white text-neutral-900 hover:bg-neutral-100 border-none shadow-2xl transition-all hover:scale-105 active:scale-95"
                                    >
                                        Get Started Free
                                    </Button>
                                </Link>
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="w-full sm:w-auto h-20 px-12 text-2xl font-bold rounded-[20px] border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    Back to Top
                                    <ArrowRight className="w-6 h-6 -rotate-90" />
                                </button>
                            </div>

                            <div className="mt-14 flex items-center justify-center gap-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-success-500" />
                                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">No Credit Card Required</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-neutral-700" />
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-success-500" />
                                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Instant Activation</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Container>
            </section>
        </div>
    );
};

export default ContactPage;
