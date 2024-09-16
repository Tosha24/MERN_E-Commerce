import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyEmailQuery } from "../../redux/api/usersApiSlice";
import { toast } from "react-hot-toast";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verificationToken = location.pathname.split("/")[2];

  const { data, error } = useVerifyEmailQuery(verificationToken);

  useEffect(() => {
    if (data) {
      console.log("Data: ", data);
      toast.success(data.message);
      navigate("/login");
    }
    if (error) {
      console.log("error", error);
      toast.error("Could not verify email. Please try again later.");
    }
  }, [data, error, navigate]);

  return (
    <div className="flex justify-center items-center">Verifying email...</div>
  );
};

export default VerifyEmailPage;
