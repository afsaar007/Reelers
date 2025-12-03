import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef(new Map());
  const containerRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((res) => {
       
       // use this in the initial fetch
setVideos(
  res.data.foodItems.map((v) => ({
    ...v,
    likeCount: v.likeCount ?? v.likes ?? 0,
    savesCount: v.savesCount ?? v.saves ?? 0,
    isSaved: v.isSaved ?? false,
  }))


        );
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  // Autoplay when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;

          entry.isIntersecting ? video.play().catch(() => {}) : video.pause();
        });
      },
      { threshold: 0.75 }
    );

    videoRefs.current.forEach((video) => observer.observe(video));

    return () => {
      videoRefs.current.forEach((video) => observer.unobserve(video));
    };
  }, [videos]);

async function likeVideo(item){
  const response = await axios.post('http://localhost:3000/api/food/like',{foodId: item._id},{withCredentials:true})
     if(response.data.like){
           
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
        }else{
          
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
        }
}


  // Toggle save
 async function saveVideo(item) {
        const response = await axios.post("http://localhost:300/api/food/save", { foodId: item._id }, { withCredentials: true })
        
        if(response.data.save){
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
        }else{
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
        }
    }


  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black pb-32"
    >
      {videos.length > 0 ? (
        videos.map((item) => (
          <div
            key={item._id}
            className="relative h-screen w-full snap-start flex justify-center bg-black"
          >
            {/* Video */}
            <video
              ref={(el) => el && videoRefs.current.set(item._id, el)}
              src={item.video}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
            />

            {/* RIGHT SIDE ICONS */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 text-white text-3xl">
              {/* Like */}
              <button onClick={()=> likeVideo(item)} className="hover:scale-110 transition"><i className="ri-heart-fill"></i></button>
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
            <div className="absolute bottom-0 w-full bg-gradient-to from-black to-transparent p-5 pb-24 text-white">
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
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex justify-around py-3">
        <Link to="/" className="flex flex-col items-center text-gray-700">
          <span className="text-2xl"><i className="ri-home-smile-line"></i></span>
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/user/register"><h1 className="text-black"> Sing Up</h1></Link>
        <Link to="/saved" className="flex flex-col items-center text-gray-700">
          <span className="text-2xl"><i className="ri-chat-download-line"></i></span>
          <span className="text-xs">Saved</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
