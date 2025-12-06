import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Convert first + last name into fullName for backend
    const payload = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post(
        "https://reelers-yv6s.onrender.com/api/auth/user/register",
        payload,
        { withCredentials: true } // helps cookie store
      );

      console.log(response.data);

      setMessage("Registration successful!");
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={submitHandler}
        className="bg-blue-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Create Your Account
        </h2>

        <h3 className="flex text-sm font-bold text-gray gap-3 mb-6 text-center">
          Switch <Link to="/user/register"><span className="hover:text-blue-200 rounded">:😋 user</span></Link>
          <Link to="/food-partner/register"><span className="hover:text-blue-200 rounded"> :🙍‍♂️ FoodPartner</span></Link>
        </h3>

        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChanges}
          className="w-full mb-4 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChanges}
          className="w-full mb-4 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChanges}
          className="w-full mb-4 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChanges}
          className="w-full mb-6 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {message && <p className="text-center text-white mt-4">{message}</p>}

        <p className="text-center text-white mt-4">
          Already have an account?{" "}
          <Link to="/user/login" className="underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default UserRegister;
