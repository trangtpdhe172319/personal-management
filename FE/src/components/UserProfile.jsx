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
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9999/api/user/jwt-current"
        );
        setProfile({
          _id: response.data._id || "",
          fullName: response.data.fullName || "",
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
      }
    };
    fetchCurrentUser();
  }, []);

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
      const response = await axios.post(
        `http://localhost:9999/api/user/${profile._id}/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfile((prev) => ({ ...prev, avatar: response.data.avatar }));
      setMessage("Avatar updated successfully.");
    } catch (error) {
      setUploadError(
        error.response?.data?.message || "Failed to upload avatar."
      );
    } finally {
      setUploading(false);
    }
  };

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
      </div>
    );
  }

  return (
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
      </div>
    </div>
  );
};

export default UserProfile;
