import Container from "@/components/ui/container"

interface ContainerProps {
    children: React.ReactNode;
}

const CommContainer: React.FC<ContainerProps> = ({
    children
}) => {
    return (
        <Container>
            <div className="bg-gray-600 bg-opacity-80 border border-gray-700 rounded-lg">
                {children}
            </div>
        </Container>
    );
};

export default CommContainer;
