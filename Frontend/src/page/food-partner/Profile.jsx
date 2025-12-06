import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])

    useEffect(() => {
        axios.get(`https://reelers-yv6s.onrender.com/api/food-partner/${id}`, { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems)
            })
    }, [id])

    return (
        <main className="w-full max-w-5xl mx-auto p-4">
            {/* Header */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <img
                        className="w-24 h-24 rounded-full object-cover"
                        src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                    />

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {profile?.businessName}
                        </h1>
                        <p className="text-gray-600">
                            {profile?.address}
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="flex gap-8">
                    <div className="text-center">
                        <span className="block text-gray-500 text-sm">total meals</span>
                        <span className="block text-xl font-semibold">{profile?.totalMeals}</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-gray-500 text-sm">customers served</span>
                        <span className="block text-xl font-semibold">{profile?.customersServed}</span>
                    </div>
                </div>
            </section>

            <hr className="my-6 border-gray-200" />

            {/* Videos Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map((v) => (
                    <div key={v._id} className="w-full h-48 bg-black rounded-lg overflow-hidden">
                        <video
                            className="w-full h-full object-cover"
                            src={v.video}
                            muted
                        ></video>
                    </div>
                ))}
            </section>
        </main>
    )
}

export default Profile
