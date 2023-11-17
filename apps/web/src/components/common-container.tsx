import Container from "@/components/ui/container"
import { cn } from "@/lib/utils";

interface ContainerProps {
    className?: string,
    children: React.ReactNode;
}

const CommContainer: React.FC<ContainerProps> = ({
    className, children
}) => {
    return (
        <Container>
            <div className={cn("bg-gray-600 bg-opacity-80 border rounded-lg", className)}>
                {children}
            </div>
        </Container >
    );
};

export default CommContainer;
