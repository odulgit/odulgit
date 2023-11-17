import { BellRing, Check, Container } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type TopBountyCardProps = React.ComponentProps<typeof Card> & {
    description: string
    contract: string
    bounty: number
}

export function TopBountyCard({ className, ...props }: TopBountyCardProps) {
    return (
        <Card className={cn("w-[328px] bg-gray-600 bg-opacity-90 border-gray-700 border", className)} {...props}>
            <CardHeader className="p-6 pb-1">
                <div>{props.bounty}</div>
                <CardTitle>
                    <div className="pb-4 border-b">
                        {props.title}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardDescription className="px-6 pt-0 pb-3">
                {props.description}
            </CardDescription>
            <CardFooter>
                <Button className="w-fit" key={props.contract}>
                    Check for more
                </Button>
            </CardFooter>
        </Card>
    )
}
