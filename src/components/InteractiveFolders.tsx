import React from 'react';
import GlassFolder, { FolderFile } from './GlassFolder';
import { useLanguage } from '../data/language';

export interface InteractiveFoldersProps {
  onOpenRetailStore?: () => void;
  onOpenShoppingMall?: () => void;
}

export const InteractiveFolders: React.FC<InteractiveFoldersProps> = ({ onOpenRetailStore, onOpenShoppingMall }) => {
  const { t } = useLanguage();

  // Folder 1: "I'm a retail store" files
  const retailFiles: FolderFile[] = [
    {
      name: t('Promos', 'Promosies'),
      meta: t('PDF · Active', 'PDF · Aktief'),
      art: 'aurora',
    },
    {
      name: t('Leaflets', 'Pamflette'),
      meta: t('Print & Digital', 'Druk & Digitaal'),
      art: 'glacier',
    },
    {
      name: t('Video', 'Video'),
      meta: '4K · MP4',
      art: 'ember',
    },
    {
      name: t('Social Media', 'Sosiale Media'),
      meta: 'Instagram · TikTok',
      art: 'dusk',
    },
  ];

  // Folder 2: "I'm a shopping mall" files
  const mallFiles: FolderFile[] = [
    {
      name: t('Social Media', 'Sosiale Media'),
      meta: t('Content Hub', 'Inhouds-Hub'),
      art: 'ember',
    },
    {
      name: t('Campaigns', 'Veldtogte'),
      meta: t('360° Launch', '360° Lansering'),
      art: 'dusk',
    },
    {
      name: t('Digital', 'Digitaal'),
      meta: t('Interactive Directory', 'Interaktiewe Gids'),
      art: 'glacier',
    },
    {
      name: t('Experiences', 'Ervarings'),
      meta: t('Spatial In-Mall', 'Ruimtelik In-Sentrum'),
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
            label={t("I'm a retail store", 'Ek is ’n winkel')}
            meta={
              <div className="space-y-0.5 mt-1 font-normal leading-tight text-[11px] sm:text-[12px]">
                <p>- {t('Promos', 'Promosies')}</p>
                <p>- {t('Leaflets', 'Pamflette')}</p>
                <p>- {t('Video', 'Video')}</p>
                <p>- {t('Social Media', 'Sosiale Media')}</p>
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
            label={t("I'm a shopping mall", 'Ek is ’n winkelsentrum')}
            meta={
              <div className="space-y-0.5 mt-1 font-normal leading-tight text-[11px] sm:text-[12px]">
                <p>- {t('Social Media', 'Sosiale Media')}</p>
                <p>- {t('Campaigns', 'Veldtogte')}</p>
                <p>- {t('Digital', 'Digitaal')}</p>
                <p>- {t('Experiences', 'Ervarings')}</p>
              </div>
            }
            tone="dark"
            art="ember"
            action="more"
            width={290}
            files={mallFiles}
            onClick={() => {
              onOpenShoppingMall?.();
            }}
            menu={[
              { label: t('Explore Mall Solutions', 'Verken Sentrum-Oplossinge'), onSelect: () => onOpenShoppingMall?.() },
              { label: t('Campaign Case Studies', 'Veldtog-Gevallestudies'), onSelect: () => onOpenShoppingMall?.() },
              { label: t('Book Mall Strategy Call', 'Boek ’n Sentrumstrategie-Oproep'), onSelect: () => onOpenShoppingMall?.() },
            ]}
          />
        </div>
      </div>

      {/* Caption strip */}
      <div className="mt-3 text-[10px] sm:text-[11px] font-mono tracking-widest text-gray-500 uppercase text-center lg:text-right">
        {t(
          'HOVER TO LEAN · ARE YOU A RETAIL STORE OR A SHOPPING MALL? · + TO ADD',
          'HOE OOR LEUN · IS JY ’N WINKEL OF ’N WINKELSENTRUM? · + OM BY TE VOEG'
        )}
      </div>
    </div>
  );
};
