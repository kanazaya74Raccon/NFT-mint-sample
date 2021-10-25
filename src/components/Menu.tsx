import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import logoImg from '../asset/img/logo.png'

import { animateScroll as scroll, scroller } from 'react-scroll'

export default function Menu() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const onPressTop = () => {
    scroll.scrollToTop();
  }
  const onPressToAbout = () => {
    scroller.scrollTo('element-about', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    })
  }
  const onPressToRoadMap = () => {
    scroller.scrollTo('element-roadmap', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    })
  }
  return (
    <>
      <nav className="flex flex-wrap items-center justify-between px-2 py-3 bg-gray-900 fixed w-full z-10">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <button onClick={onPressTop}>
              <img className="h-10" src={logoImg}></img>
            </button>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-lg uppercase font-bold leading-snug text-white hover:opacity-75 cursor-pointer"
                  onClick={onPressToAbout}
                >
                  <i className="fab fa-facebook-square text-lg leading-lg text-white opacity-75"></i><span className="ml-2">ABOUT</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-lg uppercase font-bold leading-snug text-white hover:opacity-75 cursor-pointer"
                  onClick={onPressToRoadMap}
                >
                  <i className="fab fa-twitter text-xl leading-lg text-white opacity-75"></i><span className="ml-2">ROADMAP</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}