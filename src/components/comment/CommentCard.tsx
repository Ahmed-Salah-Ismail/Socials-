import React from "react";
import type { PostType } from "../../pages/home/Home";
interface CommentCardProps {
  post: PostType;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <>
      <div className="flex items-center gap-4 my-4 p-2 rounded-2xl bg-gray-200 w-full ">
        <img
          className="w-8 h-8 rounded-full"
          src={comment?.commentCreator?.photo}
          alt=""
        />
        <div>
          <p>{comment.commentCreator.name}</p>
          <p>{comment.content}</p>
        </div>
      </div>
    </>
  );
}
