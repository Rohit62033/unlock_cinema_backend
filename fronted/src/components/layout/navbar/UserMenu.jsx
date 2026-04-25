import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import AuthModal from "@/features/auth/AuthModel";
import { openAuthModal } from "@/store/uiSlice";

const UserMenu = () => {

  const dispatch = useDispatch()

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { user } = useSelector(
    (state) => state.auth
  );
  const avatarUrl = user?.avatar?.url?.trim();
console.log(avatarUrl);

  return (

    user ? (
      <button className="hidden md:flex items-center gap-2 text-slate-600 font-semibold px-4 py-1.5 rounded text-xs active:scale-[0.98] transition-transform" >

        <Avatar className="h-8 w-8">
          <AvatarImage
            key={avatarUrl}   // important
            src={avatarUrl || "https://github.com/shadcn.png"} />
          <AvatarFallback delayMs={600}>{user?.avatar.url}</AvatarFallback>
        </Avatar>

        {user?.username ? `${user?.username}` : 'Hii Guest'}
      </button >
    )
      : (
        <>
          <button
            onClick={() => { dispatch(openAuthModal()) }}
            className="bg-primary text-white font-medium py-1 px-3 rounded-md"
          >sign in </button>

        </>
      )



  );
};

export default UserMenu;