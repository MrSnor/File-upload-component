import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = (props) => {
  const [files, setFiles] = useState([]);

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
    });

  return (
    <div className="group container">
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
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <svg
          className="h-12 w-12"
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
      </div>
      <Previews files={files} setFiles={setFiles} />{" "}
      {/* Use the Previews component */}
    </div>
  );
};

export default FileUpload;

function Previews({ files, setFiles }) {
  // animation variants
  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

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

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const updatedFiles = [
        ...files,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      ];
      setFiles(updatedFiles);
    },
  });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const thumbs = files.map((file) => (
    <motion.div
      className={cn(
        "relative mb-2 mr-2 box-border inline-flex flex-col items-center justify-center rounded-md  border border-gray-300 px-4 py-8",
      )}
      key={file.name}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={dropIn}
    >
      <div className={cn("flex min-w-0 overflow-hidden")}>
        <img
          src={file.preview}
          className={cn("block h-full w-auto")}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
      <button
        className={cn(
          "absolute -right-0 -top-0 aspect-square rounded-bl-md border bg-red-600 px-1 text-white transition-colors hover:border-red-600 hover:bg-white hover:text-red-600",
        )}
        onClick={() => {
          // Remove the file from the 'files' array
          const updatedFiles = files.filter((f) => f !== file);
          setFiles(updatedFiles);
        }}
      >
        <Trash className="aspect-square w-4" />
        {/* <svg
          className=" w-4 h-4 text-white"
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
          <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
          <line x1="3" x2="21" y1="9" y2="9" />
          <path d="m9 16 3-3 3 3" />
        </svg>
        <span className="sr-only">Remove File</span> */}
      </button>
    </motion.div>
  ));

  return (
    <aside className={cn("grid grid-cols-6 py-2")}>
      <AnimatePresence initial={false} mode="sync">
        {thumbs}
      </AnimatePresence>
    </aside>
  );
}
