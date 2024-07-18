import { useState } from "react";
import { useCreateReviewMutation } from "../redux/api/productApiSlice";
import toast from "react-hot-toast";

const ReviewModal = ({ isOpen, onClose, productName, productId }) => {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const [createReview] = useCreateReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      toast.success("Review created successfully");
      onClose();
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } fixed inset-0 bg-gray-900 bg-opacity-50 z-50 overflow-y-auto`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-white/10"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Rate for: <span className="font-bold">{productName}</span>
            </h3>
            <div className="mt-2">
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700"
              >
                Rating
              </label>
              <select
                id="rating"
                name="rating"
                className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                onChange={handleRatingChange}
                value={rating}
              >
                <option value="">Select any one</option>
                <option value="1">Poor &#9733;</option>
                <option value="2">Fair &#9733;&#9733;</option>
                <option value="3">Average &#9733;&#9733;&#9733;</option>
                <option value="4">Good &#9733;&#9733;&#9733;&#9733;</option>
                <option value="5">
                  Excellent &#9733;&#9733;&#9733;&#9733;&#9733;
                </option>
              </select>
            </div>
            <div className="mt-2">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700"
              >
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="3"
                className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                placeholder="Write your comment..."
                onChange={handleCommentChange}
                value={comment}
              ></textarea>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
