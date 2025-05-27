
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import WeddingDetailsForm from './WeddingDetailsForm';

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-blush-100 shadow-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Wedding Details</DialogTitle>
        </DialogHeader>
        <WeddingDetailsForm 
          onSuccess={onClose}
          onSkip={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
