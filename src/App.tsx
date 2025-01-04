import { useEffect, useRef, useState, useMemo, lazy, Suspense } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { motion } from 'framer-motion';

const Calculator = lazy(() => import('./components/Calculator').then(module => ({ default: module.Calculator })));

function LoadingFallback() {
  return (
    <div className="w-full max-w-md p-6">
      <div className="animate-pulse">
        <div className="h-16 bg-muted rounded-xl mb-6"></div>
        <div className="space-y-3">
          <div className="h-12 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-4 gap-3">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const words = useMemo(() => [
    { text: 'Modern Problems', color: 'from-blue-500 to-indigo-500' },
    { text: 'Complex Calculations', color: 'from-emerald-500 to-teal-500' },
    { text: 'Daily Math', color: 'from-rose-500 to-pink-500' }
  ], []);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const i = loopNum % words.length;
      const fullText = words[i].text;

      if (isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayText(fullText.substring(0, displayText.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    timer = setTimeout(tick, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed, words]);

  const currentWord = words[loopNum % words.length];

  return (
    <span className={`bg-gradient-to-r ${currentWord.color} bg-clip-text text-transparent transition-colors duration-500`}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function App() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const options = {
      threshold: 0.1,
      rootMargin: '50px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, options);

    const elements = document.querySelectorAll('.scroll-animation');
    elements.forEach((el) => observerRef.current?.observe(el));

    setIsLoaded(true);

    return () => {
      elements.forEach((el) => observerRef.current?.unobserve(el));
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background to-muted">
        {/* Background Elements */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] transition-opacity duration-1000" 
               style={{ opacity: isLoaded ? 1 : 0 }} />
          <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] transition-opacity duration-1000"
               style={{ opacity: isLoaded ? 1 : 0 }} />
        </div>

        <header className="fixed top-0 z-50 w-full border-b border-border/40 backdrop-blur-md">
          <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-3xl font-bold tracking-tighter">
                acta<span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">RITHM</span>
              </h1>
              <div className="hidden space-x-8 text-sm font-medium md:flex">
                <a href="#calculator" className="text-muted-foreground transition-colors hover:text-primary">
                  Calculator
                </a>
                <a href="#features" className="text-muted-foreground transition-colors hover:text-primary">
                  Features
                </a>
                <a href="#about" className="text-muted-foreground transition-colors hover:text-primary">
                  About
                </a>
              </div>
            </div>
            <ThemeToggle />
          </nav>
        </header>

        <main className="relative z-10">
          <section className="relative pt-32 pb-16">
            <div className="mx-auto max-w-7xl px-4">
              <div className="scroll-animation text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto max-w-3xl"
                >
                  <h2 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
                    Modern Calculator for{' '}
                    <br />
                    <TypewriterText text="Modern Problems" />
                  </h2>
                  <p className="mx-auto mb-8 text-lg text-muted-foreground">
                    Experience the next generation of calculation with our powerful calculator.
                    Multiple modes, beautiful design, and seamless calculations.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          <section id="calculator" className="scroll-animation py-16">
            <div className="mx-auto max-w-7xl px-4">
              <div className="flex justify-center">
                <Suspense fallback={<LoadingFallback />}>
                  <Calculator />
                </Suspense>
              </div>
            </div>
          </section>

          <section id="features" className="scroll-animation py-24">
            <div className="mx-auto max-w-7xl px-4">
              <h2 className="mb-12 text-center text-3xl font-bold">Features</h2>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="group rounded-2xl bg-card/50 p-8 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-card/60">
                  <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">Theme Support</h3>
                  <p className="text-muted-foreground">
                    Seamlessly switch between light, dark, and system themes for comfortable calculations any time of day.
                  </p>
                </div>
                <div className="group rounded-2xl bg-card/50 p-8 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-card/60">
                  <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">Multiple Modes</h3>
                  <p className="text-muted-foreground">
                    Switch between standard, scientific, programmer, and converter modes to handle any calculation need.
                  </p>
                </div>
                <div className="group rounded-2xl bg-card/50 p-8 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-card/60">
                  <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">Modern Design</h3>
                  <p className="text-muted-foreground">
                    Beautiful animations, glassmorphism effects, and a clean interface make calculations a delightful experience.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="scroll-animation py-24">
            <div className="mx-auto max-w-7xl px-4">
              <div className="rounded-2xl bg-card/50 p-8 backdrop-blur-sm md:p-12">
                <h2 className="mb-8 text-center text-3xl font-bold">About actaRITHM</h2>
                <div className="mx-auto max-w-3xl">
                  <p className="mb-6 text-muted-foreground">
                    actaRITHM is a modern calculator application designed to make complex calculations simple and enjoyable. 
                    Our mission is to provide a powerful yet intuitive tool that adapts to your needs, whether you're doing 
                    basic arithmetic or complex scientific calculations.
                  </p>
                  <p className="mb-6 text-muted-foreground">
                    Built with the latest web technologies and designed with a focus on user experience, actaRITHM offers 
                    multiple calculation modes, beautiful animations, and a responsive interface that works seamlessly across 
                    all devices.
                  </p>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-xl font-semibold">Key Features</h3>
                      <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                        <li>Multiple calculation modes</li>
                        <li>Scientific functions</li>
                        <li>Programmer calculations</li>
                        <li>Unit conversion</li>
                        <li>Responsive design</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-4 text-xl font-semibold">Technologies</h3>
                      <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                        <li>React</li>
                        <li>TypeScript</li>
                        <li>Tailwind CSS</li>
                        <li>Framer Motion</li>
                        <li>Modern Web APIs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t border-border/40 py-12">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <p className="text-muted-foreground">
              © 2024 actaRITHM. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
