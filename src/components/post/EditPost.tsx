import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Spinner } from "@heroui/react";
import { FaImage, FaTimes } from "react-icons/fa";
import { AuthCreateContext } from "../../context/authContext";
import type { PostType } from "../../pages/home/Home";

interface EditPostProps {
  post: PostType;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function EditPost({
  post,
  isOpen,
  onOpenChange,
}: EditPostProps) {
  const { token } = useContext(AuthCreateContext);
  const queryClient = useQueryClient();

  const [body, setBody] = useState(post.body ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(post.image ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // كل ما الـ modal يتفتح، رجّع الحقول لقيم البوست الحالية
  useEffect(() => {
    if (isOpen) {
      setBody(post.body ?? "");
      setImage(null);
      setPreview(post.image ?? null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [isOpen, post.body, post.image]);

  // معاينة الصورة الجديدة
  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  }

  function removeNewImage() {
    setImage(null);
    setPreview(post.image ?? null); // ارجع للصورة القديمة
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function updatePost() {
    const formData = new FormData();
    formData.append("body", body.trim());
    if (image) formData.append("image", image);

    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}`,
      formData,
      { headers: { token } },
    );
  }

  const { mutate, isPending, isError } = useMutation({
    mutationFn: updatePost,
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });
      onOpenChange(false);
    },
    onError: function (err) {
      console.log("Error updating post:", err);
    },
  });

  const hasChanges = body.trim() !== (post.body ?? "") || image !== null;
  const canSave =
    (body.trim().length > 0 || preview !== null) && hasChanges && !isPending;

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      variant="blur"
      isDismissable={!isPending}
    >
      <Modal.Container placement="center" size="lg" scroll="inside">
        <Modal.Dialog>
          <Modal.CloseTrigger />

          <Modal.Header>
            <Modal.Heading>Edit post</Modal.Heading>
          </Modal.Header>

          <Modal.Body className="flex flex-col gap-4">
            <textarea
              autoFocus
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              disabled={isPending}
              className="w-full resize-none rounded-xl bg-slate-100 p-3 outline-none focus:ring-2 focus:ring-sky-400 transition-all disabled:opacity-60"
            />

            {preview && (
              <div className="relative">
                <img
                  src={preview}
                  alt="Post"
                  className="w-full max-h-72 object-cover rounded-xl"
                />
                {image && (
                  <button
                    type="button"
                    onClick={removeNewImage}
                    aria-label="Discard new image"
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer transition-colors"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <Button
              variant="outline"
              onPress={() => fileInputRef.current?.click()}
              isDisabled={isPending}
              className="self-start"
            >
              <FaImage />
              {preview ? "Change photo" : "Add photo"}
            </Button>

            {isError && (
              <p className="text-sm text-red-500">
                Couldn't update your post. Check your connection and try again.
              </p>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onPress={() => onOpenChange(false)}
              isDisabled={isPending}
            >
              Cancel
            </Button>
            <Button onPress={() => mutate()} isDisabled={!canSave}>
              {isPending ? (
                <>
                  <Spinner size="sm" color="current" /> Saving
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
