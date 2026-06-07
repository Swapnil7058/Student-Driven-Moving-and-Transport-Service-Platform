import React from "react";
import { Link, NavLink } from "react-router-dom"; // Combine imports
import { Star } from "lucide-react";

// Image Imports
import Img1 from "../../assets/images/img1.jpg";
import Img2 from "../../assets/images/happy.jpg";
import longDistance from "../../assets/images/long-distance.jpg";

// Logo Imports (These should be images you can use in an <img> tag)
import Local from "../../assets/logos/store.png";
import Distance from "../../assets/logos/delivery.png";
import Packing from "../../assets/logos/goods.png";
import Special from "../../assets/logos/grand-piano (1).png";

// Service Data with correct logo imports and a fourth service
let services = [
  { id: 1, logo: Local, title: "Local Moving", link: "/services" },
  {
    id: 2,
    logo: Distance,
    title: "Long Distance Moving",
    link: "/services"
  },
  {
    id: 3,
    logo: Packing,
    title: "Packing / Unpacking",
    link: "/services"
  },
  {
    id: 4,
    logo: Special,
    title: "Special Items Moving",
    link: "/services"
  },
];

const reviews = [
  {
    id: 1,
    star: 5,
    reviews:
      '"My wife hired Van Man Packers and Movers to help move our daughter back home to be closer to us. The team was incredibly detailed, communicative, and easy to work with from start to finish. The crew that arrived at her home was professional, respectful, and handled all of her belongings with great care. We’re extremely satisfied with the experience and highly recommend United Express to anyone planning a move!"',
  },
  {
    id: 2,
    star: 5,
    reviews:
      '"VAN MAN Packers and Movers truly impressed us! Knowing the company is run by hardworking students made the experience even more meaningful. Their dedication, professionalism, and energy were visible in every step of the move. They handled our belongings with great care and completed everything smoothly and on time. It’s inspiring to see young students putting in such honest effort to build their future. We’re happy to support them and highly recommend VAN MAN to anyone looking for reliable movers!"',
  },
  {
    id: 3,
    star: 5,
    reviews:
      '"I recently hired VAN MAN Packers and Movers, and I’m genuinely impressed with their service. The team arrived on time, worked quickly, and treated all our items as if they were their own. What really stood out was their friendly attitude and constant communication throughout the move. Everything reached our new home safely and without any hassle. VAN MAN is definitely a company you can trust!"',
  },
];

const Home = () => {
  const getBgStyle = (imagePath) => ({
    backgroundImage: `url(${imagePath})`,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Fixed Background Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center bg-fixed"
        style={getBgStyle(Img1)}
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-blue-900 opacity-70">
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-center mb-6 leading-tight tracking-wider text-orange-600">
            Van Man Packers & Movers
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl md:px-80 font-medium text-center text-white">
            "You help us by us helping you"
          </p>
        </div>
      </div>

      {/* 2. ABOUT US / Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white p-4 md:p-10 max-w-7xl mx-auto">
        <div className="h-full p-4 md:p-10 order-2 md:order-1">
          <img
            src={Img2}
            alt="happy worker"
            className="w-full h-full object-cover rounded-lg shadow-2xl"
          />
        </div>

        <div className="h-full py-6 px-4 md:px-10 flex flex-col justify-center order-1 md:order-2">
          <h2 className="text-3xl font-bold text-orange-600 py-3">
            VAN MAN WE MOVE
          </h2>
          <h4 className="h-1 w-56 bg-amber-400 mb-6"></h4>
          <p className="text-md text-justify font-medium text-gray-700 py-6">
            "Founded by a group of ambitious German students, our moving startup
            is fully committed to providing reliable, affordable, and efficient
            relocation services while supporting our educational journey. What
            began as a way to help fund our studies and manage our personal
            expenses has grown into a dedicated team focused on delivering
            smooth, stress-free moves for individuals, families, and businesses.
            With fresh energy, modern solutions, and a strong work ethic at our
            core, we ensure every relocation is handled with care,
            professionalism, and the quality service you deserve. Together we
            move forward, together we make moving easier."
          </p>
          <div className="flex justify-center md:justify-start">
            <Link
              to="/about" // Changed to /contact for a quote form
              className="bg-orange-400 text-center text-white px-8 py-3 rounded-full shadow-2xl font-black text-lg hover:bg-green-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Know More About Us
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center py-12 px-4 bg-orange-200">
        {/* Heading Section */}
        <div className="mb-12 flex flex-col items-center">
          <h1 className="uppercase text-3xl font-bold text-orange-600 mb-2">
            What our customers are saying
          </h1>
          {/* Adjusted the heading separator to be centered */}
          <h4 className="h-1 w-56 my-3 bg-amber-300"></h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300"
            >
              {/* Star Rating */}
              <div className="flex justify-center mb-4">
                {/* Correct way to generate dynamic JSX elements */}
                {Array.from({ length: review.star }).map((_, index) => (
                  <Star
                    key={index}
                    className="w-6 h-6 fill-amber-500 text-amber-500"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 italic text-lg leading-relaxed">
                {review.reviews}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. OUR SERVICES SECTION - Cards */}
      <div className="text-center py-12 px-4 bg-amber-50">
        <h3 className="text-2xl font-bold text-orange-600 mb-2">OUR SERVICES</h3>
        <h2 className="text-4xl font-extrabold text-gray-600 mb-10">
          Solutions Tailored for You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((item) => (
            <NavLink
              to={item.link}
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl 
                                transition duration-300 transform hover:scale-[1.03] 
                                flex flex-col items-center text-center group"
            >
              {/* Logo/Icon Container */}
              <div className="w-20 h-20 mb-4 rounded-full flex items-center justify-center shadow-lg">
                <img
                  src={item.logo} // Correct way to render the imported image
                  alt={`${item.title} Logo`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title */}
              <h4 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition duration-300">
                {item.title}
              </h4>

              {/* Call to Action */}
              <span className="text-sm text-blue-600 font-medium mt-2">
                Learn More &rarr;
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* 4. Call to Action Banner */}
      <div
        className="relative h-96 bg-cover bg-center bg-fixed"
        style={getBgStyle(longDistance)}
      >
        <div className="absolute text-white inset-0 flex flex-col justify-center items-center p-4 bg-orange-600 opacity-80 text-center">
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-wider text-slate-800">
            Ready to Schedule Your Move?
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-white max-w-4xl mb-6">
            Contact us today for a free, no-obligation quote and let us handle
            the heavy lifting
          </p>
          <Link
            to="/customer/quote" // Link to the contact page
            className="bg-white text-red-950 px-8 py-3 rounded-full shadow-2xl font-black text-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            GET YOUR FREE QUOTE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
