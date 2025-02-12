import Link from "next/link"
import { CheckCircle, Calendar, Layers, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            TaskMaster
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              Login
            </Link>
            <Link
              href="#"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Sign Up
            </Link>
          </div>
          <button className="md:hidden text-foreground">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Master Your Tasks, <span className="text-primary">Conquer Your Day</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            TaskMaster helps you organize, prioritize, and accomplish more in less time. Take control of your
            productivity today.
          </p>
          <Link
            href="#"
            className="bg-primary text-primary-foreground text-lg px-8 py-3 rounded-full hover:bg-accent transition-colors inline-flex items-center"
          >
            Get Started Free
            <ArrowRight className="ml-2" />
          </Link>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-card text-card-foreground py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Powerful Features for Ultimate Productivity
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<CheckCircle className="w-12 h-12 text-primary" />}
                title="Smart Task Management"
                description="Organize tasks with ease, set priorities, and never miss a deadline again."
              />
              <FeatureCard
                icon={<Layers className="w-12 h-12 text-primary" />}
                title="Project Tracking"
                description="Keep all your projects on track with visual progress bars and milestone tracking."
              />
              <FeatureCard
                icon={<Calendar className="w-12 h-12 text-primary" />}
                title="Calendar Integration"
                description="Seamlessly sync your tasks with your favorite calendar apps for a unified schedule."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-secondary text-secondary-foreground py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="TaskMaster has completely transformed how I manage my daily tasks. I'm more productive than ever!"
                author="Sarah J., Freelance Designer"
              />
              <TestimonialCard
                quote="The project tracking feature is a game-changer. My team's productivity has skyrocketed since we started using TaskMaster."
                author="Mike T., Project Manager"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their work and life with TaskMaster. Sign up now and start
              your journey to peak productivity.
            </p>
            <Link
              href="#"
              className="bg-accent text-accent-foreground text-lg px-8 py-3 rounded-full hover:bg-secondary hover:text-secondary-foreground transition-colors inline-flex items-center"
            >
              Sign Up for Free
              <ArrowRight className="ml-2" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-muted text-muted-foreground py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-2xl font-bold text-primary">
                TaskMaster
              </Link>
              <p className="text-sm mt-2">© 2023 TaskMaster. All rights reserved.</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="#" className="hover:text-primary transition-colors">
                About
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-popover text-popover-foreground p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

interface TestimonialCardProps {
  quote: string;
  author: string;
}

function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
      <p className="text-muted-foreground italic mb-4">"{quote}"</p>
      <p className="font-semibold">{author}</p>
    </div>
  )
}
