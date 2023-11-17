import Container from "@/components/ui/container"
import { cn } from "@/lib/utils";
import React from "react";

type ContainerProps =
    React.HTMLAttributes<HTMLDivElement> &
    {
        className?: string,
        children: React.ReactNode;
    }

const CommContainer: React.FC<ContainerProps> = ({
    style, className, children
}) => {
    return (
        <Container>
            <div className={cn("bg-gray-600 bg-opacity-80 border rounded-lg ", className)} style={style}>
                {children}
            </div>
        </Container >
    );
};

export default CommContainer;
