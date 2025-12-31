'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Image as ImageIcon, Video, Download, Loader2, AlertCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';

interface MediaFile {
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadURL: string;
  storagePath: string;
  lastModified: string;
  lastModifiedTimestamp: number;
}

const MediaPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasQrPage, setHasQrPage] = useState(false);
  const [slug, setSlug] = useState('');
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    const fetchMediaFiles = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Check if user has a QR page
        const pagesRef = collection(db, 'qr_pages');
        const q = query(pagesRef, where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setHasQrPage(false);
          setLoading(false);
          return;
        }

        const pageData = querySnapshot.docs[0].data();
        const pageSlug = pageData.slug;
        setSlug(pageSlug);
        setHasQrPage(true);

        // Fetch media files from R2
        const response = await fetch(`/api/media/${pageSlug}`);

        if (!response.ok) {
          throw new Error('Failed to fetch media files');
        }

        const data = await response.json();
        setMediaFiles(data.files || []);
      } catch (error) {
        console.error('Error fetching media files:', error);
        toast({
          title: t('media.error'),
          description: 'A apărut o eroare la încărcarea fișierelor media',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMediaFiles();
  }, [user, t, toast]);

  const filteredFiles = mediaFiles.filter((file) => {
    if (filter === 'all') return true;
    if (filter === 'images') return file.fileType.startsWith('image/');
    if (filter === 'videos') return file.fileType.startsWith('video/');
    return true;
  });

  const imageCount = mediaFiles.filter((f) => f.fileType.startsWith('image/')).length;
  const videoCount = mediaFiles.filter((f) => f.fileType.startsWith('video/')).length;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadFile = async (url: string, fileName: string) => {
    try {
      // Use our proxy API route to download the file
      const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&fileName=${encodeURIComponent(fileName)}`;

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Eroare la descărcare',
        description: 'Nu am putut descărca fișierul',
        variant: 'destructive',
      });
    }
  };

  const downloadAll = async () => {
    if (!slug) return;

    try {
      const downloadUrl = `/api/download-all?slug=${encodeURIComponent(slug)}`;

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `nunta360-media-${slug}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading all files:', error);
      toast({
        title: 'Eroare la descărcare',
        description: 'Nu am putut descărca toate fișierele',
        variant: 'destructive',
      });
    }
  };

  const openViewer = (index: number) => {
    setSelectedIndex(index);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setSelectedIndex(null);
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < filteredFiles.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!viewerOpen) return;

      if (e.key === 'Escape') {
        closeViewer();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewerOpen, selectedIndex, filteredFiles.length]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blush-500 animate-spin mx-auto" />
              <p className="text-charcoal/60">{t('media.loading')}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!hasQrPage) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blush-100 p-3 rounded-lg">
              <ImageIcon className="w-8 h-8 text-blush-600" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-charcoal">
                {t('media.title')}
              </h1>
              <p className="text-charcoal/60">{t('media.subtitle')}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-dustyRose-500" />
              <h2 className="text-lg font-semibold text-charcoal">{t('media.noQrCode')}</h2>
            </div>
            <p className="text-charcoal/60 mb-4">{t('media.noQrCodeDescription')}</p>
            <Link href="/dashboard/qr">
              <Button className="bg-blush-500 hover:bg-blush-600">
                {t('media.goToQrPage')}
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-blush-100 p-3 rounded-lg">
            <ImageIcon className="w-8 h-8 text-blush-600" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-charcoal">
              {t('media.title')}
            </h1>
            <p className="text-charcoal/60">{t('media.subtitle')}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className={`text-xs md:text-sm px-3 py-2 ${filter === 'all' ? 'bg-blush-500 hover:bg-blush-600' : ''}`}
          >
            {t('media.all')} ({mediaFiles.length})
          </Button>
          <Button
            onClick={() => setFilter('images')}
            variant={filter === 'images' ? 'default' : 'outline'}
            className={`text-xs md:text-sm px-3 py-2 ${filter === 'images' ? 'bg-blush-500 hover:bg-blush-600' : ''}`}
          >
            {t('media.images')} ({imageCount})
          </Button>
          <Button
            onClick={() => setFilter('videos')}
            variant={filter === 'videos' ? 'default' : 'outline'}
            className={`text-xs md:text-sm px-3 py-2 ${filter === 'videos' ? 'bg-blush-500 hover:bg-blush-600' : ''}`}
          >
            {t('media.videos')} ({videoCount})
          </Button>

          {mediaFiles.length > 0 && (
            <Button
              onClick={() => downloadAll()}
              className="bg-blush-500 hover:bg-blush-600 px-4 py-2 md:px-3 md:py-2"
              title={t('media.downloadAll')}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Media Gallery */}
        {filteredFiles.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg py-12">
            <div className="text-center space-y-4">
              <div className="bg-blush-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <ImageIcon className="w-8 h-8 text-blush-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-charcoal">
                  {t('media.noMedia')}
                </h3>
                <p className="text-charcoal/60">{t('media.noMediaDescription')}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map((file, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openViewer(index)}
              >
                <div className="relative aspect-square bg-gray-100">
                  {file.fileType.startsWith('image/') ? (
                    <img
                      src={file.downloadURL}
                      alt={file.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-charcoal/5">
                      <Video className="w-12 h-12 text-charcoal/30" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(file.downloadURL, file.fileName);
                      }}
                      className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg inline-flex"
                    >
                      <Download className="w-4 h-4 text-charcoal" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-charcoal truncate" title={file.fileName}>
                    {file.fileName}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-charcoal/50">{formatFileSize(file.fileSize)}</p>
                    <p className="text-xs text-charcoal/50">{formatDate(file.lastModified)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Page Media Viewer */}
      {viewerOpen && selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close and Download Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={closeViewer}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={() => downloadFile(filteredFiles[selectedIndex].downloadURL, filteredFiles[selectedIndex].fileName)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Download className="w-8 h-8" />
            </button>
          </div>

          {/* Previous Button */}
          {selectedIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
          )}

          {/* Next Button */}
          {selectedIndex < filteredFiles.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronRight className="w-12 h-12" />
            </button>
          )}

          {/* Media Content */}
          <div className="max-w-7xl max-h-screen p-4 flex items-center justify-center">
            {filteredFiles[selectedIndex].fileType.startsWith('image/') ? (
              <img
                src={filteredFiles[selectedIndex].downloadURL}
                alt={filteredFiles[selectedIndex].fileName}
                className="max-w-full max-h-screen object-contain"
              />
            ) : (
              <video
                src={filteredFiles[selectedIndex].downloadURL}
                controls
                className="max-w-full max-h-screen"
              />
            )}
          </div>

          {/* Media Info */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
            <p className="text-sm font-medium">{filteredFiles[selectedIndex].fileName}</p>
            <p className="text-xs text-gray-400">
              {selectedIndex + 1} / {filteredFiles.length}
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MediaPage;
