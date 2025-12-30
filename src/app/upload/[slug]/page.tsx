'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Check, X, Image as ImageIcon, Video } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

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

      alert(`${uploadedFiles.length} fișiere încărcate cu succes!`);

      // Clean up preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setUploadedFiles([]);
      setPreviewUrls([]);
      setUploadProgress(0);
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
    <div className="min-h-screen bg-gradient-to-br from-ivory via-blush-50 to-sage-50 p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
            Nunta<span className="text-blush-400">360</span>
          </h1>
          <p className="text-charcoal/70">
            Încarcă poze și videoclipuri de la nuntă
          </p>
        </div>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Încarcă Fișiere</CardTitle>
            <CardDescription>
              Adaugă pozele și videoclipurile tale de la eveniment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-sage-50 border-sage-200">
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
