// import React, { useState, useEffect, useRef } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import apiClient from "../../api/axios";
// import { useAuth } from "../../context/authContext";
// import { motion } from "framer-motion";
// import {
//   Lock,
//   PlayCircle,
//   FileText,
//   BookOpen,
//   RefreshCcw,
//   ChevronLeft,
//   ChevronRight,
//   Play,
//   FileText as PDFIcon,
//   HelpCircle,
//   CheckCircle,
//   Clock,
//   List,
// } from "lucide-react";

// const ContentPage = () => {
//   const { courseId, contentId } = useParams();
//   const [content, setContent] = useState(null);
//   const [allContent, setAllContent] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const videoRef = useRef(null);
//   const watchStartRef = useRef(null);
//   const totalWatchedRef = useRef(0);

//   const saveWatchProgress = async (extraSeconds = 0) => {
//   if (!content || !content.video?.url) return;
//     const sessionSeconds = watchStartRef.current
//       ? Math.floor((Date.now() - watchStartRef.current) / 1000)
//       : 0;
//     const totalSeconds =
//       totalWatchedRef.current + sessionSeconds + extraSeconds;
//     const watchedMinutes = Math.floor(totalSeconds / 60);
//     if (watchedMinutes < 1) return;
//     try {
//       await apiClient.post("/api/profile/watch-progress", {
//         contentId: content._id,
//         courseId,
//         watchedMinutes,
//       });
//     } catch (err) {
//       console.error("Failed to save watch progress:", err.message);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       saveWatchProgress();
//     };
//   }, [content]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const [contentRes, allContentRes] = await Promise.all([
//           apiClient.get(`/api/v1/courses/${courseId}/content/${contentId}`),
//           apiClient
//             .get(`/api/v1/courses/${courseId}/content`)
//             .catch(() => ({ data: [] })),
//         ]);
//         setContent(contentRes.data);
//         setAllContent(allContentRes.data?.flat || []);
//       } catch (err) {
//         if (err.response?.status === 403) {
//           setError(
//             "This lesson is for premium members. Unlock it by subscribing below.",
//           );
//         } else if (err.response?.status === 401) {
//           setError("You need to log in to view this content.");
//         } else {
//           setError("Failed to load content. Please try again later.");
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [courseId, contentId]);

//   // Current index for prev/next navigation
//   const currentIndex = allContent.findIndex((c) => c._id === contentId);
//   const prevContent = currentIndex > 0 ? allContent[currentIndex - 1] : null;
//   const nextContent =
//     currentIndex < allContent.length - 1 ? allContent[currentIndex + 1] : null;

//   const getTypeIcon = (type) => {
//     switch (type) {
//       case "video":
//         return <Play size={14} />;
//       case "pdf":
//         return <PDFIcon size={14} />;
//       case "quiz":
//         return <HelpCircle size={14} />;
//       default:
//         return <FileText size={14} />;
//     }
//   };

//   const getTypeBg = (type) => {
//     switch (type) {
//       case "video":
//         return "bg-blue-100 text-blue-600";
//       case "pdf":
//         return "bg-green-100 text-green-600";
//       case "quiz":
//         return "bg-purple-100 text-purple-600";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   const contentType = content?.video?.url ? "video"
//   : content?.attachments?.find(a => a.type === "pdf") ? "pdf"
//   : "resource";

//   const itemType = item.video?.url ? "video"
//   : item.attachments?.find(a => a.type === "pdf") ? "pdf"
//   : "resource";

//  const renderVideoPlayer = () => {
//   const videoUrl = content.video?.url; // ✅ use video.url

//   const isYouTube =
//     videoUrl?.includes("youtube.com") ||
//     videoUrl?.includes("youtu.be");

//   if (isYouTube) {
//     const cleanUrl = cleanYouTubeUrl(videoUrl); // ✅
//     return (
//       <div className="relative pb-[56.25%] h-0 bg-black">
//         <iframe
//           src={cleanUrl?.replace("watch?v=", "embed/")}
//           className="absolute top-0 left-0 w-full h-full"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//           title="YouTube Video"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-black">
//       <video
//         ref={videoRef}
//         controls
//         className="w-full h-auto max-h-[70vh]"
//         preload="metadata"
//         onPlay={() => { watchStartRef.current = Date.now(); }}
//         onPause={() => {
//           if (watchStartRef.current) {
//             totalWatchedRef.current += Math.floor((Date.now() - watchStartRef.current) / 1000);
//             watchStartRef.current = null;
//           }
//           saveWatchProgress();
//         }}
//         onEnded={() => {
//           if (watchStartRef.current) {
//             totalWatchedRef.current += Math.floor((Date.now() - watchStartRef.current) / 1000);
//             watchStartRef.current = null;
//           }
//           saveWatchProgress();
//         }}
//       >
//         <source src={videoUrl} type="video/mp4" /> {/* ✅ use videoUrl */}
//       </video>
//     </div>
//   );
// };

// // render content
// const renderContent = () => {
//   if (!content) return null;

//   // has video
//   if (content.video?.url) return renderVideoPlayer();

//   // has pdf attachment
//   const pdfAttachment = content.attachments?.find(a => a.type === "pdf");
//   if (pdfAttachment) {
//     return (
//       <div className="w-full h-[75vh] bg-gray-900">
//         <embed
//           src={pdfAttachment.url}
//           type="application/pdf"
//           className="w-full h-full"
//         />
//       </div>
//     );
//   }

//   // has link attachments
//   const linkAttachments = content.attachments?.filter(a => a.type === "link");
//   if (linkAttachments?.length > 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 px-6 bg-gray-900 text-white text-center">
//         <FileText size={56} className="text-blue-400 mb-5" />
//         <h2 className="text-2xl font-bold mb-3">{content.title}</h2>
//         <div className="flex flex-col gap-3 mt-4">
//           {linkAttachments.map((link, i) => (
//             <a key={i} href={link.url} target="_blank" rel="noreferrer"
//               className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold text-white">
//               Open {link.name}
//             </a>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <p className="text-gray-400 text-center py-20">
//       ⚠️ No content available.
//     </p>
//   );
// };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-400 gap-3">
//         <RefreshCcw className="animate-spin" size={28} />
//         <p>Loading lesson...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6"
//       >
//         <Lock size={64} className="text-red-400 mb-5" />
//         <h1 className="text-2xl font-bold text-red-400 mb-3">{error}</h1>
//         <p className="text-gray-400 mb-6 max-w-md text-sm">
//           {error.includes("premium")
//             ? "Subscribe to access premium lectures, detailed notes, and quizzes."
//             : "Please check your login or try again later."}
//         </p>
//         {!user && (
//           <button
//             onClick={() => navigate("/login")}
//             className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold text-white"
//           >
//             Login
//           </button>
//         )}
//         {user && !user.isSubscribed && (
//           <Link
//             to="/subscribe"
//             className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-3 rounded-xl font-semibold text-white"
//           >
//             Subscribe & Unlock All Content
//           </Link>
//         )}
//       </motion.div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-950 text-white flex flex-col">

//       {/* ── Top Bar ───────────────────────────────────────────────────── */}
//       <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
//         <Link
//           to={`/course/${courseId}`}
//           className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
//         >
//           <ChevronLeft size={18} /> Back to Course
//         </Link>
//         <h1 className="text-sm font-semibold text-white truncate max-w-md hidden md:block">
//           {content?.title}
//         </h1>
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
//         >
//           <List size={18} />
//           <span className="hidden sm:inline">
//             {sidebarOpen ? "Hide" : "Show"} Playlist
//           </span>
//         </button>
//       </div>

//       {/* ── Main Layout ───────────────────────────────────────────────── */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* ── Video + Info ──────────────────────────────────────────── */}
//         <div className="flex-1 flex flex-col overflow-y-auto">
//           {/* Video Player */}
//           <div className="w-full bg-black">{renderContent()}</div>

//           {/* Below Video */}
//           <div className="p-5 md:p-8 space-y-6">
//             {/* Title + type badge */}
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
//                   {content?.title}
//                 </h1>
//                 <div className="flex items-center gap-3 mt-2">
//                   <span
//                     className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${getTypeBg(contentType)}`}
//                   >
//                     {getTypeIcon(contentType)}
//                     {contentType.toUpperCase()}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Prev / Next navigation */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() =>
//                   prevContent &&
//                   navigate(`/course/${courseId}/content/${prevContent._id}`)
//                 }
//                 disabled={!prevContent}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//               >
//                 <ChevronLeft size={16} /> Previous
//               </button>
//               <button
//                 onClick={() =>
//                   nextContent &&
//                   navigate(`/course/${courseId}/content/${nextContent._id}`)
//                 }
//                 disabled={!nextContent}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//               >
//                 Next <ChevronRight size={16} />
//               </button>
//               {nextContent && (
//                 <span className="text-xs text-gray-500 truncate hidden md:block">
//                   Up next: {nextContent.title}
//                 </span>
//               )}
//             </div>

//             {/* Description */}
//             {content?.description && (
//               <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
//                 <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
//                   <PlayCircle size={18} className="text-blue-400" />
//                   Lesson Overview
//                 </h2>
//                 <p className="text-gray-400 leading-relaxed text-sm">
//                   {content.description}
//                 </p>
//               </div>
//             )}

//             {/* add after Description section */}
// {content?.attachments?.length > 0 && (
//   <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
//     <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
//       <FileText size={18} className="text-green-400" />
//       Resources & Attachments
//     </h2>
//     <div className="space-y-2">
//       {content.attachments.map((att, i) => (

//           key={i}
//           href={att.url}
//           target="_blank"
//           rel="noreferrer"
//           className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors group"
//         >
//           <div className="w-8 h-8 rounded-lg bg-green-900/50 flex items-center justify-center flex-shrink-0">
//             <FileText size={14} className="text-green-400" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white">
//               {att.name}
//             </p>
//             <p className="text-xs text-gray-500 capitalize">{att.type}</p>
//           </div>
//           <ChevronRight size={14} className="text-gray-500 group-hover:text-white" />
//         </a>
//       ))}
//     </div>
//   </div>
// )}

//           </div>

//         </div>

//         {/* ── Sidebar Playlist ──────────────────────────────────────── */}
//         {sidebarOpen && (
//           <div className="w-80 flex-shrink-0 bg-gray-900 border-l border-gray-800 flex flex-col hidden md:flex">
//             {/* Sidebar Header */}
//             <div className="px-4 py-4 border-b border-gray-800 flex-shrink-0">
//               <h3 className="text-sm font-bold text-white">Course Playlist</h3>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {allContent.length} lessons · Lesson {currentIndex + 1} of{" "}
//                 {allContent.length}
//               </p>
//               {/* Progress bar */}
//               <div className="w-full bg-gray-800 rounded-full h-1.5 mt-3">
//                 <div
//                   className="bg-blue-500 h-1.5 rounded-full transition-all"
//                   style={{
//                     width: `${allContent.length > 0 ? ((currentIndex + 1) / allContent.length) * 100 : 0}%`,
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Playlist Items */}
//             <div className="overflow-y-auto flex-1">
//               {allContent.map((item, i) => {
//                 const isCurrent = item._id === contentId;
//                 const isAccessible = item.isAccessible;
//                 return (
//                   <button
//                     key={item._id}
//                     onClick={() => {
//                       if (isAccessible) {
//                         navigate(`/course/${courseId}/content/${item._id}`);
//                       }
//                     }}
//                     className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all border-l-2
//                       ${
//                         isCurrent
//                           ? "bg-blue-600/10 border-blue-500"
//                           : "border-transparent hover:bg-gray-800/50"
//                       }
//                       ${!isAccessible ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
//                     `}
//                   >
//                     {/* Index / Playing indicator */}
//                     <div
//                       className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold
//                       ${isCurrent ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"}`}
//                     >
//                       {isCurrent ? <Play size={10} fill="white" /> : i + 1}
//                     </div>

//                     {/* Title + meta */}
//                     <div className="flex-1 min-w-0">
//                       <p
//                         className={`text-xs font-semibold leading-snug line-clamp-2
//                         ${isCurrent ? "text-blue-400" : "text-gray-300"}`}
//                       >
//                         {item.title}
//                       </p>
//                       <div className="flex items-center gap-2 mt-1.5">
//                         <span
//                           className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${getTypeBg(itemType)}`}
//                         >
//                           {getTypeIcon(item.contentType)}
//                           {itemType}
//                         </span>
//                         {!isAccessible && (
//                           <span className="text-xs text-amber-500 flex items-center gap-0.5">
//                             <Lock size={10} /> Premium
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// };

// export default ContentPage;

import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { useAuth } from "../../context/authContext";
import { motion } from "framer-motion";
import {
  Lock,
  PlayCircle,
  FileText,
  BookOpen,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Play,
  HelpCircle,
  CheckCircle,
  Clock,
  List,
  ExternalLink,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getContentType = (item) => {
  if (!item) return "resource";
  if (item.video?.publicId || item.video?.url) return "video";
  if (item.attachments?.find((a) => a.type === "pdf")) return "pdf";
  if (item.attachments?.find((a) => a.type === "notes")) return "notes";
  return "resource";
};

const getTypeIcon = (type) => {
  switch (type) {
    case "video":
      return <Play size={14} />;
    case "pdf":
      return <FileText size={14} />;
    case "notes":
      return <BookOpen size={14} />;
    default:
      return <FileText size={14} />;
  }
};

const getTypeBg = (type) => {
  switch (type) {
    case "video":
      return "bg-blue-100 text-blue-600";
    case "pdf":
      return "bg-green-100 text-green-600";
    case "notes":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

function cleanYouTubeUrl(url) {
  try {
    const u = new URL(url);
    const videoId = u.searchParams.get("v");
    if (!videoId && u.hostname === "youtu.be") {
      return `https://www.youtube.com/watch?v=${u.pathname.slice(1)}`;
    }
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
  } catch {
    return null;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ContentPage = () => {
  const { courseId, contentId } = useParams(); // courseId can be slug or _id
  const [content, setContent] = useState(null);
  const [allContent, setAllContent] = useState([]);
  const [groupedContent, setGroupedContent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [signedUrls, setSignedUrls] = useState(null);
  const [urlsLoading, setUrlsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const watchStartRef = useRef(null);
  const totalWatchedRef = useRef(0);

  // ── Watch progress ────────────────────────────────────────────────────────
  const saveWatchProgress = async (extraSeconds = 0) => {
    if (!content || !signedUrls?.video?.url) return;
    const sessionSeconds = watchStartRef.current
      ? Math.floor((Date.now() - watchStartRef.current) / 1000)
      : 0;
    const totalSeconds =
      totalWatchedRef.current + sessionSeconds + extraSeconds;
    const watchedMinutes = Math.floor(totalSeconds / 60);
    if (watchedMinutes < 1) return;
    try {
      await apiClient.post("/api/profile/watch-progress", {
        contentId: content._id,
        courseId,
        watchedMinutes,
      });
    } catch (err) {
      console.error("Failed to save watch progress:", err.message);
    }
  };

  useEffect(() => {
    return () => {
      saveWatchProgress();
    };
  }, [content]);

  // ── Fetch content ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [contentRes, allContentRes] = await Promise.all([
          apiClient.get(`/api/v1/courses/${courseId}/content/${contentId}`), // ✅ slug or id both work
          apiClient
            .get(`/api/v1/courses/${courseId}/content`)
            .catch(() => ({ data: { flat: [], grouped: {} } })),
        ]);
        setContent(contentRes.data);
        setAllContent(allContentRes.data?.items || []);
        setGroupedContent(allContentRes.data?.grouped || {});
      } catch (err) {
        if (err.response?.status === 403) {
          setError(
            "This lesson is for premium members. Unlock it by subscribing below.",
          );
        } else if (err.response?.status === 401) {
          setError("You need to log in to view this content.");
        } else {
          setError("Failed to load content. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [courseId, contentId]);

  // add fetch after content is loaded
  useEffect(() => {
    if (!content) return;
    const fetchSignedUrls = async () => {
      try {
        const { data } = await apiClient.get(
          `/api/v1/courses/${courseId}/content/${contentId}/signed-url`,
        );
        console.log("signedUrls data:", data); // ← add this
        console.log("signedUrls.urls:", data.urls); // ← add this
        setSignedUrls(data.urls);
      } catch (err) {
        console.error("Failed to get signed URLs:", err);
      } finally {
        setUrlsLoading(false);
      }
    };
    fetchSignedUrls();
  }, [content, courseId, contentId]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const currentIndex = allContent.findIndex((c) => c._id === contentId);
  const prevContent = currentIndex > 0 ? allContent[currentIndex - 1] : null;
  const nextContent =
    currentIndex < allContent.length - 1 ? allContent[currentIndex + 1] : null;

  // ── Render video player ───────────────────────────────────────────────────
  const renderVideoPlayer = () => {
    // ✅ use signed URL if available, fall back to direct URL (YouTube)
    const videoUrl = signedUrls?.video?.url || content.video?.url;

    const isYouTube =
      videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

    if (isYouTube) {
      const cleanUrl = cleanYouTubeUrl(videoUrl);
      return (
        <div className="relative pb-[56.25%] h-0 bg-black">
          <iframe
            src={cleanUrl?.replace("watch?v=", "embed/")}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube Video"
          />
        </div>
      );
    }

    // ✅ show loading while signed URL is being fetched
    if (urlsLoading) {
      return (
        <div className="flex items-center justify-center h-[40vh] bg-black">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    // ✅ no signed URL available
    if (!videoUrl) {
      return (
        <div className="flex items-center justify-center h-[40vh] bg-black text-gray-400">
          <p>Video not available</p>
        </div>
      );
    }

    return (
      <div className="bg-black">
        <video
          ref={videoRef}
          controls
          className="w-full h-auto max-h-[70vh]"
          preload="metadata"
          onPlay={() => {
            watchStartRef.current = Date.now();
          }}
          onPause={() => {
            if (watchStartRef.current) {
              totalWatchedRef.current += Math.floor(
                (Date.now() - watchStartRef.current) / 1000,
              );
              watchStartRef.current = null;
            }
            saveWatchProgress();
          }}
          onEnded={() => {
            if (watchStartRef.current) {
              totalWatchedRef.current += Math.floor(
                (Date.now() - watchStartRef.current) / 1000,
              );
              watchStartRef.current = null;
            }
            saveWatchProgress();
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
    );
  };

  // ── Render main content ───────────────────────────────────────────────────
  const renderContent = () => {
    console.log("content.video:", content?.video);
    console.log("content.attachments:", content?.attachments);
    console.log("signedUrls.video:", signedUrls?.video);
    console.log("signedUrls.attachments:", signedUrls?.attachments);
    if (!content) return null;

    // ✅ video
    if (content.video?.publicId?.length > 0 || content.video?.url?.length > 0) {
      console.log("→ rendering video");
      return renderVideoPlayer();
    }

    // ✅ pdf — use signed URL
    const pdfAttachment =
      signedUrls?.attachments?.find((a) => a.type === "pdf") ||
      content.attachments?.find((a) => a.type === "pdf");
    console.log("pdfAttachment:", pdfAttachment);

    if (pdfAttachment) {
      if (urlsLoading) {
        return (
          <div className="flex items-center justify-center h-[75vh] bg-gray-900">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        );
      }
      return (
        <div className="w-full h-[75vh] bg-gray-900">
          <embed
            src={pdfAttachment.url}
            type="application/pdf"
            className="w-full h-full"
          />
        </div>
      );
    }

    // ✅ links
    const linkAttachments = content.attachments?.filter(
      (a) => a.type === "link",
    );
    if (linkAttachments?.length > 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-gray-900 text-white text-center">
          <FileText size={56} className="text-blue-400 mb-5" />
          <h2 className="text-2xl font-bold mb-3">{content.title}</h2>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            {linkAttachments.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold text-white justify-center"
              >
                <ExternalLink size={16} /> {link.name}
              </a>
            ))}
          </div>
        </div>
      );
    }

    return (
      <p className="text-gray-400 text-center py-20">
        ⚠️ No content available.
      </p>
    );
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-400 gap-3">
        <RefreshCcw className="animate-spin" size={28} />
        <p>Loading lesson...</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6"
      >
        <Lock size={64} className="text-red-400 mb-5" />
        <h1 className="text-2xl font-bold text-red-400 mb-3">{error}</h1>
        <p className="text-gray-400 mb-6 max-w-md text-sm">
          {error.includes("premium")
            ? "Subscribe to access premium lectures, detailed notes, and quizzes."
            : "Please check your login or try again later."}
        </p>
        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold text-white"
          >
            Login
          </button>
        )}
        {user && !user.isSubscribed && (
          <Link
            to="/subscribe"
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-3 rounded-xl font-semibold text-white"
          >
            Subscribe & Unlock All Content
          </Link>
        )}
      </motion.div>
    );
  }

  const contentType = getContentType(content);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* ── Top Bar ───────────────────────────────────────────────────── */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Link
          to={`/course/${courseId}`}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ChevronLeft size={18} /> Back to Course
        </Link>
        <h1 className="text-sm font-semibold text-white truncate max-w-md hidden md:block">
          {content?.title}
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <List size={18} />
          <span className="hidden sm:inline">
            {sidebarOpen ? "Hide" : "Show"} Playlist
          </span>
        </button>
      </div>

      {/* ── Main Layout ───────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Content + Info ────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Main content */}
          <div className="w-full bg-black">{renderContent()}</div>

          {/* Below content */}
          <div className="p-5 md:p-8 space-y-6">
            {/* Title + type badge */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
                  {content?.title}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${getTypeBg(contentType)}`}
                  >
                    {getTypeIcon(contentType)}
                    {contentType.toUpperCase()}
                  </span>
                  {content?.section && content.section !== "General" && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-800 text-gray-400">
                      {content.section}
                    </span>
                  )}
                  {content?.isFree && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-900/50 text-green-400">
                      Free
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Prev / Next navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  prevContent &&
                  navigate(`/course/${courseId}/content/${prevContent._id}`)
                }
                disabled={!prevContent}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={() =>
                  nextContent &&
                  navigate(`/course/${courseId}/content/${nextContent._id}`)
                }
                disabled={!nextContent}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
              {nextContent && (
                <span className="text-xs text-gray-500 truncate hidden md:block">
                  Up next: {nextContent.title}
                </span>
              )}
            </div>

            {/* Attachments */}
            {(signedUrls?.attachments || content?.attachments)?.length > 0 && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-green-400" />
                  Resources & Attachments
                </h2>
                <div className="space-y-2">
                  {(signedUrls?.attachments || content?.attachments)?.map(
                    (att, i) => (
                      <a
                        key={att._id || i}
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-900/50 flex items-center justify-center flex-shrink-0">
                          <FileText size={14} className="text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white">
                            {att.name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {att.type}
                          </p>
                        </div>
                        <ExternalLink
                          size={14}
                          className="text-gray-500 group-hover:text-white"
                        />
                      </a>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {content?.description && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <PlayCircle size={18} className="text-blue-400" />
                  Lesson Overview
                </h2>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {content.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar Playlist ──────────────────────────────────────── */}
        {sidebarOpen && (
          <div className="w-80 flex-shrink-0 bg-gray-900 border-l border-gray-800 flex-col hidden md:flex">
            {/* Sidebar Header */}
            <div className="px-4 py-4 border-b border-gray-800 flex-shrink-0">
              <h3 className="text-sm font-bold text-white">Course Playlist</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {allContent.length} lessons · Lesson {currentIndex + 1} of{" "}
                {allContent.length}
              </p>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mt-3">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{
                    width: `${allContent.length > 0 ? ((currentIndex + 1) / allContent.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* ✅ Grouped playlist */}
            <div className="overflow-y-auto flex-1">
              {Object.entries(groupedContent).map(([section, items]) => (
                <div key={section}>
                  {/* Section header */}
                  <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700/50 sticky top-0">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      {section}
                      <span className="ml-2 font-normal normal-case text-gray-500">
                        ({items.length})
                      </span>
                    </p>
                  </div>

                  {/* Items */}
                  {items.map((item, i) => {
                    const isCurrent = item._id === contentId;
                    const isAccessible = item.isAccessible;
                    const itemType = getContentType(item); // ✅ use helper

                    return (
                      <button
                        key={item._id}
                        onClick={() => {
                          if (isAccessible) {
                            navigate(`/course/${courseId}/content/${item._id}`);
                          }
                        }}
                        className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all border-l-2
                          ${isCurrent ? "bg-blue-600/10 border-blue-500" : "border-transparent hover:bg-gray-800/50"}
                          ${!isAccessible ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold
                          ${isCurrent ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"}`}
                        >
                          {isCurrent ? <Play size={10} fill="white" /> : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-semibold leading-snug line-clamp-2
                            ${isCurrent ? "text-blue-400" : "text-gray-300"}`}
                          >
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span
                              className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${getTypeBg(itemType)}`}
                            >
                              {getTypeIcon(itemType)}
                              {itemType}
                            </span>
                            {item.attachments?.length > 0 && (
                              <span className="text-xs text-green-500">
                                +{item.attachments.length} resource
                                {item.attachments.length > 1 ? "s" : ""}
                              </span>
                            )}
                            {!isAccessible && (
                              <span className="text-xs text-amber-500 flex items-center gap-0.5">
                                <Lock size={10} /> Premium
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPage;
