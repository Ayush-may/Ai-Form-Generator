import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { CiLogout, CiUser } from "react-icons/ci";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";
import "../styles/Topbar.css"
import { CgDarkMode } from "react-icons/cg";
import { BiSun } from "react-icons/bi";

type SidebarProp = {
    toggleSide: boolean,
    setToggleSide: React.Dispatch<React.SetStateAction<boolean>>
}

const Topbar = ({ setToggleSide, toggleSide }: SidebarProp) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setOpen(!open);
    };

    // Close the dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (dropdownRef.current &&
                // @ts-ignore
                !dropdownRef.current.contains(event.target)
            ) {

                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleClick = () => {
        const newToggleState = !toggleSide;
        setToggleSide(newToggleState);
    };

    return (
        <div className="main-top-bar">
            <div className="left-section-topbar">
                {/* <button className='menubar-top' onClick={handleClick}>
                    <AiOutlineMenu />
                </button> */}
                {/* <div className="greeting">
                    <h1>Form Generator</h1>
                    <p>Org Code </p>
                </div> */}
            </div>
            <div className="right-section-topbar" ref={dropdownRef}>

                <div className='profile-section' onClick={toggleDropdown}>
                    <div>
                        <p>asd</p>
                        <small>asdadasd</small>
                    </div>

                    <span className="profile-arrow">
                        {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>

                    <span className="profile-arrow">
                        {/* {open ? <IoIosArrowUp /> : <IoIosArrowDown />} */}
                        {/* <BiSun className="__theme-mode" /> */}
                    </span>
                </div>

                {open && (
                    <div className="profile-dropdown">
                        <div className='profile-dropdown-header'>
                            <h2>My Account</h2>
                        </div>
                        <div className='profile-dropdown-mid'>
                            <p><CiUser size={16} className='icon' /> Ayush Sharma</p>
                            <p>
                                <CgDarkMode size={16} className='icon' />
                                Dark Mode
                            </p>
                        </div>
                        <div className='profile-dropdown-bottom'>
                            <div className='dropdown-signout-section' onClick={() => { }} >
                                <span className='signout-icon'><CiLogout /></span>
                                <span>Sign Out</span>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div >
    )
}

export default Topbar