import { Link } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";

interface SharedPostPreviewProps {
  post: {
    _id: string;
    body?: string;
    image?: string;
    user: { name: string; username: string; photo: string };
  };
  showOriginalLink?: boolean;
}

export default function SharedPostPreview({
  post,
  showOriginalLink = false,
}: SharedPostPreviewProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.user.photo}
          alt=""
          className="w-11 h-11 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 truncate">
            {post.user.name}
          </p>
          <p className="text-sm text-slate-500 truncate">
            @{post.user.username}
          </p>
        </div>

        {showOriginalLink && (
          <Link
            to={`/PagePost/${post._id}`}
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Original Post
            <FiExternalLink />
          </Link>
        )}
      </div>

      {post.body && <p className="mb-3 text-slate-800">{post.body}</p>}

      {post.image && (
        <img
          src={post.image}
          alt=""
          className="w-full max-h-[420px] object-cover rounded-xl"
        />
      )}
    </div>
  );
}
