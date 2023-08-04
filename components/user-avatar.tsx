
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

export const UserAvatar = () => {
  const { user } = useUser();

  // Check if user and profileImageUrl exist before rendering
  if (!user || !user.profileImageUrl) {
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-black bg-black">
          {/* Provide a fallback content if no image is available */}
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user.profileImageUrl} />
      <AvatarFallback className="text-black bg-black">
        {user?.firstName?.charAt(0)}
        {user?.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
