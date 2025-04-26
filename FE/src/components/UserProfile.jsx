<<<<<<< Updated upstream
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    _id: "",
    fullName: "",
    mobileNumber: "",
    address1: "",
    email: "",
    country: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
=======
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { Button } from ".";
import { userProfileData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import avatarPlaceholder from "../data/avatar.jpg";

const UserProfile = () => {
  const { currentColor, setIsLoggedIn } = useStateContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    _id: "",
    fullName: "",
    dob: "",
    gender: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
>>>>>>> Stashed changes
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9999/api/user/jwt-current"
        );
        setProfile({
          _id: response.data._id || "",
          fullName: response.data.fullName || "",
<<<<<<< Updated upstream
          mobileNumber: response.data.mobileNumber || "",
          address1: response.data.address1 || "",
          email: response.data.email || "",
          country: response.data.country || "",
          avatar: response.data.avatar || "",
        });
        setLoggedIn(true);
        setLoading(false);
      } catch (error) {
        setLoggedIn(false);
        setLoading(false);
=======
          dob: response.data.dob ? response.data.dob.split("T")[0] : "",
          gender: response.data.gender || "",
          avatar: response.data.avatar || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error.response || error);
        setLoading(false);
        setSaveError("Failed to fetch user data.");
>>>>>>> Stashed changes
      }
    };
    fetchCurrentUser();
  }, []);

<<<<<<< Updated upstream
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await axios.post("http://localhost:9999/login", {
        username,
        password,
      });
      const { accessToken } = response.data;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        setLoggedIn(true);
        setLoading(true);
        const userResponse = await axios.get(
          "http://localhost:9999/api/user/jwt-current"
        );
        setProfile({
          _id: userResponse.data._id || "",
          fullName: userResponse.data.fullName || "",
          mobileNumber: userResponse.data.mobileNumber || "",
          address1: userResponse.data.address1 || "",
          email: userResponse.data.email || "",
          country: userResponse.data.country || "",
          avatar: userResponse.data.avatar || "",
        });
        setLoading(false);
      } else {
        setLoginError("Login failed. No access token received.");
      }
    } catch (error) {
      setLoginError("Login failed. Please check your credentials.");
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaveError("");
    setSaving(true);
    try {
      const response = await axios.put(
        `http://localhost:9999/api/user/${profile._id}`,
        profile
      );
      setProfile(response.data);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setSaveError(
        error.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
=======
  const handleLogout = () => {
    try {
      // Clear local storage
      localStorage.removeItem("token");

      // Update authentication state
      if (setIsLoggedIn) {
        setIsLoggedIn(false);
      }

      // Redirect to login page with page reload to ensure clean state
      window.location.href = "/login";

      // Alternative: using navigate (might need page reload)
      // navigate("/login", { replace: true });
      // window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      setSaveError("Logout failed. Please try again.");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const token = localStorage.getItem("token");
>>>>>>> Stashed changes
      const response = await axios.post(
        `http://localhost:9999/api/user/${profile._id}/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
<<<<<<< Updated upstream
=======
            Authorization: `Bearer ${token}`,
>>>>>>> Stashed changes
          },
        }
      );
      setProfile((prev) => ({ ...prev, avatar: response.data.avatar }));
<<<<<<< Updated upstream
      setMessage("Avatar updated successfully.");
    } catch (error) {
      setUploadError(
        error.response?.data?.message || "Failed to upload avatar."
      );
=======
    } catch (error) {
      console.error("Error uploading avatar:", error.response || error);
      setSaveError("Failed to upload avatar.");
>>>>>>> Stashed changes
    } finally {
      setUploading(false);
    }
  };

<<<<<<< Updated upstream
  if (loading) return <div>Loading...</div>;

  if (!loggedIn) {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          {loginError && <p className="error">{loginError}</p>}
        </form>
=======
  if (loading) {
    return (
      <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
        <p className="text-center dark:text-gray-200">Loading user data...</p>
      </div>
    );
  }

  if (saveError) {
    return (
      <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
        <p className="text-center text-red-500">Error: {saveError}</p>
>>>>>>> Stashed changes
      </div>
    );
  }

  return (
<<<<<<< Updated upstream
    <div className="profile-container">
      <div className="profile-row">
        <div className="profile-col profile-col-left border-right">
          <div className="profile-left-content">
            <img
              className="rounded-circle"
              width="150px"
              src={
                profile.avatar
                  ? `http://localhost:9999${profile.avatar}`
                  : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              }
              alt="Profile"
            />
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleAvatarChange}
              disabled={uploading}
            />
            {uploadError && <p className="error">{uploadError}</p>}
            <span className="font-weight-bold">{profile.fullName}</span>
            <span className="text-black-50">{profile.email}</span>
          </div>
        </div>
        <div className="profile-col profile-col-middle border-right">
          <div className="profile-form">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-right">Profile Settings</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="profile-form-row">
                <div className="profile-form-col full-width">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="profile-form-row">
                <div className="profile-form-col full-width">
                  <label htmlFor="mobileNumber">Mobile Number</label>
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={profile.mobileNumber}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="profile-form-col full-width">
                  <label htmlFor="address1">Address Line 1</label>
                  <input
                    type="text"
                    id="address1"
                    name="address1"
                    value={profile.address1}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="profile-form-col full-width">
                  <label htmlFor="email">Email ID</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="profile-form-row">
                <div className="profile-form-col half-width">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={profile.country}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="mt-5 text-center">
                <button
                  type="submit"
                  className="profile-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
              {message && (
                <p className="mt-3 text-center text-success">{message}</p>
              )}
              {saveError && (
                <p className="mt-3 text-center text-danger">{saveError}</p>
              )}
            </form>
          </div>
        </div>
        <div className="profile-col profile-col-right">
          {/* Additional content or empty space can be added here */}
        </div>
=======
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={profile.avatar ? profile.avatar : avatarPlaceholder}
          alt="user-profile"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ marginLeft: "10px" }}
        />
      </div>
      <div>
        <p className="font-semibold text-xl dark:text-gray-200 mt-4">
          {profile.fullName || "Unknown User"}
        </p>
        <p className="text-gray-500 text-sm dark:text-gray-400">
          {profile.gender || "User"}
        </p>
        <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
          {profile.dob || ""}
        </p>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <div
            key={index}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
          >
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <button
          className={`w-full p-3 rounded-[10px] text-white`}
          style={{ backgroundColor: currentColor }}
          onClick={handleLogout}
        >
          Logout
        </button>
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

export default UserProfile;
