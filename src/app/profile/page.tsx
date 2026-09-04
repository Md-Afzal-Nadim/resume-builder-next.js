"use client";

import { useEffect, useState } from "react";
import { getProfileApi } from "@/apis/auth.api";
import { Mail, Phone, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await getProfileApi();
        if (data.success) {
          setUser(data.data.user);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 border-b border-[#E4DFD4] pb-6">
          <h1 className="font-serif text-3xl text-[#1C1F26]">My profile</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Your account details.
          </p>
        </div>

        {loading && (
          <div className="border border-[#E4DFD4] bg-white p-10">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 animate-pulse bg-[#EFEBE1]" />
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse bg-[#EFEBE1]" />
                <div className="h-3 w-24 animate-pulse bg-[#EFEBE1]" />
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="h-3 w-2/3 animate-pulse bg-[#EFEBE1]" />
              <div className="h-3 w-1/2 animate-pulse bg-[#EFEBE1]" />
            </div>
          </div>
        )}

        {!loading && !user && (
          <div className="border border-dashed border-[#D8D2C4] bg-white/60 px-8 py-16 text-center">
            <p className="text-sm text-[#6B7280]">
              We couldn't load your profile. Try refreshing the page.
            </p>
          </div>
        )}

        {!loading && user && (
          <div className="border border-[#E4DFD4] bg-white p-10">
            {/* Identity */}
            <div className="flex items-center gap-5 border-b border-[#E4DFD4] pb-6">
              <div className="flex h-16 w-16 items-center justify-center border border-[#E4DFD4] bg-[#FAF8F3] font-serif text-xl text-[#8B3A3A]">
                {initials || <UserIcon size={22} className="text-[#B8B2A2]" />}
              </div>
              <div>
                <h2 className="font-serif text-xl text-[#1C1F26]">
                  {user.name || "Unnamed user"}
                </h2>
                <p className="mt-0.5 text-sm text-[#6B7280]">{user.email}</p>
              </div>
            </div>

            {/* Details */}
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#B8B2A2]" />
                <div>
                  <p className="text-xs text-[#B8B2A2]">Email</p>
                  <p className="text-sm text-[#1C1F26]">{user.email || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#B8B2A2]" />
                <div>
                  <p className="text-xs text-[#B8B2A2]">Mobile</p>
                  <p className="text-sm text-[#1C1F26]">{user.mobile || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}