import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Saved = () => {
  const [videos, setVideos] = useState([]);

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
      });
  }, []);

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

  return (
    <div className="h-screen overflow-y-scroll bg-black pb-32">
      {videos.length > 0 ? (
        videos.map(item => (
          <div key={item._id} className="relative h-screen w-full flex justify-center bg-black snap-start">
            <video
              src={item.video}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
              controls
            />
            <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 text-white text-3xl">
              <button onClick={() => removeSaved(item)} className="hover:scale-110 transition">🗑️</button>
              <p className="text-sm">{item.savesCount}</p>
            </div>

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
