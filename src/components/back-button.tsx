import { ArrowLeftIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      onClick={() => navigate(-1)}
      className="text-primary"
    >
      <ArrowLeftIcon size={20} />
    </Button>
  );
};

export default BackButton;
