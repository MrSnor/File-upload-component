import { Previews } from "@/components/FileUploadAndPrev/Previews";
import { cn } from "@/lib/utils";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const scaleUp = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

const FileUpload = (props) => {
  const [files, setFiles] = useState([]);
  const [imageSent, setImageSent] = useState([]);
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "image/*": [] },
      onDrop: (acceptedFiles) => {
        setFiles((prevFiles) => {
          const newFiles = acceptedFiles.filter((file) => {
            return !prevFiles.some((prevFile) => prevFile.name === file.name);
          });

          return [
            ...prevFiles,
            ...newFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              }),
            ),
          ];
        });
      },
      disabled: isLoading,
    });

  const uploadFiles = async () => {
    const formData = new FormData();
    console.log(files);
    formData.append("image", files);
    formData.append("key", import.meta.env.VITE_IMGBB_KEY);
    // set expiration for image upload
    formData.append("expiration", 100);

    try {
      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // upload all files using foreach
  const uploadAllFiles = async () => {
    console.log("upload all files clicked");

    files.forEach(async (file) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("key", import.meta.env.VITE_IMGBB_KEY);
      // set expiration for image upload
      // formData.append("expiration", 100);
      try {
        setIsLoading(true);

        const response = await axios.post(
          "https://api.imgbb.com/1/upload",
          formData,
        );
        setIsLoading(false);
        console.log(response.data);
        // add response to imageSent array
        setImageSent((prevImageSent) => [...prevImageSent, response.data]);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="group container overflow-y-hidden">
      {/* button to upload files */}
      <button
        type="button"
        className="mx-auto my-4 block rounded border border-blue-500 p-1 text-blue-500 transition-colors hover:bg-blue-500 hover:text-white"
        onClick={() => {
          uploadAllFiles();
          console.log(files);
        }}
      >
        Upload
      </button>
      {/* button to reset files list */}
      <button
        type="button"
        className="my-4 ml-auto block rounded border border-red-500 p-1 text-rose-500 transition-colors hover:bg-rose-500 hover:text-white"
        onClick={() => setFiles([])}
      >
        Reset
      </button>
      <div
        className={cn(
          "flex cursor-pointer flex-col items-center rounded border-2 border-dashed border-gray-400 bg-gray-100 p-5 py-32 text-gray-500 outline-none transition-colors duration-200 ease-in-out hover:border-gray-700 group-hover:text-gray-700",
          {
            "border-blue-400": isFocused,
          },
          {
            "border-green-400": isDragAccept,
          },
          {
            "border-red-400": isDragReject,
          },
          isLoading && "cursor-not-allowed opacity-50",
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={scaleUp}
              key={"loading"}
            >
              <Loader2 className="mx-auto h-12 w-12 animate-spin" />
              <p>Uploading {files.length} files...</p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={scaleUp}
              key={"dropzone"}
            >
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m16 16-4-4-4 4" />
              </svg>
              <p>Drag 'n' drop some files here, or click to select files</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Use the Previews component */}
      <Previews files={files} setFiles={setFiles} />{" "}
      {/* show uploaded files with link and thumbnails */}
      <div className="mt-4 grid grid-cols-1 gap-5 space-y-2 md:grid-cols-2">
        {imageSent.length > 0 && (
          <p className="col-span-full py-3 text-center">Uploaded Files</p>
        )}

        {imageSent.map((image) => (
          <div
            className="flex flex-col items-center justify-between gap-2 text-black md:flex-row"
            key={image.data.url}
          >
            <img
              src={image.data.thumb.url}
              alt="uploaded image"
              className="aspect-video"
            />
            <p>{image.data.url}</p>
            <a
              href={image.data.url_viewer}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                className="h-6 w-6 stroke-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
