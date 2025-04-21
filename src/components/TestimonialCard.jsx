import React from "react";
import { useNavigate } from "react-router-dom";
const TestimonialCard = ({ item, isReversed }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`flex flex-col md:flex-row ${
        isReversed ? "md:flex-row-reverse" : ""
      } items-center md:items-start justify-between gap-40 mt-32`}
    >
      {/* Left Section */}
      <div className="flex-1 text-left">
        <p className="text-xl text-indigo-400 font-semibold mb-2">
          {item.badge}
        </p>
        <h2 className="text-white text-2xl sm:text-3xl font-extrabold mb-4">
          {item.title}
        </h2>
        <p className="text-base sm:text-lg text-gray-400 mb-6">
          {item.description}
        </p>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded w-full sm:w-auto"
          onClick={() => navigate("/home")}
        >
          {item.buttonText}
        </button>
      </div>

      {/* Right Section */}
      <div className="flex-1 w-full bg-gray-900 p-6 rounded-xl shadow-lg text-center">
        <img
          src={item.image}
          alt="Testimonial"
          className="rounded-md mb-6 mx-auto max-h-60 w-full object-cover"
        />
        <h3 className="text-lg sm:text-xl font-semibold mb-2">
          {item.testimonialTitle}
        </h3>
        <p className="text-gray-400 mb-4">{item.testimonialSubtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center"></div>
      </div>
    </div>
  );
};

export default TestimonialCard;
