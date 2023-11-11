import { Previews } from "@/components/FileUploadAndPrev/Previews";
import { UploadedFiles } from "@/components/FileUploadAndPrev/UploadedFiles";
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
          /* filtering the `acceptedFiles` array to remove any files that already
          exist in the `prevFiles` array. */
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
      {/* dropzone area */}
      <div
        className={cn(
          "dropzone-area",
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
      <UploadedFiles imageSent={imageSent} />
    </div>
  );
};

export default FileUpload;
