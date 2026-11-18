import { useContext, useEffect, useState } from "react";
import { AuthCreateContext } from "../../context/authContext";
import axios from "axios";
import { AiFillLike } from "react-icons/ai";
import { FaComment, FaCommentDots, FaShare } from "react-icons/fa";
import PostCard from "../../components/post/PostCard";
import { Loader } from "../../components/comment/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import CreatePost from "../../components/CreatePost/CreatePost";

export interface Root {
  success: boolean;
  message: string;
  data: Data;
  meta: Meta;
}

export interface Data {
  posts: PostType[];
}

export interface PostType {
  _id: string;
  body?: string;
  image?: string;
  privacy: string;
  user: User;
  sharedPost?: SharedPost;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment?: TopComment2;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface SharedPost {
  _id: string;
  image?: string;
  privacy: string;
  user: User2;
  sharedPost: any;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment?: TopComment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  body?: string;
}

export interface User2 {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface TopComment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: any;
  likes: any[];
  createdAt: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface TopComment2 {
  _id: string;
  content: string;
  image?: string;
  commentCreator: CommentCreator2;
  post: string;
  parentComment: any;
  likes: any[];
  createdAt: string;
}

export interface CommentCreator2 {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
  total: number;
}

export default function Home() {
  const { token } = useContext(AuthCreateContext);
  // const [posts, setPosts] = useState<PostType[] | null>(null);
  // const [loading, setLoading] = useState(true);

  function getAllPosts() {
    // try {
    return axios.get("https://route-posts.routemisr.com/posts", {
      headers: {
        token: token,
      },
    });
    //   setPosts(data.data.posts);
    //   // console.log("posts", data.data.posts);
    // } catch (error) {
    //   console.log("Error fetching posts:", error);
    // } finally {
    //   setLoading(false);
    // }
  }

  // useEffect(() => {
  //   getAllPosts();
  // }, []);

  const { isLoading, data, isError, isFetching } = useQuery({
    queryFn: getAllPosts,
    queryKey: ["posts"],
  });

  // console.log("data", data?.data.data);
  // console.log("isLoading", isLoading);
  // console.log("isError", isError);
  // console.log("isFetching", isFetching);

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div>Error fetching posts</div>;
  }

  return (
    <div className="bg-slate-50 pt-18">
      <div className="w-1/2 bg-slate-300 mx-auto p-4">
        <CreatePost />
        {data?.data?.data.posts.map(function (post: PostType) {
          return <PostCard post={post} key={post._id} />;
        })}
      </div>
    </div>
  );
}
