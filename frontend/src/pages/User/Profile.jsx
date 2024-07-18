import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 -mt-9">
      <div className="w-full sm:w-11/12 m-2 md:w-4/5 lg:w-2/3 xl:w-1/2 bg-rose-100 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Update Profile
        </h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="form-input p-3 w-full rounded-md border focus:outline-none focus:ring focus:border-blue-300"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              className="form-input p-3 w-full rounded-md border focus:outline-none focus:ring focus:border-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="form-input p-3 w-full rounded-md border focus:outline-none focus:ring focus:border-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="form-input p-3 w-full rounded-md border focus:outline-none focus:ring focus:border-blue-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600"
            >
              Update
            </button>
          </div>
        </form>
        {loadingUpdateProfile && <Loader />}
      </div>
    </div>
  );
};

export default Profile;