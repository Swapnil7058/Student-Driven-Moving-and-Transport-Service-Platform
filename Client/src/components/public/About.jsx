import React from "react";
import Img1 from "../../assets/images/img1.jpg";
import Img2 from "../../assets/images/unite.jpg";

const achivements = [
  { id: 1, figure: "98%", title: "Customer Satisfaction" },
  { id: 2, figure: "250+", title: "Professional Movers" },
  { id: 3, figure: "4.5⭐", title: "Average Customer Ratings" },
  { id: 4, figure: "50+", title: "States Covered" },
];

const About = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center p-4 py-20 bg-slate-600">
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-center mb-6 leading-tight tracking-wider text-white">
          About Van Man
        </h1>
        <p className="text-xl sm:text-md lg:text-xl md:px-80 font-medium text-center text-white">
          A student-driven moving company built on hard work, honesty, and a
          mission to make moving simple for everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white p-4 md:p-10 max-w-7xl mx-auto">
        <div className="h-full py-6 px-4 md:px-10 flex flex-col justify-center order-2 md:order-1">
          <h2 className="text-5xl font-extrabold text-orange-600 py-3">
            OUR STORY
          </h2>
          <h4 className="h-1 w-56 bg-amber-400 mb-6"></h4>
          <p className="text-md text-justify font-medium text-gray-700 py-6">
            "VAN MAN Packers and Movers began with a simple idea and a strong
            purpose: to create honest, reliable moving services while supporting
            our education and future. As a team of determined German students,
            we started this company to help manage our tuition, living expenses,
            and personal growth—not just financially, but professionally.{" "}
          </p>
          <p className="text-md text-justify font-medium text-gray-700 py-6">
            What began as a small initiative with a single van has grown into a
            trusted moving service driven by passion, discipline, and a
            commitment to excellence. Every move we handle reflects our values:
            hard work, transparency, respect, and genuine care for the people we
            serve. We know what it means to build a better future through
            effort, and we carry that same spirit into every box we pack and
            every home or office we help relocate.{" "}
          </p>
          <p className="text-md text-justify font-medium text-gray-700 py-6">
            Today, VAN MAN stands not only as a moving company but as a reminder
            that great things can be built from humble beginnings. Our journey
            continues with every client who trusts us, and we’re proud to offer
            dependable, student-driven services that make moving easier,
            smoother, and stress-free."
          </p>
          <p className="font-bold">
            United by ambition. Driven by purpose. Moving with heart.
          </p>
        </div>

        <div className="h-full p-4 md:p-10 order-1 md:order-2">
          <img
            src={Img2}
            alt="happy worker"
            className="w-full h-full object-cover rounded-lg shadow-2xl"
          />
        </div>
      </div>

      <div className="py-10 bg-amber-100">
        <h1
          className=" text-orange-600 text-center text-5xl font-bold border-b-4 md:mx-104 border-amber-300
         py-3 mb-14 "
        >
          Key Features
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
          {achivements.map((item) => (
            <div key={item.id} className="flex flex-col justify-center items-center">
              <h1 className="text-5xl font-extrabold text-red-600 mb-5">
                {item.figure}
              </h1>
              <h4 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition duration-300">
                {item.title}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default About;
