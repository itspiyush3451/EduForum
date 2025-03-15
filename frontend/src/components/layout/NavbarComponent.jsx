
import { useState ,useEffect} from "react";
import React from "react";
import {jwtDecode} from 'jwt-decode';



const Navbar = () => {
  const [username, setUsername] = useState('');

  const decodeToken = () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (token) {
      const decoded = jwtDecode(token); // Decode the token
      if (decoded) {
        setUsername(decoded.username); // Set the username from the token
      }
    }
    else {
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    decodeToken(); // Decode token on component mount
  }, []);

  const handleLogoClick = () => {
    window.location.href = '/dashboard';
  };
  return (
    <nav className="bg-gray-700 w-auto font-poppins">
      <div className="container mx-auto flex items-center justify-between px-6 py-2">
        <div className="flex items-center" onClick = {handleLogoClick}>
          <svg
            width="147"
            height="38"
            viewBox="0 0 147 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="4" width="30" height="30" rx="6" fill="#F7F7F7" />
            <path
              d="M55.12 23.648H49V32H41.8V9.5H56.56L55.66 15.26H49V18.284H55.12V23.648ZM73.6502 25.556L74.1902 31.604C72.6782 32.228 70.7822 32.54 68.5022 32.54C66.2222 32.54 64.3862 32.3 62.9942 31.82C61.6262 31.34 60.5462 30.584 59.7542 29.552C58.9622 28.52 58.4102 27.308 58.0982 25.916C57.7862 24.524 57.6302 22.808 57.6302 20.768C57.6302 18.728 57.7862 17.012 58.0982 15.62C58.4102 14.204 58.9622 12.98 59.7542 11.948C61.2902 9.956 64.1102 8.96 68.2142 8.96C69.1262 8.96 70.1942 9.056 71.4182 9.248C72.6662 9.416 73.5902 9.632 74.1902 9.896L73.1102 15.404C71.5502 15.068 70.1222 14.9 68.8262 14.9C67.5302 14.9 66.6302 15.02 66.1262 15.26C65.6222 15.5 65.3702 15.98 65.3702 16.7V26.132C66.3062 26.324 67.2542 26.42 68.2142 26.42C70.2542 26.42 72.0662 26.132 73.6502 25.556ZM94.7242 32V24.044H89.3242V32H82.1242V9.5H89.3242V17.456H94.7242V9.5H101.924V32H94.7242ZM112.198 9.5V26.384H114.754C115.666 26.384 116.29 26.276 116.626 26.06C116.962 25.82 117.13 25.292 117.13 24.476V9.5H124.33V22.136C124.33 24.176 124.198 25.82 123.934 27.068C123.67 28.316 123.178 29.372 122.458 30.236C121.738 31.1 120.754 31.7 119.506 32.036C118.258 32.372 116.638 32.54 114.646 32.54C112.654 32.54 111.034 32.372 109.786 32.036C108.562 31.7 107.59 31.1 106.87 30.236C106.15 29.372 105.658 28.316 105.394 27.068C105.13 25.82 104.998 24.176 104.998 22.136V9.5H112.198ZM127.405 32V9.5H139.069C141.229 9.5 142.765 9.92 143.677 10.76C144.613 11.6 145.081 12.824 145.081 14.432C145.081 16.04 144.781 17.288 144.181 18.176C143.605 19.04 142.825 19.604 141.841 19.868V20.084C144.745 20.588 146.197 22.568 146.197 26.024C146.197 27.824 145.717 29.276 144.757 30.38C143.797 31.46 142.321 32 140.329 32H127.405ZM137.413 23.036H134.605V26.708H137.377C138.385 26.708 138.889 26.096 138.889 24.872C138.889 23.648 138.397 23.036 137.413 23.036ZM136.873 14.432H134.605V17.78H136.837C137.749 17.78 138.205 17.228 138.205 16.124C138.205 14.996 137.761 14.432 136.873 14.432Z"
              fill="#4A87FF"
            />
            <path
              d="M15.37 8.68507L24.37 11.8644C24.72 11.988 25 12.3589 25 12.6857V15.6177C25 16.1035 24.55 16.5009 24 16.5009H6C5.45 16.5009 5 16.1035 5 15.6177V12.6857C5 12.3589 5.28 11.988 5.63 11.8644L14.63 8.68507C14.83 8.61442 15.17 8.61442 15.37 8.68507Z"
              stroke="black"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M25 26.2155H5V23.5661C5 23.0803 5.45 22.6829 6 22.6829H24C24.55 22.6829 25 23.0803 25 23.5661V26.2155Z"
              stroke="black"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7 22.6829V16.5009"
              stroke="black"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11 22.6829V16.5009"
              stroke="black"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15 22.6829V16.5009"
              stroke="black"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M19 22.6829V16.5009"
              stroke="black"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M23 22.6829V16.5009"
              stroke="black"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4 26.2155H26"
              stroke="black"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15 14.293C15.8284 14.293 16.5 13.7 16.5 12.9683C16.5 12.2367 15.8284 11.6436 15 11.6436C14.1716 11.6436 13.5 12.2367 13.5 12.9683C13.5 13.7 14.1716 14.293 15 14.293Z"
              stroke="black"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        {/* Search bar in the center */}
        {/* <input
          type="search"
          placeholder="Search"
          className="mr-10 ml-10 px-3 py-2 rounded-md border border-gray-800 bg-gray-800 text-white-100 w-full focus:outline-none focus:ring ring-blue-500 focus:ring-opacity-50"
        /> */}

        {/* User profile and notification on the right */}
        <div className="flex items-center space-x-4 text-white-100">
        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
             <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg> */}
        <div className = "border rounded"  >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
</div>
          <div className="font-bold text-white-100">{username}</div>
          <div className="font-bold text-white-100">
            <button className="bg-red-500 rounded-md px-2 py-2 drop-shadow-sm"
            onClick={() => {localStorage.removeItem('token');
            window.location.href = '/login'}}
            >Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

