import React from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

import local from "../../assets/images/local.jpg";
import longDistance from "../../assets/images/long-distance.jpg";
import packging from "../../assets/images/packaging.webp";
import specialItems from "../../assets/images/special-item.jpg";

import HomeLogo from "../../assets/logos/HomeLogo.png";
import Distance from "../../assets/logos/DistanceLogo.png";
import Packing from "../../assets/logos/BoxLogo.png";
import Special from "../../assets/logos/PianoLogo.png";

const servicesData = [
  {
    id: 1,
    img: local,
    title: "Local Moving",
    iconKey: HomeLogo,
    description:
      "Professional moving services within your city or metropolitan area. Our local movers are familiar with the area and can navigate efficiently to save you time and money.",
    features: [
      "Same-day service available",
      "Transparent hourly rates",
      "No hidden fees",
      "Flexible scheduling",
      "Local expertise",
    ],
    price: { starting: 89, details: "2-hour minimum • 2 movers included" },
    btnMsg: "BOOK LOCAL MOVE",
  },
  {
    id: 2,
    img: longDistance,
    title: "Long Distance Moving",
    iconKey: Distance,
    description:
      "Relocate across state lines with confidence. Our long-distance moving services include careful planning, secure packing, and timely delivery to your new home.",
    features: [
      "Guaranteed delivery dates",
      "All-inclusive pricing",
      "Full-value protection",
      "Tracking throughout the move",
      "Storage options available",
    ],
    price: { starting: 499, details: "Full value protection included" },
    btnMsg: "GET LONG DISTANCE QUOTE",
  },
  {
    id: 3,
    img: packging,
    title: "Packing Services",
    iconKey: Packing,
    description:
      "Let our packing experts carefully wrap and protect your belongings using high-quality materials and proven techniques to ensure everything arrives safely.",
    features: [
      "Full-service packing",
      "Partial packing options",
      "Supply kits provided",
      "Custom crating available",
      "Unpacking services",
    ],
    price: { starting: 149, details: "Materials and one packer included" },
    btnMsg: "SCHEDULE PACKAGING",
  },
  {
    id: 4,
    img: specialItems,
    title: "Special Items Handling",
    iconKey: Special,
    description:
      "Expert care for your most valuable and delicate possessions including pianos, antiques, artwork, and sensitive electronics.",
    features: [
      "Piano moving specialists",
      "Art and antique handling",
      "Safe and gun cabinet moving",
      "Pool table disassembly",
      "Custom crating solutions",
    ],
    price: { starting: 199, details: "Specialized equipment fee" },
    btnMsg: "DISCUSS SPECIAL ITEM QUOTES",
  },
];

const process = [
  {
    id: 1,
    title: "Consultation & Quote",
    description:
      "We start with a detailed assessment of your moving needs and provide a transparent, all-inclusive quote.",
  },
  {
    id: 2,
    title: "Custom Moving Plan",
    description:
      "We create a tailored moving strategy with timeline, resources, and special requirements outlined.",
  },
  {
    id: 3,
    title: "Professional Packing",
    description:
      "Our team carefully packs your belongings using high-quality materials and proven techniques.",
  },
  {
    id: 4,
    title: "Secure Transportation",
    description:
      "Your items are transported in our modern, GPS-tracked vehicles with full insurance coverage.",
  },
  {
    id: 5,
    title: "Careful Unloading",
    description:
      "We unload and place your items according to your instructions, with furniture assembly if needed.",
  },
  {
    id: 6,
    title: "Follow-up & Support",
    description:
      "We check in after your move to ensure your satisfaction and address any post-move needs.",
  },
];

const Services = () => {
  const getBgStyle = (imagePath) => ({
    backgroundImage: `url(${imagePath})`,
  });
  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="inset-0 flex flex-col justify-center items-center p-4 py-24 lg:px-104 bg-slate-600">
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-center leading-tight tracking-wider text-white">
            Our Moving Services
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-center text-white m-10">
            Comprehensive relocation solutions tailored to your specific needs,
            with transparent pricing and exceptional care
          </p>

          <Link
            to="/customer/quote" // Link to the contact page
            className=" bg-orange-500 text-white px-10 py-5 rounded-full shadow-2xl font-black text-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            GET YOUR FREE QUOTE
          </Link>
        </div>

        <div className="py-20 bg-yellow-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-gray-700 font-extrabold text-4xl sm:text-5xl">
                Our Moving Solutions
              </h1>
              <div className="h-1 w-24 bg-amber-600 mx-auto my-4"></div>
              <p className="text-gray-600">
                Tailored services to move anything, anywhere.
              </p>
            </div>

            {/* Cart Layout*/}
            <div className="flex flex-wrap justify-center gap-8 px-10">
              {servicesData.map((item) => (
                <div
                  key={item.id}
                  className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.3333%-1.33rem)] max-w-sm"
                >
                  <div
                    className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col h-full 
                                   transition duration-300 ease-in-out 
                                   hover:shadow-2xl hover:scale-[1.03] transform"
                  >
                    {/* Image Slot */}
                    <div className="h-48">
                      <img
                        src={item.img}
                        alt={`${item.title} service`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-10 pt-4 flex flex-col grow">
                      {/* Icons */}
                      <div className="w-20 h-20 flex items-center justify-center">
                        <img
                          src={item.iconKey}
                          alt={`${item.title} logo`}
                          className="w-full h-full object-contain filter"
                        />
                      </div>

                      {/* Title and Description */}
                      <h2 className="text-3xl font-bold text-gray-800 mb-3">
                        {item.title}
                      </h2>
                      <p className="text-gray-600 mb-6 grow">
                        {item.description}
                      </p>

                      {/* Features List with Checkmarks */}
                      <ul className="space-y-3 text-gray-700 mb-8 mt-auto">
                        {item.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start text-base"
                          >
                            <Check
                              size={18}
                              className="text-green-600 mr-2 mt-1 shrink-0"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Pricing Block */}
                      {item.price && (
                        <div className="p-4 bg-orange-50 border-l-4 border-orange-600 mb-6">
                          <p className="text-lg text-gray-800">
                            <span className="text-3xl font-bold text-orange-700">
                              Starting at ${item.price.starting}
                            </span>
                            <span className="text-sm font-medium">/hour</span>
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.price.details}
                          </p>
                        </div>
                      )}

                      {/* Action Button */}
                      <Link
                        to="/customer/quote"
                        className=" text-center w-full py-4 bg-orange-700 text-white font-bold uppercase tracking-wider rounded-lg hover:bg-orange-800 transition duration-300">
                        {item.btnMsg}
                      </Link>
                    </div>
                  </div>
                  {/* END OF CARD STRUCTURE */}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-20 bg-fuchsia-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-gray-700 font-extrabold text-4xl sm:text-5xl">
                Our Moving Process
              </h1>
              <div className="h-1 w-24 bg-amber-600 mx-auto my-4"></div>
              <p className="text-gray-600">
                Tailored services to move anything, anywhere.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item) => {
                return (
                  <div
                    key={item.id}
                    // Adjusted classes for better visual consistency and responsiveness
                    className="bg-white p-6 rounded-lg shadow-xl 
                               transition duration-300 transform hover:scale-[1.03] 
                               flex flex-col text-center"
                  >
                    {/* Step Number Circle */}
                    <div
                      className="h-16 w-16 text-2xl text-white font-bold 
                                    bg-orange-600 rounded-full mx-auto mb-6 
                                    flex justify-center items-center"
                    >
                      {item.id}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 grow">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="relative py-20 bg-cover bg-center"
          style={getBgStyle(longDistance)}
        >
          <div className="absolute inset-0 bg-orange-600 opacity-80"></div>

          <div className="relative z-10 text-white container mx-auto px-52">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
              {/* Left side: Text/Heading */}
              <div className="flex flex-col justify-center items-center md:text-left">
                <h2 className="text-sm text-center uppercase tracking-widest font-semibold mb-2 text-orange-200">
                  Stop Stressing, Start Moving
                </h2>
                <h1 className="text-3xl text-center sm:text-4xl font-extrabold mb-4">
                  GET YOUR FREE QUOTE TODAY!
                </h1>
                <p className="text-lg text-center text-orange-100">
                  Contact us to receive a transparent, no-obligation estimate
                  for your move.
                </p>
              </div>

              {/* Right side: Action Button (or Quote API placeholder) */}
              <div className="flex justify-center md:justify-end">
                <Link
                  to="/customer/quote"
                  className="bg-white text-orange-700 px-8 py-4 rounded-full shadow-2xl font-black text-lg hover:bg-gray-200 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  REQUEST A QUOTE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
