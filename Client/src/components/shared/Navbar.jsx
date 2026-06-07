import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "/VANMAN-Logo(red).png";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-blue-500 text-white py-2 text-sm font-semibold">
        <div className="container mx-auto px-6 flex justify-end">
          <a
            href="tel:+1234567890"
            className="hover:text-orange-300 transition"
          >
            GIVE US A CALL: 0155 xx109xx4
          </a>
        </div>
      </div>

      <header className="bg-gray-50 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 h-36 flex justify-between items-center">
          {/* Brand Logo - Added size classes for the image */}
          <Link
            to="/"
            aria-label="VANMAN Logo" // Added accessibility label
            onClick={() => setIsOpen(false)} // Close menu on logo click
          >
            <img
              src={Logo}
              alt="VANMAN Logo"
              className="h-32 w-auto object-contain"
            />
          </Link>

          {/* <nav className="hidden md:flex space-x-6 lg:space-x-8 font-semibold uppercase text-base tracking-wide items-center"> */}
          <nav className="hidden md:flex items-center gap-8 font-bold uppercase text-sm tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-orange-500 hover:scale-105 font-bold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-sm py-1 px-1"
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Link */}

            {!user ? (
              <Link
                to="/auth"
                className="text-gray-700 hover:text-orange-500 hover:scale-105 font-bold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-sm py-1 px-1"
              >
                Login / Sign Up
              </Link>
            ) : (
              <>
                <Link
                  to={
                    user.role === "admin"
                      ? "/admin/dashboard"
                      : "/customer/dashboard"
                  }
                  className="text-gray-700 hover:text-orange-500 transition"
                >
                  Dashboard
                </Link>
              </>
            )}

            {/* <Link
              to="/customer/quote"
              className="ml-4 bg-orange-400 text-white px-16 py-6 rounded-full shadow-2xl font-black text-lg hover:bg-green-500 hover:text-white transition transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-70"
            >
              GET A QUOTE
            </Link> */}
          </nav>

          <div className="hidden md:flex items-center">
            <Link
              to="/customer/quote"
              className="ml-4 bg-orange-400 text-white px-16 py-6 rounded-full shadow-2xl font-black text-lg hover:bg-green-500 hover:text-white transition transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-70"
            >
              GET A QUOTE
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>

        <nav
          id="mobile-menu"
          className={`mobile-nav-menu ${isOpen ? "is-open" : ""}`}
        >
          <div className="flex flex-col px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={toggleMenu}
                className="text-gray-700 hover:text-orange-500 font-bold transition duration-300 ease-in-out py-1 px-1"
              >
                {link.label}
              </Link>
            ))}

            {!user ? (
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-orange-500 font-bold transition duration-300 ease-in-out py-1 px-1"
              >
                Login / Sign Up
              </Link>
            ) : (
              <>
                <Link
                  to={
                    user.role === "admin"
                      ? "/admin/dashboard"
                      : "/customer/dashboard"
                  }
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 font-semibold"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="text-red-600 font-semibold"
                >
                  Logout
                </button>
              </>
            )}

            {/* CTA Button in Mobile Menu */}
            <Link
              to="/quote"
              onClick={toggleMenu}
              className="mt-2 block w-full text-center bg-orange-400 text-white px-3 py-2 rounded-md font-bold text-base shadow-md hover:bg-green-500 transition focus:outline-none focus:ring-2 focus:ring-white"
            >
              GET A QUOTE
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;

// *************************************************************************************************************************************

// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../../components/context/AuthContext";
// import Logo from "/VANMAN-Logo(red).png";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();
//   const { user, logout } = useAuth();

//    const navLinks = [
//     { to: "/", label: "Home" },
//     { to: "/about", label: "About" },
//     { to: "/services", label: "Services" },
//     // { to: "/pricing", label: "Pricing" },
//     { to: "/contact", label: "Contact" },
//     { to: "/user", label: "Login / SignUp" },
//   ];

//   return (
//     <>
//       {/* Top Contact Bar */}
//       <div className="bg-blue-500 text-white py-2 text-sm font-semibold">
//         <div className="container mx-auto px-6 flex justify-end">
//           <a
//             href="tel:+1234567890"
//             className="hover:text-orange-300 transition"
//           >
//             GIVE US A CALL: 0155 xx109xx4
//           </a>
//         </div>
//       </div>

//       {/* Main Navbar */}
//       <header className="bg-gray-50 shadow-md sticky top-0 z-50">
//         <div className="container mx-auto px-6 flex justify-between items-center h-32">
//           {/* Logo */}
//           <Link to="/">
//             <img
//               src={Logo}
//               alt="VANMAN Logo"
//               className="h-32 w-auto object-contain"
//             />
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center gap-8 font-bold uppercase text-sm tracking-wide">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.to}
//                 to={link.to}
//                 className="text-gray-700 hover:text-orange-500 hover:scale-105 font-bold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-sm py-1 px-1"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </nav>

//           {/* Right Side Actions */}
//           <div className="hidden md:flex items-center gap-4">
//             {/* {!user ? (
//               <>
//                 <Link
//                   to="/login"
//                   className="text-gray-700 font-semibold hover:text-orange-500 transition"
//                 >
//                   Login
//                 </Link>

//                 <Link
//                   to="/register"
//                   className="bg-orange-400 text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-500 transition"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/dashboard"
//                   className="text-gray-700 font-semibold hover:text-orange-500 transition"
//                 >
//                   Dashboard
//                 </Link>

//                 <button
//                   onClick={logout}
//                   className="bg-red-100 text-red-600 px-4 py-2 rounded-md font-semibold hover:bg-red-600 hover:text-white transition"
//                 >
//                   Logout
//                 </button>
//               </>
//             )} */}

//             {/* CTA Button */}
//             <Link
//               to="/customer/quote"
//               className="ml-4 bg-orange-400 text-white px-16 py-6 rounded-full shadow-2xl font-black text-lg hover:bg-green-500 hover:text-white transition transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-70"
//             >
//               GET A QUOTE
//             </Link>
//           </div>

//           {/* Mobile Toggle */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden text-gray-700 text-2xl"
//           >
//             ☰
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <div className="md:hidden bg-white shadow-lg">
//             <div className="flex flex-col px-6 py-4 space-y-3">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.to}
//                   to={link.to}
//                   onClick={() => setIsOpen(false)}
//                   className="text-gray-700 font-semibold hover:text-orange-500 transition"
//                 >
//                   {link.label}
//                 </Link>
//               ))}

//               {/* {!user ? (
//                 <>
//                   <Link
//                     to="/login"
//                     onClick={() => setIsOpen(false)}
//                     className="text-gray-700 font-semibold"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     to="/register"
//                     onClick={() => setIsOpen(false)}
//                     className="bg-orange-400 text-white px-4 py-2 rounded-md text-center"
//                   >
//                     Sign Up
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     to="/dashboard"
//                     onClick={() => setIsOpen(false)}
//                     className="text-gray-700 font-semibold"
//                   >
//                     Dashboard
//                   </Link>
//                   <button
//                     onClick={logout}
//                     className="bg-red-100 text-red-600 px-4 py-2 rounded-md"
//                   >
//                     Logout
//                   </button>
//                 </>
//               )} */}

//               <Link
//                 to="/customer/quote"
//                 onClick={() => setIsOpen(false)}
//                 className="bg-orange-400 text-white px-4 py-2 rounded-md text-center font-bold"
//               >
//                 GET A QUOTE
//               </Link>
//             </div>
//           </div>
//         )}
//       </header>
//     </>
//   );
// };

// export default Navbar;

// *************************************************************************************************************************************

// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../../components/context/AuthContext";
// import Logo from "/VANMAN-Logo(red).png";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();
//   const { user, logout } = useAuth();

//   const navLinks = [
//     { to: "/", label: "Home" },
//     { to: "/about", label: "About" },
//     { to: "/services", label: "Services" },
//     { to: "/contact", label: "Contact" },
//   ];

//   return (
//     <>
//       {/* Top Contact Bar */}
//       <div className="bg-blue-500 text-white py-2 text-sm font-semibold">
//         <div className="container mx-auto px-6 flex justify-end">
//           <a
//             href="tel:+1234567890"
//             className="hover:text-orange-300 transition"
//           >
//             GIVE US A CALL: 0155 xx109xx4
//           </a>
//         </div>
//       </div>

//       {/* Main Navbar */}
//       <header className="bg-gray-50 shadow-md sticky top-0 z-50">
//         <div className="container mx-auto px-6 flex justify-between items-center h-32">
//           {/* Logo */}
//           <Link to="/">
//             <img
//               src={Logo}
//               alt="VANMAN Logo"
//               className="h-28 w-auto object-contain"
//             />
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center gap-8 font-bold uppercase text-sm tracking-wide">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.to}
//                 to={link.to}
//                 className={`transition ${
//                   location.pathname === link.to
//                     ? "text-orange-500"
//                     : "text-gray-700 hover:text-orange-500"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}

//             {/* 🔥 AUTH LINK */}
//             {!user ? (
//               <Link
//                 to="/auth"
//                 className="text-gray-700 hover:text-orange-500 transition"
//               >
//                 Login / Sign Up
//               </Link>
//             ) : (
//               <>
//                 <Link
//                   to={
//                     user.role === "admin"
//                       ? "/admin/dashboard"
//                       : "/customer/dashboard"
//                   }
//                   className="text-gray-700 hover:text-orange-500 transition"
//                 >
//                   Dashboard
//                 </Link>

//                 <button
//                   onClick={logout}
//                   className="text-red-600 hover:text-red-700 transition"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}
//           </nav>

//           {/* CTA Button */}
//           <div className="hidden md:flex items-center">
//             <Link
//               to="/customer/quote"
//               className="ml-6 bg-orange-400 text-white px-10 py-4 rounded-full font-bold hover:bg-green-500 transition transform hover:scale-105"
//             >
//               GET A QUOTE
//             </Link>
//           </div>

//           {/* Mobile Toggle */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5
//              rounded-xl bg-white shadow-md
//              hover:bg-orange-50
//              transition-all duration-300"
//           >
//             <span
//               className={`h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
//                 isOpen ? "rotate-45 translate-y-2" : ""
//               }`}
//             ></span>

//             <span
//               className={`h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
//                 isOpen ? "opacity-0" : ""
//               }`}
//             ></span>

//             <span
//               className={`h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
//                 isOpen ? "-rotate-45 -translate-y-2" : ""
//               }`}
//             ></span>
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <div className="md:hidden bg-white shadow-lg">
//             <div className="flex flex-col px-6 py-4 space-y-3">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.to}
//                   to={link.to}
//                   onClick={() => setIsOpen(false)}
//                   className="text-gray-700 font-semibold hover:text-orange-500"
//                 >
//                   {link.label}
//                 </Link>
//               ))}

//               {!user ? (
//                 <Link
//                   to="/auth"
//                   onClick={() => setIsOpen(false)}
//                   className="text-gray-700 font-semibold"
//                 >
//                   Login / Sign Up
//                 </Link>
//               ) : (
//                 <>
//                   <Link
//                     to={
//                       user.role === "admin"
//                         ? "/admin/dashboard"
//                         : "/customer/dashboard"
//                     }
//                     onClick={() => setIsOpen(false)}
//                     className="text-gray-700 font-semibold"
//                   >
//                     Dashboard
//                   </Link>

//                   <button
//                     onClick={() => {
//                       logout();
//                       setIsOpen(false);
//                     }}
//                     className="text-red-600 font-semibold"
//                   >
//                     Logout
//                   </button>
//                 </>
//               )}

//               <Link
//                 to="/customer/quote"
//                 onClick={() => setIsOpen(false)}
//                 className="bg-orange-400 text-white px-4 py-2 rounded-md text-center font-bold"
//               >
//                 GET A QUOTE
//               </Link>
//             </div>
//           </div>
//         )}
//       </header>
//     </>
//   );
// };

// export default Navbar;
