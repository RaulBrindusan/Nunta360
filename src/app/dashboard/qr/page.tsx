'use client';

import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { QrCode, Download, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

const QRCodePage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Check if user already has a QR page
  useEffect(() => {
    const checkExistingPage = async () => {
      if (!user) return;

      try {
        const pagesRef = collection(db, 'qr_pages');
        const q = query(pagesRef, where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const pageData = querySnapshot.docs[0].data();
          const pageUrl = `${window.location.origin}/upload/${pageData.slug}`;
          setGeneratedUrl(pageUrl);
          setHasGenerated(true);
        }
      } catch (error) {
        console.error('Error checking existing page:', error);
      }
    };

    checkExistingPage();
  }, [user]);

  const generateUniqueSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < 16; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
  };

  const handleGenerate = async () => {
    if (!user) {
      toast({
        title: 'Eroare',
        description: 'Trebuie să fii autentificat',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const slug = generateUniqueSlug();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 60); // 60 days from now

      // Create QR page in Firestore
      await addDoc(collection(db, 'qr_pages'), {
        userId: user.id,
        slug: slug,
        createdAt: serverTimestamp(),
        expiresAt: expiryDate,
        isActive: true,
      });

      const pageUrl = `${window.location.origin}/upload/${slug}`;
      setGeneratedUrl(pageUrl);
      setHasGenerated(true);

      toast({
        title: t('qrCode.success'),
        description: 'Pagina ta de upload a fost creată!',
      });
    } catch (error) {
      console.error('Error generating QR page:', error);
      toast({
        title: t('qrCode.error'),
        description: 'A apărut o eroare la generarea paginii',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast({
      title: 'Link copiat!',
      description: 'Link-ul a fost copiat în clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Create a temporary container for high-res QR code
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';

    const tempQrDiv = document.createElement('div');
    tempContainer.appendChild(tempQrDiv);
    document.body.appendChild(tempContainer);

    // Create a temporary React root to render high-res QR code
    const highResSize = 2000; // 2000x2000 for print quality

    // Dynamically import and render QR code
    import('react-dom/client').then(({ createRoot }) => {
      const root = createRoot(tempQrDiv);
      root.render(
        React.createElement(QRCode, {
          value: generatedUrl,
          size: highResSize,
          level: 'H',
          bgColor: '#ffffff',
          fgColor: '#000000'
        })
      );

      // Wait for rendering to complete
      setTimeout(() => {
        const svg = tempQrDiv.querySelector('svg');
        if (!svg) {
          root.unmount();
          document.body.removeChild(tempContainer);
          return;
        }

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          canvas.width = highResSize;
          canvas.height = highResSize;
          ctx?.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);

          canvas.toBlob((blob) => {
            if (blob) {
              const downloadUrl = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = 'nunta360-qr-code-high-res.png';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(downloadUrl);
            }

            // Cleanup
            root.unmount();
            document.body.removeChild(tempContainer);
          });
        };

        img.src = url;
      }, 100);
    });
  };

  const getExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 60);
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-blush-100 p-3 rounded-lg">
            <QrCode className="w-8 h-8 text-blush-600" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-charcoal">
              {t('qrCode.title')}
            </h1>
            <p className="text-charcoal/60">
              Generează un cod QR pentru pagina de upload a invitaților
            </p>
          </div>
        </div>

        {!hasGenerated ? (
          <Card>
            <CardHeader>
              <CardTitle>Creează Pagină de Upload</CardTitle>
              <CardDescription>
                Generează un link unic unde invitații tăi pot urca poze și videoclipuri de la nuntă. Linkul va fi valabil 60 de zile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-sage-50 p-4 rounded-lg">
                <p className="text-sm text-charcoal/70">
                  <strong>Ce se va întâmpla:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-sm text-charcoal/70">
                  <li>• Se va genera un link unic și securizat</li>
                  <li>• Invitații vor putea scana codul QR pentru a accesa pagina</li>
                  <li>• Pot urca poze și videoclipuri direct pe platformă</li>
                  <li>• Linkul va fi activ până pe: <strong>{getExpiryDate()}</strong></li>
                </ul>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-blush-500 hover:bg-blush-600"
                size="lg"
              >
                <QrCode className="w-5 h-5 mr-2" />
                {isGenerating ? 'Se generează...' : 'Generează Cod QR'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Generated Link */}
            <Card>
              <CardHeader>
                <CardTitle>Link Generat</CardTitle>
                <CardDescription>
                  Distribuie acest link invitaților pentru a încărca poze
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-sage-50 rounded-lg break-all">
                  <p className="text-sm font-mono text-charcoal">{generatedUrl}</p>
                </div>

                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copiat!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiază Link
                    </>
                  )}
                </Button>

                <div className="text-xs text-charcoal/60 text-center">
                  Link activ până pe: <strong>{getExpiryDate()}</strong>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Display */}
            <Card>
              <CardHeader>
                <CardTitle>Cod QR</CardTitle>
                <CardDescription>
                  Scanează pentru a accesa pagina de upload
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  ref={qrRef}
                  className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center"
                >
                  <QRCode
                    value={generatedUrl}
                    size={200}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>

                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descarcă QR
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default QRCodePage;
