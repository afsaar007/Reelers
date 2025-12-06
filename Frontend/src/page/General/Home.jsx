import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef(new Map());
  const containerRef = useRef(null);

  // Fetch videos
  useEffect(() => {
    axios
      .get("https://reelers-yv6s.onrender.com/api/food", {
        withCredentials: true,
      })
      .then((res) => {
        setVideos(
          res.data.foodItems.map((v) => ({
            ...v,
            likeCount: Number(v.likeCount ?? v.likes ?? 0),
            savesCount: Number(v.savesCount ?? v.saves ?? 0),
            isSaved: v.isSaved ?? false,
          }))
        );
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  // Autoplay/pause videos when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.9 } // Play video when 90% visible
    );

    videoRefs.current.forEach((video) => observer.observe(video));

    return () => {
      videoRefs.current.forEach((video) => observer.unobserve(video));
    };
  }, [videos]);

  // Like video
  async function likeVideo(item) {
    try {
      const response = await axios.post(
        "https://reelers-yv6s.onrender.com/api/food/like",
        { foodId: item._id },
        { withCredentials: true }
      );
      console.log("Like response:", response.data);

      const didLike = !!response.data.like; // ensure boolean
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? { ...v, likeCount: Math.max(0, (v.likeCount || 0) + (didLike ? 1 : -1)) }
            : v
        )
      );
    } catch (err) {
      console.error("Error liking video:", err);
    }
  }

  // Save video
  async function saveVideo(item) {
    try {
      const response = await axios.post(
        "https://reelers-yv6s.onrender.com/api/food/save",
        { foodId: item._id },
        { withCredentials: true }
      );
      console.log("Save response:", response.data);

      const didSave = !!response.data.save; // ensure boolean
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? {
                ...v,
                savesCount: Math.max(0, (v.savesCount || 0) + (didSave ? 1 : -1)),
                isSaved: didSave,
              }
            : v
        )
      );
    } catch (err) {
      console.error("Error saving video:", err);
    }
  }

  // Smooth scroll snapping
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const scrollPos = container.scrollTop;
        const height = window.innerHeight;
        const index = Math.round(scrollPos / height);
        container.scrollTo({
          top: index * height,
          behavior: "smooth",
        });
      }, 50);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black pb-32"
    >
      {videos.length > 0 ? (
        videos.map((item) => (
          <div
            key={item._id}
            className="relative h-screen w-full snap-start flex justify-center bg-black"
          >
            {/* Video */}
            <video
              ref={(el) => {
                if (el) videoRefs.current.set(item._id, el);
              }}
              src={item.video}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
            />

            {/* RIGHT SIDE ICONS */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 text-white text-3xl z-10">
              {/* Like */}
              <button
                onClick={() => likeVideo(item)}
                className="hover:scale-110 transition"
              >
                <i className="ri-heart-fill"></i>
              </button>
              <p className="text-sm">{item.likeCount}</p>

              {/* Save */}
              <button
                onClick={() => saveVideo(item)}
                className={`hover:scale-110 transition ${
                  item.isSaved ? "text-yellow-400" : "text-white"
                }`}
              >
                <i className="ri-chat-download-line"></i>
              </button>
              <p className="text-sm">{item.savesCount}</p>

              {/* Share */}
              <button className="hover:scale-110 transition">🔗</button>
            </div>

            {/* BOTTOM CONTENT */}
            <div className="absolute bottom-0 w-full bg-gradient-to from-black to-transparent p-5 pb-24 text-white z-10">
              <p className="font-semibold text-lg mb-1">{item.name}</p>
              <p className="text-sm mb-3 opacity-90">{item.description}</p>

              {/* View Profile Button */}
              <Link
                to={`/food-partner/profile/${item.foodPartner}`}
                className="bg-blue-500 px-4 py-2 rounded-md text-sm w-max"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="text-white text-center mt-10">No videos available.</p>
      )}

      {/* BOTTOM NAV BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex justify-around py-3 z-20">
        <Link to="/" className="flex flex-col items-center text-gray-700">
          <span className="text-2xl">
            <i className="ri-home-smile-line"></i>
          </span>
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/user/register" className="flex flex-col items-center text-gray-700">
          <span className="">
            <i className="ri-login-box-line"></i>
          </span>
          <span className="text-xs">Sign Up</span>
        </Link>
        <Link to="/saved" className="flex flex-col items-center text-gray-700">
          <span className="text-3xl">
            <i className="ri-chat-download-line"></i>
          </span>
          <span className="text-xs">Saved</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
