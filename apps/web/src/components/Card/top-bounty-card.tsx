import { BellRing, Check, Container } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

type TopBountyCardProps = React.ComponentProps<typeof Card> & {
  description: string;
  contract: string;
  bounty: number;
};

export function TopBountyCard({ className, ...props }: TopBountyCardProps) {
  const handleContinued = () => {
    toast({
      title: "OdulGit",
      description: `See you very soon!`,
    });
  };
  
  const { toast } = useToast();

  return (
    <Card
      className={cn(
        "w-[328px] bg-gray-600 bg-opacity-90 border-gray-700 border",
        className
      )}
      {...props}
    >
      <CardHeader className="p-6 py-3">
        <div className="flex text-xl font-roboto-bold items-center justify-end">
          <Badge variant="default">Ξ {props.bounty}</Badge>
        </div>
        <CardTitle>
          <div className="pb-4 border-b">{props.title}</div>
        </CardTitle>
      </CardHeader>
      <CardDescription className="px-6 pt-0 pb-3">
        {props.description}
      </CardDescription>
      <CardFooter className="flex justify-end">
        <Button
          className="w-fit"
          key={props.contract}
          onClick={() => handleContinued()}
        >
          Check for more
        </Button>
      </CardFooter>
    </Card>
  );
}
