import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUserStore from "@/store/user-store";
import { SettingsIcon } from "lucide-react";

const slippageToleranceOptions = [0.1, 0.5, 1];

type Props = {
  trigger?: JSX.Element;
};

export function SettingModal({ trigger }: Props) {
  const { slippageTolerance, txDeadline } = useUserStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="ghost" size={"icon"}>
            <SettingsIcon size={20} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#18191a] text-white border-none">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label className="block mb-4 text-lg font-medium">
              Slippage Tolerance
            </Label>
            <div className="grid grid-cols-4 gap-1">
              {slippageToleranceOptions.map((option, key) => (
                <Button
                  key={key}
                  variant={"secondary"}
                  onClick={() =>
                    useUserStore.setState({ slippageTolerance: option })
                  }
                  className="h-9 bg-[#131c25]"
                >
                  {option}%
                </Button>
              ))}
              <div className="flex items-center gap-1">
                <Input
                  className="h-9 text-black"
                  value={slippageTolerance}
                  type="number"
                  min={0}
                  step={0.1}
                  onChange={(e) =>
                    useUserStore.setState({ slippageTolerance: Number(e.target.value) })
                  }
                />
                %
              </div>
            </div>
            {slippageTolerance < 0.5 && (
              <p className="mt-1 text-sm text-yellow-600 ">
                Your transaction may fail
              </p>
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label className="text-lg font-medium">Tx deadline (mins)</Label>
            <Input
              type="number"
              className="w-16 h-9 text-black"
              min={2}
              value={txDeadline}
              onChange={(e) =>
                useUserStore.setState({ txDeadline: Number(e.target.value) })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
