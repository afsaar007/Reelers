import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const Saved = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef(new Map());
  const containerRef = useRef(null);

  // Fetch saved videos
  useEffect(() => {
    axios.get("https://reelers-yv6s.onrender.com/api/food/save", { withCredentials: true })
      .then(response => {
        const savedFoods = response.data.savedFoods.map(item => ({
          _id: item.food._id,
          video: item.food.video,
          description: item.food.description,
          likeCount: item.food.likeCount,
          savesCount: item.food.savesCount,
          commentsCount: item.food.commentsCount,
          foodPartner: item.food.foodPartner
        }));
        setVideos(savedFoods);
      })
      .catch(err => console.error("Error fetching saved videos:", err));
  }, []);

  // Autoplay videos when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
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

    videoRefs.current.forEach(video => observer.observe(video));

    return () => {
      videoRefs.current.forEach(video => observer.unobserve(video));
    };
  }, [videos]);

  // Remove saved video
  const removeSaved = async (item) => {
    try {
      await axios.post(
        "https://reelers-yv6s.onrender.com/api/food/save",
        { foodId: item._id },
        { withCredentials: true }
      );
      setVideos(prev => prev.filter(v => v._id !== item._id));
    } catch (err) {
      console.error("Error removing saved item:", err);
    }
  };

  // Optional: manual scroll snapping
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
          behavior: 'smooth'
        });
      }, 50);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black pb-32"
    >
      {videos.length > 0 ? (
        videos.map(item => (
          <div
            key={item._id}
            className="relative h-screen w-full snap-start flex justify-center bg-black"
          >
            {/* Video */}
            <video
              ref={el => el && videoRefs.current.set(item._id, el)}
              src={item.video}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
            />

            {/* Remove Saved Button */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 text-white text-3xl">
              <button
                onClick={() => removeSaved(item)}
                className="hover:scale-110 transition"
              >
                🗑️
              </button>
              <p className="text-sm">{item.savesCount}</p>
            </div>

            {/* Video description */}
            <div className="absolute bottom-0 w-full bg-gradient-to from-black to-transparent p-5 pb-24 text-white">
              <p className="font-semibold text-lg mb-1">{item.description}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-white text-center mt-10">No saved videos.</p>
      )}
    </div>
  );
};

export default Saved;
