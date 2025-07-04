
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface JumpToDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxIndex: number;
  onJump: (index: number) => void;
}

export const JumpToDialog: React.FC<JumpToDialogProps> = ({
  open,
  onOpenChange,
  maxIndex,
  onJump
}) => {
  const [jumpValue, setJumpValue] = useState('');

  const handleJump = () => {
    const num = parseInt(jumpValue);
    if (num >= 1 && num <= maxIndex) {
      onJump(num);
      onOpenChange(false);
      setJumpValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJump();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Jump to Paper</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="jump-input">
              Paper number (1-{maxIndex}):
            </Label>
            <Input
              id="jump-input"
              type="number"
              min="1"
              max={maxIndex}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Enter number 1-${maxIndex}`}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleJump}
            disabled={!jumpValue || parseInt(jumpValue) < 1 || parseInt(jumpValue) > maxIndex}
          >
            Jump
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
