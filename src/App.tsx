import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import AudioControl from './components/AudioControl';
import type { Chapter } from './types';

const ChapterGalaxy = lazy(() => import('./chapters/ChapterGalaxy'));
const ChapterSky = lazy(() => import('./chapters/ChapterSky'));
const ChapterNews = lazy(() => import('./chapters/ChapterNews'));
const ChapterHeadline = lazy(() => import('./chapters/ChapterHeadline'));
const ChapterTimeline = lazy(() => import('./chapters/ChapterTimeline'));
const SourcesPage = lazy(() => import('./components/SourcesPage'));

const CHAPTERS: { id: Chapter; label: string }[] = [
  { id: 'galaxy', label: 'The Universe' },
  { id: 'sky', label: 'The Sky' },
  { id: 'news', label: 'The World' },
  { id: 'headline', label: 'The Headline' },
  { id: 'timeline', label: 'Through Time' },
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState<Chapter>('galaxy');
  const [showSources, setShowSources] = useState(false);
  const chapterRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          const id = entry.target.getAttribute('data-chapter') as Chapter;
          if (id) setActiveChapter(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: [0.3, 0.5, 0.7],
    });

    Object.values(chapterRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoading]);

  const scrollToChapter = (id: Chapter) => {
    const el = chapterRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const setRef = (id: string) => (el: HTMLElement | null) => {
    chapterRefs.current[id] = el;
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navigation
            chapters={CHAPTERS}
            activeChapter={activeChapter}
            onNavigate={scrollToChapter}
            onShowSources={() => setShowSources(true)}
          />
          <AudioControl />
          
          <main>
            <Suspense fallback={<div className="min-h-screen bg-midnight" />}>
              <section ref={setRef('galaxy')} data-chapter="galaxy">
                <ChapterGalaxy onExplore={() => scrollToChapter('sky')} />
              </section>

              <section ref={setRef('sky')} data-chapter="sky">
                <ChapterSky />
              </section>

              <section ref={setRef('news')} data-chapter="news">
                <ChapterNews />
              </section>

              <section ref={setRef('headline')} data-chapter="headline">
                <ChapterHeadline />
              </section>

              <section ref={setRef('timeline')} data-chapter="timeline">
                <ChapterTimeline />
              </section>
            </Suspense>
          </main>

          <AnimatePresence>
            {showSources && (
              <Suspense fallback={null}>
                <SourcesPage onClose={() => setShowSources(false)} />
              </Suspense>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export default App;
