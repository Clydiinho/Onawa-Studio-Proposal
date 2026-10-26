import React from 'react';
import GlassFolder, { FolderFile } from './GlassFolder';

export interface InteractiveFoldersProps {
  onOpenRetailStore?: () => void;
}

export const InteractiveFolders: React.FC<InteractiveFoldersProps> = ({ onOpenRetailStore }) => {
  // Folder 1: "I'm a retail store" files
  const retailFiles: FolderFile[] = [
    {
      name: 'Promos',
      meta: 'PDF · Active',
      art: 'aurora',
    },
    {
      name: 'Leaflets',
      meta: 'Print & Digital',
      art: 'glacier',
    },
    {
      name: 'Video',
      meta: '4K · MP4',
      art: 'ember',
    },
    {
      name: 'Social Media',
      meta: 'Instagram · TikTok',
      art: 'dusk',
    },
  ];

  // Folder 2: "I'm a shopping mall" files
  const mallFiles: FolderFile[] = [
    {
      name: 'Social Media',
      meta: 'Content Hub',
      art: 'ember',
    },
    {
      name: 'Campaigns',
      meta: '360° Launch',
      art: 'dusk',
    },
    {
      name: 'Digital',
      meta: 'Interactive Directory',
      art: 'glacier',
    },
    {
      name: 'Experiences',
      meta: 'Spatial In-Mall',
      art: 'aurora',
    },
  ];

  return (
    <div className="flex flex-col items-center lg:items-end w-full select-none">
      {/* Folders Container Row */}
      <div className="flex flex-wrap sm:flex-nowrap items-end justify-center lg:justify-end gap-5 sm:gap-7 pt-8 sm:pt-10 pb-2">
        {/* FOLDER 1: "I'm a retail store" (Milk Glass, Glacier art, + add button) */}
        <div className="relative group">
          <GlassFolder
            label="I'm a retail store"
            meta={
              <div className="space-y-0.5 mt-1 font-normal leading-tight text-[11px] sm:text-[12px]">
                <p>- Promos</p>
                <p>- Leaflets</p>
                <p>- Video</p>
                <p>- Social Media</p>
              </div>
            }
            tone="light"
            art="glacier"
            action="add"
            width={290}
            files={retailFiles}
            onClick={() => {
              onOpenRetailStore?.();
            }}
            onFileSelect={() => {
              onOpenRetailStore?.();
            }}
          />
        </div>

        {/* FOLDER 2: "I'm a shopping mall" (Smoked Glass, Ember art, ··· more button) */}
        <div className="relative group">
          <GlassFolder
            label="I'm a shopping mall"
            meta={
              <div className="space-y-0.5 mt-1 font-normal leading-tight text-[11px] sm:text-[12px]">
                <p>- Social Media</p>
                <p>- Campaigns</p>
                <p>- Digital</p>
                <p>- Experiences</p>
              </div>
            }
            tone="dark"
            art="ember"
            action="more"
            width={290}
            files={mallFiles}
            menu={[
              { label: 'Explore Mall Solutions', onSelect: () => {} },
              { label: 'Campaign Case Studies', onSelect: () => {} },
              { label: 'Book Mall Strategy Call', onSelect: () => {} },
            ]}
          />
        </div>
      </div>

      {/* Caption strip */}
      <div className="mt-3 text-[10px] sm:text-[11px] font-mono tracking-widest text-gray-500 uppercase text-center lg:text-right">
        HOVER TO LEAN · ARE YOU A RETAIL STORE OR A SHOPPING MALL? · + TO ADD
      </div>
    </div>
  );
};

export default InteractiveFolders;
