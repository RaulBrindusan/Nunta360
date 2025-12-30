'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Check, X, Image as ImageIcon, Video, Plus } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, onSnapshot, orderBy } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const UploadPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [isValidPage, setIsValidPage] = useState<boolean | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pageId, setPageId] = useState<string>('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [existingMedia, setExistingMedia] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  useEffect(() => {
    const validatePage = async () => {
      try {
        const pagesRef = collection(db, 'qr_pages');
        const q = query(pagesRef, where('slug', '==', slug), where('isActive', '==', true));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setIsValidPage(false);
          return;
        }

        const pageDoc = querySnapshot.docs[0];
        const pageData = pageDoc.data();
        setPageId(pageDoc.id);

        const expiryDate = pageData.expiresAt.toDate();
        const now = new Date();

        if (now > expiryDate) {
          setIsExpired(true);
          setIsValidPage(false);
        } else {
          setIsValidPage(true);
        }
      } catch (error) {
        console.error('Error validating page:', error);
        setIsValidPage(false);
      }
    };

    validatePage();
  }, [slug]);

  // Fetch existing uploaded media
  useEffect(() => {
    if (!slug) return;

    const fetchMedia = async () => {
      try {
        setLoadingMedia(true);
        const mediaRef = collection(db, 'uploaded_files');
        const q = query(
          mediaRef,
          where('slug', '==', slug),
          orderBy('uploadedAt', 'desc')
        );

        // Real-time listener for new uploads
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const media = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setExistingMedia(media);
          setLoadingMedia(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching media:', error);
        setLoadingMedia(false);
      }
    };

    fetchMedia();
  }, [slug]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Filter for images and videos only
    const validFiles = files.filter(file =>
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    setUploadedFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0 || !pageId) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      let uploadedCount = 0;
      const totalFiles = uploadedFiles.length;

      const uploadPromises = uploadedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('slug', slug);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const result = await response.json();

        // Store file metadata in Firestore
        await addDoc(collection(db, 'uploaded_files'), {
          pageId: pageId,
          slug: slug,
          fileName: result.fileName,
          fileType: result.fileType,
          fileSize: result.fileSize,
          downloadURL: result.url,
          storagePath: result.storagePath,
          uploadedAt: serverTimestamp(),
        });

        // Update progress
        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));

        return result.url;
      });

      await Promise.all(uploadPromises);

      // Clean up preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setUploadedFiles([]);
      setPreviewUrls([]);
      setUploadProgress(0);
      setUploadDialogOpen(false);

      alert(`${uploadedFiles.length} fișiere încărcate cu succes!`);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('A apărut o eroare la încărcarea fișierelor');
    } finally {
      setUploading(false);
    }
  };

  if (isValidPage === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory via-blush-50 to-sage-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blush-500 mx-auto"></div>
              <p className="mt-4 text-charcoal/70">Se încarcă...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory via-blush-50 to-sage-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <X className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-center text-charcoal">
              {isExpired ? 'Link Expirat' : 'Link Invalid'}
            </CardTitle>
            <CardDescription className="text-center">
              {isExpired
                ? 'Acest link a expirat și nu mai este activ.'
                : 'Acest link nu este valid. Verifică adresa URL.'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-blush-50 to-sage-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-charcoal">
              Nunta<span className="text-blush-400">360</span>
            </h1>
            <p className="text-sm text-charcoal/60">
              Partajează amintirile tale
            </p>
          </div>

          {/* Upload Button */}
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blush-500 hover:bg-blush-600 rounded-full w-12 h-12 p-0">
                <Plus className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Încarcă Fișiere</DialogTitle>
                <DialogDescription>
                  Adaugă pozele și videoclipurile tale de la eveniment
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* File Input */}
                <div className="border-2 border-dashed border-blush-200 rounded-lg p-8 text-center hover:border-blush-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-blush-400 mx-auto mb-4" />
                    <p className="text-charcoal font-medium mb-1">
                      Click pentru a selecta fișiere
                    </p>
                    <p className="text-sm text-charcoal/60">
                      Poze (JPG, PNG) sau Videoclipuri (MP4, MOV)
                    </p>
                  </label>
                </div>

                {/* Preview Grid */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-charcoal">
                      Fișiere selectate ({uploadedFiles.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            {file.type.startsWith('image/') ? (
                              <img
                                src={previewUrls[index]}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Video className="w-12 h-12 text-charcoal/40" />
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <p className="text-xs text-charcoal/60 mt-1 truncate">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="w-full bg-blush-500 hover:bg-blush-600"
                      size="lg"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Se încarcă... {uploadProgress > 0 && `${uploadProgress}%`}
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Încarcă {uploadedFiles.length} fișier{uploadedFiles.length !== 1 ? 'e' : ''}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content - Media Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loadingMedia ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blush-500"></div>
          </div>
        ) : existingMedia.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-charcoal/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-charcoal mb-2">
              Nicio fotografie încărcată încă
            </h3>
            <p className="text-charcoal/60 mb-6">
              Apasă butonul + pentru a adăuga primele amintiri
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
              Galerie Foto & Video ({existingMedia.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingMedia.map((media) => (
                <div key={media.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    {media.fileType.startsWith('image/') ? (
                      <img
                        src={media.downloadURL}
                        alt={media.fileName}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => window.open(media.downloadURL, '_blank')}
                      />
                    ) : (
                      <div className="w-full h-full relative">
                        <video
                          src={media.downloadURL}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => window.open(media.downloadURL, '_blank')}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-black/50 rounded-full p-3">
                            <Video className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-sage-50 border-sage-200">
          <CardContent className="p-4">
            <p className="text-sm text-charcoal/70">
              <strong>Informații:</strong> Pozele și videoclipurile tale vor fi partajate cu cuplul pentru amintiri de neuitat. Mulțumim că participi!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadPage;
