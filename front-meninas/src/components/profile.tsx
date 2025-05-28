import { useAuth } from "@/providers/auth-provider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(" ")
    .map((c) => c.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  return initials || "NA";
};

export const Profile = () => {
  const { user, logOut } = useAuth();

  if (!user) return <div></div>;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer ">
          <AvatarImage src={""} alt={user.name} />
          <AvatarFallback className="bg-blue-100">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[400px]">
        <div className="grid gap-2">
          <div className="space-y-2">
            <h4 className="font-bold leading-none">Informações da conta</h4>
            <p className="text-sm text-muted-foreground leading-2">
              Gerenciar conta
            </p>
          </div>
          <Separator />
          <div className="grid gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg ">
                  <AvatarImage src={""} alt={user.name} />
                  <AvatarFallback className="size-8 rounded-lg bg-blue-100">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </div>{" "}
            <Separator />
            <div className="grid grid-cols-2">
              <div className="grid col-span-2">
                <Button
                  onClick={() => {
                    toast("Tchau tchau 👋");
                    setTimeout(() => {
                      logOut();
                    }, 800);
                  }}
                  type="button"
                  variant="secondary"
                  size="sm">
                  <LogOut className="size-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
