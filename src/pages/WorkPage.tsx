import React, { useState, useMemo } from 'react';
import { WorkProject } from '../types';

interface WorkPageProps {
  works: WorkProject[];
  onSelectWork: (work: WorkProject) => void;
}

const ITEMS_PER_PAGE = 12;

export const WorkPage: React.FC<WorkPageProps> = ({ works, onSelectWork }) => {
  const [selectedService, setSelectedService] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Extract all unique services
  const allServices = useMemo(() => {
    const set = new Set<string>();
    works.forEach((w) => {
      w.services.forEach((s) => set.add(s));
    });
    return ['All', ...Array.from(set)];
  }, [works]);

  // Filter works
  const filteredWorks = useMemo(() => {
    if (selectedService === 'All') return works;
    return works.filter((w) => w.services.includes(selectedService));
  }, [works, selectedService]);

  // Pagination
  const totalPages = Math.ceil(filteredWorks.length / ITEMS_PER_PAGE) || 1;
  const paginatedWorks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWorks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWorks, currentPage]);

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-black text-[#f1f3f5] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Statement */}
        <div className="mb-12 md:mb-16 pb-8 border-b border-[#1f2428]">
          <span className="heading-xxs text-[#859099] uppercase tracking-widest block mb-4">
            Archive · Work
          </span>
          <h1 className="text-xl md:text-3xl font-semibold tracking-tight text-white max-w-4xl leading-tight">
            All our work matters. What’s above offers a curated glimpse, but every project contributes to who we are. The archive below expands the view, a deeper dive into the breadth of what we create.
          </h1>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {allServices.map((service) => (
            <button
              key={service}
              onClick={() => handleServiceChange(service)}
              className={`heading-xxs uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-200 ${
                selectedService === service
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-[#859099] border-[#1f2428] hover:border-white hover:text-white'
              }`}
            >
              {service}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#859099] font-mono">
            Showing {filteredWorks.length} projects
          </span>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {paginatedWorks.map((work) => (
            <div
              key={work.id}
              onClick={() => onSelectWork(work)}
              data-cursor="pointer"
              data-content="Play Video"
              className="group flex flex-col space-y-4 cursor-pointer"
            >
              {/* Media Card */}
              <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-[#0d1012]">
                {work.video ? (
                  <video
                    loop
                    muted
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  >
                    <source src={work.video} type="video/mp4" />
                  </video>
                ) : work.image ? (
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#859099]">
                    <span className="text-xs uppercase tracking-widest font-mono">Preymaker</span>
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <span className="text-tag uppercase text-[10px] tracking-wider">
                    {work.services[0] || 'Work'}
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#859099] font-medium">
                    {work.client || 'Preymaker'}
                  </p>
                  <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white group-hover:translate-x-1 transition-transform">
                    {work.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-16 pt-8 border-t border-[#1f2428] flex items-center justify-between">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className={`heading-xxs uppercase px-3 py-1.5 rounded-sm font-mono transition-colors ${
                      currentPage === pageNum
                        ? 'bg-white text-black font-bold'
                        : 'text-[#859099] hover:text-white'
                    }`}
                  >
                    {pageNum.toString().padStart(2, '0')}
                  </button>
                );
              })}
            </div>

            <div className="flex space-x-4">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 200, behavior: 'smooth' });
                }}
                className="heading-xxs uppercase tracking-wider text-[#859099] disabled:opacity-30 hover:text-white transition-colors"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 200, behavior: 'smooth' });
                }}
                className="heading-xxs uppercase tracking-wider text-[#859099] disabled:opacity-30 hover:text-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

