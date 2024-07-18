import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyEmailQuery } from '../../redux/api/usersApiSlice';
import {toast} from 'react-hot-toast';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
//   http://localhost:5173/verify-email/5ad53ad35d631a7df90b0096ee87bcd6582a865d
    const verificationToken = location.pathname.split("/")[2];


  const { data, error } = useVerifyEmailQuery(verificationToken);

  console.log("data", data);

  useEffect(() => {
    if (data) {
      toast.success(data.message);
      navigate('/login');
    }
    if (error) {
      console.log("error", error);
    }
  }, [data, error, navigate]);

  return (
    <div className='flex justify-center items-center'>
      Verifying email...
    </div>
  );
};

export default VerifyEmailPage;
