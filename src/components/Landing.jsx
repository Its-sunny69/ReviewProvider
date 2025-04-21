import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import TestimonialCard from "./TestimonialCard";
import Footer from "./Footer";
import testimonialImage from "../assets/dashboard.jpg";
import metric from "../assets/metric.png";
import social from "../assets/social.png";
export default function landing() {
  const navigate = useNavigate();
  const testimonialData = [
    {
      badge: "Easy to manage",
      title: "A dashboard to manage all testimonials",
      description:
        "You will have a simple & clean dashboard to manage all testimonials in one place. It's like your email inbox, but it's designed for your social proof!",
      buttonText: "Try it for free",
      image: testimonialImage,
    },
    {
      badge: "Track the metrics",
      title: "Understand how your testimonials are performing",
      description:
        "Track the metrics from all embedded testimonials, help your marketing team understand the performance at a glance, even promote the best-performing product to different marketing channels.",
      buttonText: "Try it for free",
      image: metric,
    },
    {
      badge: "More social proof",
      title: "Not only text testimonials",
      description:
        "If you have testimonials on social media (e.g. Twitter, LinkedIn, Instagram etc), we bring them all to your account. TrustVibes helps you manage all your social proof in a single place!",
      buttonText: "Try it for free",
      image: social,
    },
  ];
  return (
    <>
      <div className="w-full h-full ">
        <Navbar />
        <div className="mx-24 bg-red-400">
          <div className="w-full mt-16 sm:px-24 px-10 sm:py-6 bg-[#222629] ">
            <div className=" my-2 mr-2 py-1 flex flex-col justify-center items-center sm:text-center text-justify">
              <div className="py-2">
                <p className="sm:text-6xl text-3xl font-extrabold drop-shadow-md text-center text-white ">
                  Effortlessly gather testimonials
                </p>
                <p className="sm:text-6xl text-3xl font-extrabold drop-shadow-md text-center text-white">
                  from your customers.
                </p>
              </div>
              <div className="py-6">
                <p className="text-xl text-[#a3b2be] drop-shadow-md">
                  {" "}
                  We understand that collecting testimonials can be challenging.
                  That's why we created TrustVibes. Within minutes, you can
                  collect text and video testimonials from your customers,
                  without needing a developer or website hosting.
                </p>
              </div>
              <div className="py-2 pb-20">
                <button
                  className="border border-1 shadow-md border-blue-800 h-max px-3 py-1.5 rounded-3xl text-white font-mono font-bold text-md bg-blue-800 hover:bg-blue-100 hover:text-slate-900"
                  onClick={() => navigate("/home")}
                >
                  Try Free Now!
                </button>
              </div>
              <div className="w-full max-w-4xl mx-auto aspect-video bg-black border-blue-800 border-2 p-3 rounded-lg">
                <iframe
                  className="w-full h-full rounded-lg "
                  src="https://www.youtube.com/embed/qhduKvNismc?si=srhGYQX0Yp_QK1Ey"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className="mt-36 ">
                <p className="text-white font-bold sm:text-6xl text-3xl">
                  Add testimonials to your website{" "}
                </p>
                <p className="text-white font-bold sm:text-6xl text-3xl">
                  with no coding!
                </p>
                {testimonialData.map((item, idx) => (
                  <TestimonialCard
                    key={idx}
                    item={item}
                    isReversed={idx % 2 !== 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
