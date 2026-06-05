import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"
import ConversationComponent from "../components/ConversationComponent";

const Conversation = () => {
    const [toggleSide, setToggleSide] = useState(() => {
        return localStorage.getItem("sidebar") === "true";
    });

    useEffect(() => {
        localStorage.setItem("sidebar", String(toggleSide));
    }, [toggleSide]);

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (
                toggleSide &&
                !e.target.closest(".sidebar") &&
                !e.target.closest(".menubar-top")
            ) {
                // setToggleSide(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [toggleSide]);


    return (
        <div className='main-container'>
            <div className='left-section'>
                <Sidebar toggleSide={toggleSide} setToggleSide={setToggleSide} />
            </div>
            <div className='right-section'>
                <div className='content-container'>
                    {/* <ChatComponent /> */}
                    <ConversationComponent />
                </div>
                {toggleSide && <div className='overlay'></div>}
            </div>

        </div>
    )
}

export default Conversation