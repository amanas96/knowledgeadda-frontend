import React, { useEffect, useRef } from "react";

const CloudinaryUploadWidget = ({ onUploadSuccess, onRemove, currentUrl }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const onUploadSuccessRef = useRef(onUploadSuccess);

  useEffect(() => {
    onUploadSuccessRef.current = onUploadSuccess;
  }, [onUploadSuccess]);

  useEffect(() => {
    if (window.cloudinary) {
      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: "knowledgeadda",
          uploadPreset: "knowledgeadda_preset",

          sources: ["local", "url", "google_drive"],
          multiple: false,
          resourceType: "auto",
          clientAllowedFormats: ["png", "jpg", "jpeg", "mp4", "pdf"],
          maxFileSize: 100000000,
          folder: "courses/thumbnails",
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            if (onUploadSuccessRef.current) {
              onUploadSuccessRef.current({
                url: result.info.secure_url,
                publicId: result.info.public_id,
                originalFilename: result.info.original_filename,
                format: result.info.format,
                resourceType: result.info.resource_type,
                duration: result.info.duration || 0,
              });
            }
          }
        }
      );
    } else {
      console.error("Cloudinary script not found.");
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, []);

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      alert("Widget not loaded. Check your internet connection.");
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Upload Button */}
      <button
        type="button"
        onClick={openWidget}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center shadow-sm"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        {currentUrl ? "Change File" : "Upload File"}
      </button>

      {/* Remove Button - Only show if there's an uploaded file */}
      {currentUrl && (
        <button
          type="button"
          onClick={handleRemove}
          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Remove file"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CloudinaryUploadWidget;
