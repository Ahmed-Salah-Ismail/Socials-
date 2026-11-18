import axios from "axios";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthCreateContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "./../../components/comment/Loader/Loader";
import PostCard from "./../../components/post/PostCard";

export default function PagePost() {
  const { id } = useParams();
  const { token } = useContext(AuthCreateContext);

  function getPost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: token,
      },
    });
  }

  const { isLoading, isError, data } = useQuery({
    queryKey: ["post", id],
    queryFn: getPost,
    gcTime: 1000 * 60,
  });
  console.log(data);

  function getPostComment() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      headers: {
        token: token,
      },
    });
  }

  const { isLoading: commentLoading, data: commentData } = useQuery({
    queryKey: ["Comment", id],
    queryFn: getPostComment,
  });

  console.log("comment ", commentData);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>errors</p>;
  }

  return (
    <div className="p-18">
      <PostCard
        allComment={commentData?.data.data.comments}
        post={data?.data.data.post}
        showCommentBol={true}
      />
    </div>
  );
}
