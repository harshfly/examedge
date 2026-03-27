'use client';

import { UploadCloud, Image as ImageIcon, Trash2, Link as LinkIcon, Download } from 'lucide-react';
import { useState } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { TopicImage } from '@/types';

export default function AdminImageManager() {
  const { images, saveImage, deleteImage } = useDataStore();

  const handleUploadSim = () => {
    const newImg: TopicImage = {
      id: `IMG-${Date.now()}`,
      url: 'https://via.placeholder.com/800x400',
      caption: 'Uploaded Asset Preview',
      altText: 'Asset description',
      position: 'inline'
    };
    saveImage(newImg);
  };

  return (
    <div className="max-w-[1200px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1">Asset Library</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Manage static assets injected into TipTap Topics.</p>
        </div>
        <button onClick={handleUploadSim} className="btn-success flex items-center gap-2">
          <UploadCloud className="w-4 h-4" /> Upload New Asset
        </button>
      </div>

      <div className="bg-[var(--bg-overlay)] border border-dashed border-[#6c63ff40] rounded-[var(--r-xl)] p-12 mb-8 flex flex-col items-center justify-center text-center hover:bg-[rgba(108,99,255,0.02)] transition-colors cursor-pointer group">
        <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-[#6c63ff] transition-all">
          <UploadCloud className="w-8 h-8 text-[var(--text-muted)] group-hover:text-[#6c63ff] transition-colors" />
        </div>
        <h3 className="text-[16px] font-bold text-white mb-2">Drag & Drop Media Files</h3>
        <p className="text-[13px] text-[var(--text-secondary)] max-w-[400px]">
          SVG, PNG, JPG or WebP up to 5MB. Files are automatically processed, optimized, and pushed to the global CDN edge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.length === 0 && <div className="col-span-full py-10 text-center text-[var(--text-muted)]">No assets uploaded to library.</div>}
        {images.map(img => (
          <div key={img.id} className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] overflow-hidden group">
            <div className="h-[160px] bg-[var(--bg-elevated)] flex items-center justify-center relative overflow-hidden pattern-grid">
               <img src={img.url} alt={img.altText} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
               <div className="absolute inset-0 bg-[#00000090] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                 <button className="btn-primary py-2 px-3 text-[12px] flex items-center gap-2" onClick={() => navigator.clipboard.writeText(img.url)}><LinkIcon className="w-3.5 h-3.5" /> Copy URL</button>
               </div>
            </div>
            <div className="p-4 flex justify-between items-start">
              <div>
                <div className="text-[13px] font-bold text-white truncate max-w-[200px] mb-1">{img.caption}</div>
                <div className="text-[11px] font-mono text-[var(--text-muted)]">{img.id}</div>
              </div>
              <div className="flex gap-1">
                <button className="btn-icon w-7 h-7" onClick={() => window.open(img.url)}><Download className="w-3 h-3" /></button>
                <button onClick={() => confirm('Delete?') && deleteImage(img.id)} className="btn-icon w-7 h-7 text-[#f43f5e] hover:bg-[#f43f5e20] hover:border-[#f43f5e]"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
