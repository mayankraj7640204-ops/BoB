import React from 'react';
import { WorkProject } from '../types';

interface CaseStudyPageProps {
  works: WorkProject[];
  onSelectWork: (work: WorkProject) => void;
}

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ works, onSelectWork }) => {
  // Notable deep-dive projects
  const caseStudies = [
    {
      title: 'The Aviators',
      client: 'Xfinity',
      director: 'Kathryn Bigelow (Academy Award Winner)',
      dp: 'Greig Fraser (Academy Award Winner: Dune)',
      services: ['End-to-End VFX', 'Color Grading', 'CG Aircraft', 'Historical Realism'],
      description:
        'For The Aviators, Preymaker collaborated with Academy Award-winning director Kathryn Bigelow and Oscar-winning cinematographer Greig Fraser. The high-stakes short film demanded hyper-realistic aerial sequences, period-accurate aircraft cockpits, and complex environmental lighting simulations across historical and modern timelines.',
      video: 'https://d2rb54pmpxhpry.cloudfront.net/work/xfinity-aviators/xfinity-aviators-preview_1080p.mp4',
    },
    {
      title: 'Denmark',
      client: 'Preymaker Original IP',
      director: 'Angus Kneale',
      services: ['Unreal Engine 5', 'Procedural Houdini', 'Real-Time Animation', 'Virtual Production'],
      description:
        'An ambitious, critically acclaimed original animated heist thriller set inside an elaborate procedural world composed of tens of millions of interlocking digital bricks. Engineered entirely in Unreal Engine 5 and Houdini, Denmark demonstrates our boundary-pushing real-time production capabilities.',
      video: 'https://d2rb54pmpxhpry.cloudfront.net/work/preymaker-denmark/denmark_full_preview_1_1080p.mp4',
    },
    {
      title: 'Lincoln Navigator: Waterfall',
      client: 'Lincoln / Hudson Rouge',
      director: 'Adam Berg',
      services: ['Photoreal CGI', 'Automotive VFX', 'Fluid Dynamics', 'Color Grading'],
      description:
        'Crafted with absolute attention to luxury aesthetic and physically based rendering. Our visual engineers recreated dynamic cascading waterfall environments, atmospheric mist simulations, and pristine vehicle surface reflections that highlight every contour of the Lincoln Navigator.',
      video: 'https://d2rb54pmpxhpry.cloudfront.net/work/lincoln-navigator2026-101047/lincoln-waterfalls-preview_1080p.mp4',
    },
    {
      title: 'Ford: F1 Proving Ground',
      client: 'Ford / Wieden + Kennedy',
      director: 'Rupert Sanders',
      services: ['Caravaggio-Inspired Realism', 'Moving Portraits', 'High-Speed CG', 'VFX'],
      description:
        'Marking Ford’s momentous return to Formula 1 racing. Preymaker produced striking moving portraits inspired by Caravaggio’s chiaroscuro contrast, blending real track photography with digital engine teardowns and high-speed aerodynamics.',
      video: 'https://d2rb54pmpxhpry.cloudfront.net/work/ford---proving-ground-101032/ford_f1_proving_ground_30_preview_1080p.mp4',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-black text-[#f1f3f5] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-16 md:mb-24 pb-8 border-b border-[#1f2428]">
          <span className="heading-xxs text-[#859099] uppercase tracking-widest block mb-4">
            Process · Impact
          </span>
          <h1 className="text-xl md:text-4xl font-semibold tracking-tight text-white max-w-4xl">
            Case Studies
          </h1>
          <p className="mt-4 text-base md:text-xl text-[#859099] max-w-3xl">
            A deeper look into how artistry, cloud engineering, and breakthrough tools converge to solve the most ambitious creative challenges.
          </p>
        </div>

        {/* Case Studies List */}
        <div className="space-y-24 md:space-y-36">
          {caseStudies.map((cs, idx) => (
            <div
              key={cs.title}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center"
            >
              {/* Video Player / Showcase (7 cols) */}
              <div
                onClick={() =>
                  onSelectWork({
                    id: `cs-${idx}`,
                    title: cs.title,
                    client: cs.client,
                    slug: cs.title.toLowerCase().replace(/\s+/g, '-'),
                    services: cs.services,
                    credits: [
                      { role: 'Director', name: cs.director || 'Preymaker' },
                      { role: 'Client', name: cs.client },
                    ],
                    video: cs.video,
                    mobileVideo: cs.video,
                    image: null,
                    description: cs.description,
                  })
                }
                data-cursor="pointer"
                data-content="Watch Reel"
                className="lg:col-span-7 relative aspect-video rounded-sm overflow-hidden bg-[#0d1012] group cursor-pointer border border-[#1f2428] hover:border-white/50 transition-colors"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                >
                  <source src={cs.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs uppercase tracking-wider text-white">
                  ▶ Full Screen
                </div>
              </div>

              {/* Case Study Details (5 cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-6">
                <div>
                  <p className="heading-xxs text-[#859099] uppercase tracking-widest mb-1">
                    {cs.client}
                  </p>
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
                    {cs.title}
                  </h2>
                </div>

                <div className="text-xs uppercase tracking-wider text-[#c0c6ca] font-mono border-y border-[#1f2428] py-3">
                  <p>Director: {cs.director}</p>
                  {cs.dp && <p className="mt-1">DP: {cs.dp}</p>}
                </div>

                <p className="text-sm md:text-base text-[#859099] leading-relaxed">
                  {cs.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {cs.services.map((s) => (
                    <span key={s} className="text-tag uppercase text-[10px] tracking-wider">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

