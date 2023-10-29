import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useEffect } from "react";
import { useDropzone } from "react-dropzone";

export function Previews({ files, setFiles }) {
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
      transition: {
        duration: 0.25,
        ease: "easeOut",
      },
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
      layout
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
