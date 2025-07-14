import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function TestDialog() {
  return (
    <div style={{ padding: 40 }}>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Test Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <div style={{ padding: 40 }}>Dialog works!</div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 