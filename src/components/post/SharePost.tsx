import { Button, Modal } from "@heroui/react";
import SharedPostPreview from "./SharedPostPreview";
import type { PostType } from "../../pages/home/Home";
import { useContext, useRef } from "react";
import axios from "axios";
import { AuthCreateContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SharePostProps {
  post: PostType;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function SharePost({
  post,
  isOpen,
  onOpenChange,
}: SharePostProps) {
  const postHeader = useRef<HTMLTextAreaElement | null>(null);
  //   console.log(postHeader.current?.value);
  const { token, userId } = useContext(AuthCreateContext);
  const QueryClient = useQueryClient();

  function sharePost() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/share`,
      {
        body: postHeader.current?.value.trim() ?? "",
      },
      {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: sharePost,
    onSuccess: function () {
      if (postHeader.current) postHeader.current.value = "";
      QueryClient.invalidateQueries({ queryKey: ["posts"] });
      onOpenChange(false);
    },
    onError: function (err) {
      console.log("Error sending comment:", err);
    },
  });

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} variant="blur">
      <Modal.Container placement="center" size="lg" scroll="inside">
        <Modal.Dialog>
          <Modal.CloseTrigger />

          <Modal.Header>
            <Modal.Heading>Share post</Modal.Heading>
          </Modal.Header>

          <Modal.Body className="flex flex-col gap-4">
            <textarea
              ref={postHeader}
              rows={4}
              placeholder="Say something about this..."
              className="w-full min-h-32 resize-none rounded-2xl border border-slate-200 bg-white p-4 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />

            <SharedPostPreview post={post} />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline" slot="close">
              Cancel
            </Button>
            <Button
              onPress={() => mutate()}
              isDisabled={isPending}
              className="bg-blue-600 text-white"
            >
              {isPending ? "Sharing..." : "Share now"}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
