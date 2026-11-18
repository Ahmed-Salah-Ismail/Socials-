import React, { useContext, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaCommentDots, FaRocket, FaShare } from "react-icons/fa";
import type { PostType } from "../../pages/home/Home";
import CommentCard from "../comment/CommentCard";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthCreateContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useOverlayState } from "@heroui/react";
import EditPost from "./EditPost";
import { Button, Dropdown, Label, Spinner, toast } from "@heroui/react";
import { HiDotsHorizontal } from "react-icons/hi";
import DeletingPost from "../DeletingPost";
import SharePost from "./SharePost";
import SharedPostPreview from "./SharedPostPreview";

interface PostCardProps {
  post: PostType;
  allComment?: any[];
  showCommentBol: boolean;
}

export default function PostCard({
  post,
  allComment,
  showCommentBol = false,
}: PostCardProps) {
  const [commentInput, setcommentInput] = useState("");
  const { token, userId } = useContext(AuthCreateContext);
  const state = useOverlayState({
    defaultOpen: false,
    onOpenChange: (isOpen) => console.log(isOpen),
  });

  const editState = useOverlayState();

  const shareState = useOverlayState();

  const QueryClient = useQueryClient();
  function sendComment() {
    let commentData = {
      content: commentInput,
    };
    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/comments`,
      commentData,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: sendComment,
    onSuccess: function () {
      setcommentInput("");
      QueryClient.invalidateQueries({
        queryKey: ["Comment", post._id],
      });
      QueryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
    onError: function (err) {
      console.log("Error sending comment:", err);
    },
  });

  function deletPost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
      headers: {
        token: token,
      },
    });
  }

  const isLiked = !!userId && post.likes.includes(userId);

  function LikePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}/like`,
      null,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { isPending: isLiking, mutate: mutateLikePost } = useMutation({
    mutationFn: LikePost,
    onSuccess: function () {
      QueryClient.invalidateQueries({ queryKey: ["posts"] });
      QueryClient.invalidateQueries({ queryKey: ["post", post._id] });
      console.log("done");
    },
    onError: function (err) {
      console.log("Error liking post:", err);
    },
  });

  const [ShowComment, setShowCmment] = useState(showCommentBol);

  function handelComment() {
    if (ShowComment) {
      setShowCmment(false);
    } else {
      setShowCmment(true);
    }
  }

  const {
    error,
    isPending: isDeleting,
    mutate: MutateDeletPost,
  } = useMutation({
    mutationFn: deletPost,

    onSuccess: function () {
      toast.success("Poste Deleted");
      QueryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("done");
    },

    onError: function () {
      toast.danger("posted is not delet");
    },
  });
  if (isDeleting) {
    return <DeletingPost />;
  }

  return (
    <>
      <div key={post.id} className="bg-slate-50 p-3 my-4 rounded-2xl ">
        <div className="flex items-center justify-between gap-1 mb-3 my-4">
          <div className="flex  items-center gap-2">
            <div>
              {" "}
              <img
                src={post.user.photo}
                className="w-10 h-10 my-4 rounded-bl-full"
                alt=""
              />
            </div>

            <div>
              <p>{post.user.name}</p>
              <Link to={`/PagePost/${post._id}`}>
                {new Date(post.createdAt).toLocaleDateString("en-us", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Link>
            </div>
          </div>

          <div>
            <Dropdown>
              <Button aria-label="Menu" variant="secondary">
                <HiDotsHorizontal />
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu
                  onAction={(key) => {
                    if (key === "edit-file") editState.open();
                    if (key === "delete-file") mutateDeletePost();
                  }}
                >
                  {userId === post.user._id ? (
                    <>
                      <Dropdown.Item id="edit-file" textValue="Edit file">
                        <Button variant="secondary" onClick={state.open}>
                          Edit Post <MdEdit />
                        </Button>
                      </Dropdown.Item>
                      <Dropdown.Item
                        id="delete-file"
                        textValue="Delete file"
                        variant="danger"
                      >
                        <Button
                          className="bg-danger text-white"
                          onClick={MutateDeletPost}
                        >
                          Delete Post <MdDelete />
                        </Button>
                        <Label></Label>
                      </Dropdown.Item>
                    </>
                  ) : (
                    <Dropdown.Item id="copy-link" textValue="Copy link">
                      <Label>Save Post</Label>
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </div>

        <div>
          <p>{post.body}</p>
          {post.image && <img src={post.image} alt="" />}
        </div>

        {post.sharedPost && (
          <div className="mt-3">
            <SharedPostPreview post={post.sharedPost} showOriginalLink />
          </div>
        )}

        <div className="flex col justify-between my-4 ">
          <button
            onClick={() => mutateLikePost()}
            disabled={isLiking}
            className={`px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-200 active:scale-95 ${
              isLiked
                ? "bg-sky-100 text-sky-600 font-semibold"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <AiFillLike className={isLiked ? "text-sky-500" : ""} />
            {isLiked ? "Liked" : "Like"}
            {/* {post.likesCount > 0 && <span>({post.likesCount})</span>} */}
          </button>
          <button
            onClick={handelComment}
            className={`px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-200 active:scale-95 ${
              ShowComment
                ? "bg-sky-100 text-sky-600 font-semibold"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FaCommentDots className={ShowComment ? "text-sky-500" : ""} />
            {ShowComment ? " comments" : "Comment"}
            {post.commentsCount > 0 && <span>({post.commentsCount})</span>}
          </button>
          <button
            className="px-4 py-2 rounded-xl cursor-pointer bg-white flex items-center gap-2"
            onClick={shareState.open}
          >
            <FaShare />
            Share
          </button>
        </div>

        {((allComment && allComment.length > 0) || post.topComment) && (
          <div className="p-4 my-4 ">
            {allComment && allComment.length > 0 ? (
              allComment.map((comments) => (
                <CommentCard
                  key={comments._id || comments.id}
                  comment={comments}
                />
              ))
            ) : (
              <CommentCard comment={post.topComment} />
            )}
          </div>
        )}

        {ShowComment ? (
          <div className="flex items-center gap-2 mt-3 p-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setcommentInput(e.target.value)}
              className="flex-1 px-4 py-2 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={mutate}
              disabled={isPending}
              className="px-5 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-full transition-colors shadow-sm flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <Spinner /> Loading
                </>
              ) : (
                <>
                  <FaCommentDots /> comment
                </>
              )}
            </button>
          </div>
        ) : (
          <div></div>
        )}
        {/* <div className="flex items-center gap-2 mt-3 p-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => setcommentInput(e.target.value)}
            className="flex-1 px-4 py-2 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={mutate}
            disabled={isPending}
            className="px-5 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-full transition-colors shadow-sm flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Spinner /> Loading
              </>
            ) : (
              <>
                <FaCommentDots /> comment
              </>
            )}
          </button>
        </div> */}
        <EditPost
          post={post}
          isOpen={editState.isOpen}
          onOpenChange={editState.setOpen}
        />
      </div>

      <SharePost
        post={post}
        isOpen={shareState.isOpen}
        onOpenChange={shareState.setOpen}
      />
    </>
  );
}
