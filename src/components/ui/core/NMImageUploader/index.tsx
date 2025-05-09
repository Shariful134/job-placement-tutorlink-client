import { Dispatch, SetStateAction } from "react";
import { Input } from "../../input";
import { cn } from "@/lib/utils";

type TImageUploaderProps = {
  label?: string;
  className?: string;
  setImagePreview: Dispatch<SetStateAction<string[]>>;
  setImageFiels: Dispatch<SetStateAction<File[]>>;
};

const NMImageUploader = ({
  label = "Upload Images",
  className,
  setImagePreview,
  setImageFiels,
}: TImageUploaderProps) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    console.log(event.target.files);

    setImageFiels((prev) => [...prev, file]);

    if (file) {
      const reader = new FileReader();
      console.log(reader);
      reader.onloadend = () => {
        setImagePreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };
  return (
    <div className={cn("flex flex-col items-center w-full gap-4", className)}>
      <Input
        onChange={handleImageChange}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="w-full h-20 mb-1 md:size-36 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full cursor-pointer text-center text-sm text-gray-500 hover:bg-gray-50 transition"
      >
        {label}
      </label>
    </div>
  );
};

export default NMImageUploader;
