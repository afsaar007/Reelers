import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CreateFood = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoURL, setVideoURL] = useState('');
    const [fileError, setFileError] = useState('');

    // Upload states
    const [uploadProgress, setUploadProgress] = useState(0); // 0-100
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const fileInputRef = useRef(null);
    const controllerRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!videoFile) {
            setVideoURL('');
            return;
        }
        const url = URL.createObjectURL(videoFile);
        setVideoURL(url);
        return () => URL.revokeObjectURL(url);
    }, [videoFile]);

    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) { setVideoFile(null); setFileError(''); return; }
        if (!file.type.startsWith('video/')) { setFileError('Please select a valid video file.'); return; }
        // Optional: limit file size to ~100MB
        const maxBytes = 100 * 1024 * 1024;
        if (file.size > maxBytes) { setFileError('File is too large. Limit is ~100MB.'); return; }
        setFileError('');
        setVideoFile(file);
    };

    const onDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer?.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('video/')) { setFileError('Please drop a valid video file.'); return; }
        const maxBytes = 100 * 1024 * 1024;
        if (file.size > maxBytes) { setFileError('File is too large. Limit is ~100MB.'); return; }
        setFileError('');
        setVideoFile(file);
    };

    const onDragOver = e => e.preventDefault();
    const openFileDialog = () => fileInputRef.current?.click();

    const onSubmit = async (e) => {
        e.preventDefault();
        setUploadError('');

        if (!videoFile) {
            setFileError('Please choose a video file before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("video", videoFile);

        setUploading(true);
        setUploadProgress(0);

        // create an AbortController so the upload can be cancelled (optional)
        controllerRef.current = new AbortController();

        try {
            const response = await axios.post("http://localhost:3000/api/food", formData, {
                withCredentials: true,
                signal: controllerRef.current.signal,
                onUploadProgress: (progressEvent) => {
                    if (!progressEvent.lengthComputable) return;
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);
            // reset states or navigate
            setUploading(false);
            setUploadProgress(0);
            navigate("/home/feed");
        } catch (err) {
            if (axios.isCancel(err)) {
                setUploadError('Upload cancelled.');
            } else if (err.name === 'CanceledError') {
                // axios v1+ uses CanceledError when signal aborts
                setUploadError('Upload cancelled.');
            } else {
                console.error(err);
                setUploadError(err.response?.data?.message || 'Upload failed.');
            }
            setUploading(false);
        } finally {
            controllerRef.current = null;
        }
    };

    const cancelUpload = () => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
    };

    const isDisabled = useMemo(
        () => !name.trim() || !videoFile || uploading,
        [name, videoFile, uploading]
    );

    return (
        <div className="w-full flex justify-center py-10 px-4">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">

                {/* Header */}
                <Link to='/'><button className='text-3xl '>🔙</button></Link>
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Create Food</h1>
                    <p className="text-gray-600 mt-1">
                        Upload a short video, give it a name, and add a description.
                    </p>
                </header>

                <form onSubmit={onSubmit} className="space-y-6">

                    {/* File Upload */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">
                            Food Video
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={onFileChange}
                        />

                        {/* Dropzone */}
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 transition"
                            role="button"
                            tabIndex={0}
                            onClick={openFileDialog}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onKeyDown={(e) => {
                                if (["Enter", " "].includes(e.key)) {
                                    e.preventDefault();
                                    openFileDialog();
                                }
                            }}
                        >
                            <div className="flex flex-col items-center gap-3 text-gray-600">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M10.8 3.2a1 1 0 0 1 .4-.08h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v7.2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6.4a1 1 0 0 1 1-1h1.6V3.2a1 1 0 0 1 1-1h1.6a1 1 0 0 1 .6.2z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M9 12.75v-1.5c0-.62.67-1 1.2-.68l4.24 2.45c.53.3.53 1.05 0 1.35L10.2 16.82c-.53.31-1.2-.06-1.2-.68v-1.5" fill="currentColor" />
                                </svg>

                                <p><strong>Tap to upload</strong> or drag and drop</p>
                                <p className="text-sm text-gray-400">MP4, WebM, MOV • Up to ~100MB</p>
                            </div>
                        </div>

                        {/* Error */}
                        {fileError && (
                            <p className="text-red-500 text-sm mt-2">{fileError}</p>
                        )}

                        {/* File Chip */}
                        {videoFile && (
                            <div className="mt-4 bg-gray-100 px-4 py-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <span className="font-medium">{videoFile.name}</span>
                                    <span className="text-sm text-gray-500">
                                        {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                                    </span>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={openFileDialog}
                                        className="text-blue-600 hover:underline text-sm"
                                        disabled={uploading}
                                    >
                                        Change
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setVideoFile(null); setFileError(''); }}
                                        className="text-red-600 hover:underline text-sm"
                                        disabled={uploading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Video Preview */}
                    {videoURL && (
                        <div className="mt-4">
                            <video
                                className="w-full rounded-lg shadow-sm"
                                src={videoURL}
                                controls
                                playsInline
                                preload="metadata"
                            />
                        </div>
                    )}

                    {/* Upload progress */}
                    {uploading && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="h-full transition-all"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2 text-sm">
                                <span>Uploading: {uploadProgress}%</span>
                                <button type="button" onClick={cancelUpload} className="text-sm text-red-600 hover:underline">Cancel</button>
                            </div>
                        </div>
                    )}

                    {uploadError && (
                        <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Spicy Paneer Wrap"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                            disabled={uploading}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write a short description..."
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            disabled={uploading}
                        />
                    </div>

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={isDisabled}
                            className={`w-full py-3 rounded-lg text-white font-medium transition
                                ${isDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
                            `}
                        >
                            {uploading ? `Uploading... (${uploadProgress}%)` : 'Save Food'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;
