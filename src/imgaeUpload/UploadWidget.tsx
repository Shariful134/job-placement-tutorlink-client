"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { getAllUsers } from "@/services/User";
const UploadWidget = ({
  onImageUpload,
}: {
  onImageUpload: (url: string) => void;
}) => {
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { user } = useUser();
  const [tutor, setTutor] = useState<any>([]);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        if (!user?.userEmail) return;
        const data = await getAllUsers();
        if (data?.data) {
          const foundTutor = data.data.find(
            (item: any) => item.email === user?.userEmail
          );
          setTutor(foundTutor || null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTutor();
  }, [user?.userEmail]);

  const profileImage = tutor?.profileImage;
  console.log("profileImage:", profileImage);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;

    script.onload = () => {
      cloudinaryRef.current = (window as any).cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: "dhobkuiqj",
          uploadPreset: "yyuploadImage",
        },
        function (error: any, result: any) {
          if (result && result.event === "success") {
            setImageUrl(result.info.secure_url);
            onImageUpload(result.info.secure_url);
          }
        }
      );
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onImageUpload]);
  return (
    <div>
      {imageUrl ? (
        <Avatar
          onClick={() => widgetRef.current.open()}
          className="h-[80px] w-[80px] cursor-pointer"
        >
          <AvatarImage src={imageUrl} alt="@shadcn" />
        </Avatar>
      ) : (
        <div>
          {profileImage ? (
            <Avatar
              onClick={() => widgetRef.current.open()}
              className="h-[80px] w-[80px] cursor-pointer"
            >
              <AvatarImage src={profileImage} alt="@shadcn" />
            </Avatar>
          ) : (
            <Button
              className="border-gray-300 border-1  rounded-full h-[80px] w-[80px] cursor-pointer hover:bg-gray-100"
              onClick={() => widgetRef.current.open()}
            >
              Upload
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
