import {
  FiCheck,
  FiHeart,
  FiMessageCircle,
  FiRepeat,
  FiUserPlus,
} from "react-icons/fi";

type NotificationType = "share" | "comment" | "like" | "follow";

interface NotificationCardProps {
  name: string;
  photo: string;
  type: NotificationType;
  text?: string;
  time: string;
  isUnread?: boolean;
  onMarkAsRead?: () => void;
}

const typeConfig = {
  share: {
    icon: <FiRepeat />,
    color: "text-green-600",
    label: "shared your post",
  },
  comment: {
    icon: <FiMessageCircle />,
    color: "text-blue-600",
    label: "commented on your post",
  },
  like: { icon: <FiHeart />, color: "text-rose-500", label: "liked your post" },
  follow: {
    icon: <FiUserPlus />,
    color: "text-purple-600",
    label: "followed you",
  },
};

export default function NotificationCard({
  name,
  photo,
  type,
  text,
  time,
  isUnread = false,
  onMarkAsRead,
}: NotificationCardProps) {
  const { icon, color, label } = typeConfig[type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors ${
        isUnread
          ? "bg-blue-50 border-blue-100"
          : "bg-white border-slate-200 hover:bg-slate-50"
      }`}
    >
      {/* الصورة + أيقونة النوع */}
      <div className="relative shrink-0">
        <img
          src={photo}
          alt=""
          className="w-11 h-11 rounded-full object-cover"
        />
        <span
          className={`absolute -bottom-2 -left-1 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow text-sm ${color}`}
        >
          {icon}
        </span>
      </div>

      {/* النص */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700">
          <span className="font-bold text-slate-900">{name}</span> {label}
        </p>
        {text && <p className="text-sm text-slate-500 truncate">{text}</p>}

        {isUnread && (
          <button
            onClick={onMarkAsRead}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <FiCheck />
            Mark as read
          </button>
        )}
      </div>

      {/* الوقت + النقطة */}
      <div className="flex items-center gap-2 shrink-0 text-xs text-slate-500">
        <span>{time}</span>
        {isUnread && <span className="w-2 h-2 rounded-full bg-blue-600" />}
      </div>
    </div>
  );
}
