
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import GuestForm from './GuestForm';

interface GuestFormPopupProps {
  open: boolean;
  onClose: () => void;
}

const GuestFormPopup: React.FC<GuestFormPopupProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-blush-100 shadow-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Guest Form</DialogTitle>
        </DialogHeader>
        <GuestForm 
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GuestFormPopup;
