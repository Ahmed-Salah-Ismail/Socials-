import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Spinner, useOverlayState } from "@heroui/react";
import { FaImage, FaPen, FaTimes } from "react-icons/fa";
import { AuthCreateContext } from "../../context/authContext";

export default function CreatePost() {
  const state = useOverlayState();
  const { token } = useContext(AuthCreateContext);
  const queryClient = useQueryClient();

  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  function resetForm() {
    setBody("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  }

  function removeImage() {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function sendPost() {
    const formData = new FormData();
    if (body.trim()) formData.append("body", body.trim());
    if (image) formData.append("image", image);

    return axios.post("https://route-posts.routemisr.com/posts", formData, {
      headers: { token },
    });
  }

  const { mutate, isPending, isError } = useMutation({
    mutationFn: sendPost,
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      resetForm();
      state.close();
    },
    onError: function (err) {
      console.log("Error creating post:", err);
    },
  });

  const canPost = (body.trim().length > 0 || image !== null) && !isPending;

  return (
    <>
      <button
        onClick={state.open}
        className="group w-full flex items-center gap-3 p-4 mb-4 rounded-2xl bg-white shadow-sm hover:shadow-lg border border-slate-200 hover:border-sky-300 transition-all duration-300 cursor-pointer"
      >
        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          <FaPen />
        </span>
        <span className="flex-1 text-left px-5 py-3 rounded-full bg-slate-100 group-hover:bg-sky-50 text-slate-500 transition-colors">
          What's on your mind?
        </span>
        <span className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 text-sky-600 font-medium">
          <FaImage />
          Photo
        </span>
      </button>

      <Modal.Backdrop
        isOpen={state.isOpen}
        onOpenChange={state.setOpen}
        variant="blur"
        isDismissable={!isPending}
      >
        <Modal.Container placement="center" size="lg" scroll="inside">
          <Modal.Dialog>
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>Create post</Modal.Heading>
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
                    alt="Selected"
                    className="w-full max-h-72 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    aria-label="Remove image"
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer transition-colors"
                  >
                    <FaTimes />
                  </button>
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
                {image ? "Change photo" : "Add photo"}
              </Button>

              {isError && (
                <p className="text-sm text-red-500">
                  Couldn't publish your post. Check your connection and try
                  again.
                </p>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={state.close}
                isDisabled={isPending}
              >
                Cancel
              </Button>
              <Button onPress={() => mutate()} isDisabled={!canPost}>
                {isPending ? (
                  <>
                    <Spinner size="sm" color="current" /> Posting
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
