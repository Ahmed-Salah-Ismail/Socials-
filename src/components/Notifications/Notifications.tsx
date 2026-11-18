import axios from "axios";
import React, { useContext } from "react";
import { AuthCreateContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "../comment/Loader/Loader";
import NotificationCard from "./NotificationCard";
import { IoCheckmarkDone } from "react-icons/io5";

export default function Notifications() {
  const { token, userId } = useContext(AuthCreateContext);

  function getNotifications() {
    return axios.get("https://route-posts.routemisr.com/notifications", {
      params: { page: 1, limit: 10 },
      headers: {
        token: token,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: getNotifications,
  });

  const notifications = data?.data?.data?.notifications ?? [];
  console.log("notfi", notifications);
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  function mapType(apiType: string) {
    if (apiType.startsWith("like")) return "like";
    if (apiType.startsWith("comment")) return "comment";
    if (apiType.startsWith("follow")) return "follow";
    if (apiType.startsWith("share")) return "share";
    return "comment"; // أي نوع تاني مش معروف
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  }

  function markAsRead(id: string) {
    return axios.patch(
      `https://route-posts.routemisr.com/notifications/${id}/read`,
      null,
      {
        headers: {
          token: token,
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  const queryClient = useQueryClient();

  const { mutate: mutateMarkAsRead } = useMutation({
    mutationFn: markAsRead,
    onSuccess: function (_res, id) {
      queryClient.setQueryData(["notifications", "list"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              notifications: old.data.data.notifications.map((n: any) =>
                n._id === id ? { ...n, isRead: true } : n,
              ),
            },
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: ["notifications", "navbar"] });
    },
  });

  function markAsReadAll() {
    return axios.patch(
      `https://route-posts.routemisr.com/notifications/read-all`,
      null,
      {
        headers: {
          token: token,
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { isPending, mutate: mutateMarkAllAsRead } = useMutation({
    mutationFn: markAsReadAll,
    onSuccess: function () {
      queryClient.setQueryData(["notifications", "list"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              notifications: old.data.data.notifications.map((n: any) => ({
                ...n,
                isRead: true,
              })),
            },
          },
        };
      });
      queryClient.invalidateQueries({ queryKey: ["notifications", "navbar"] });
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return <p className="p-18">Couldn't load notifications</p>;
  console.log("userId:", userId);

  return (
    <div className="bg-slate-100 pt-18 min-h-screen">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* الهيدر */}
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Notifications
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Realtime updates for likes, comments, shares, and follows.
              </p>
            </div>

            <button
              onClick={() => mutateMarkAllAsRead()}
              disabled={isPending || unreadCount === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <IoCheckmarkDone className="text-lg" />
              {isPending ? "Marking..." : "Mark all as read"}
            </button>
          </div>

          {/* التابات */}
          <div className="flex items-center gap-2 mt-4">
            <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-semibold cursor-pointer">
              All
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 cursor-pointer transition-colors">
              Unread
              <span className="px-2 py-0.5 rounded-full bg-white text-xs text-blue-600">
                {unreadCount}
              </span>
            </button>
          </div>
        </div>

        {/* القايمة */}
        <div className="flex flex-col gap-3 p-4">
          {notifications.map((n: any) => (
            <NotificationCard
              key={n._id}
              name={n.actor.name}
              photo={n.actor.photo}
              type={mapType(n.type)}
              text={n.entity?.body ?? n.entity?.content ?? n.entity?.name}
              time={timeAgo(n.createdAt)}
              isUnread={!n.isRead}
              onMarkAsRead={() => mutateMarkAsRead(n._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
