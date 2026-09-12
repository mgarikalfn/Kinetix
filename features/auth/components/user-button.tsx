"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Client, Account } from "node-appwrite";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "../api/use-logout";
import { useCurrent } from "../api/use-current";
import { Loader, LogOut, Key, Edit } from "lucide-react";
import { ProfileModal } from "@/components/profile-modal";

export const UserButton = () => {
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  if (isLoading) {
    return (
      <div className="size-9 rounded-full flex items-center justify-center bg-[#1B1B1E] border border-white/[0.08]">
        <Loader className="size-4 animate-spin text-[#6366F1]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { name, email } = user;

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email?.charAt(0).toUpperCase() ?? "U";

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "68b5e4a9003ce7020d2b");

  const account = new Account(client);

  const handleForgotPassword = async (userEmail: string) => {
    try {
      await account.createRecovery(
        userEmail,
        `${window.location.origin}/auth/reset-password`
      );
      alert("Password reset instructions have been sent to your email.");
      setIsPasswordDialogOpen(false);
    } catch (error) {
      console.error("Error sending reset email:", error);
      alert("Failed to send reset email. Please check your email address.");
    }
  };

  const handleResetPasswordClick = () => {
    setResetEmail(email || "");
    setIsPasswordDialogOpen(true);
  };

  const handlePasswordDialogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail) {
      handleForgotPassword(resetEmail);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative">
          <Avatar className="size-9 hover:opacity-85 transition ring-1 ring-white/10 hover:ring-[#6366F1]/50 cursor-pointer">
            <AvatarFallback className="bg-gradient-to-tr from-[#571bc1] to-[#6366F1] font-semibold text-white text-xs flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          className="w-64 bg-[#1F1F22] border border-white/[0.1] text-[#F4F4F5] rounded-xl shadow-2xl p-1"
          sideOffset={10}
        >
          {/* User Info Section */}
          <div className="flex flex-col items-center gap-2 px-3 py-4">
            <Avatar className="size-14 ring-2 ring-[#6366F1]/40">
              <AvatarFallback className="bg-gradient-to-tr from-[#571bc1] to-[#6366F1] text-lg font-semibold text-white flex items-center justify-center">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center justify-center text-center mt-1">
              <p className="text-sm font-semibold text-white">
                {name || "Engineer"}
              </p>
              <p className="text-xs text-[#A1A1AA] truncate max-w-[200px] font-mono">
                {email}
              </p>
            </div>
          </div>

          <div className="h-px bg-white/[0.08] my-1" />

          {/* Profile Actions */}
          <DropdownMenuItem
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center px-3 py-2 text-xs font-medium cursor-pointer hover:bg-white/[0.06] rounded-lg text-[#E4E1E6] transition-colors"
          >
            <Edit className="w-3.5 h-3.5 mr-2 text-[#c0c1ff]" />
            Edit Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleResetPasswordClick}
            className="flex items-center px-3 py-2 text-xs font-medium cursor-pointer hover:bg-white/[0.06] rounded-lg text-[#E4E1E6] transition-colors"
          >
            <Key className="w-3.5 h-3.5 mr-2 text-amber-400" />
            Reset Password
          </DropdownMenuItem>

          <div className="h-px bg-white/[0.08] my-1" />

          {/* Logout */}
          <DropdownMenuItem
            onClick={() => logout()}
            className="flex items-center px-3 py-2 text-xs font-medium cursor-pointer hover:bg-red-500/10 rounded-lg text-rose-400 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={{ name: name || "", email: email || "" }}
      />

      {/* Password Reset Dialog */}
      {isPasswordDialogOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181B] border border-white/[0.1] p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-white">Reset Password</h3>
            <p className="text-xs text-[#A1A1AA]">
              Enter your email address and we will send you secure recovery instructions.
            </p>
            <form onSubmit={handlePasswordDialogSubmit} className="space-y-4">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full h-10 px-3 rounded-xl bg-[#121216] border border-white/[0.1] text-white placeholder:text-[#71717A] text-sm focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                required
              />
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordDialogOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white hover:bg-white/[0.06] rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl shadow-[0_0_12px_rgba(99,102,241,0.35)] hover:opacity-90 active:scale-95 transition-all"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};