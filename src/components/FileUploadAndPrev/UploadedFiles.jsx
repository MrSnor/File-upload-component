export const UploadedFiles = ({ imageSent }) => {
  return (
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
  );
};
