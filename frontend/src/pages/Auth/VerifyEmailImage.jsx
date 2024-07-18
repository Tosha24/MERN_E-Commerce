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
      toast.success(data.message);
      navigate("/login");
    }
    if (error) {
      console.log("error", error);
    }
  }, [data, error, navigate]);

  return (
    <div className="flex justify-center items-center">Verifying email...</div>
  );
};

export default VerifyEmailPage;
