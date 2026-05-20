import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/sidebar.css"
import { HiHome } from "react-icons/hi";
import { BiPaperclip, BiPen } from "react-icons/bi";
import { CgFormatBold } from "react-icons/cg";
import { FaRegWindowMaximize } from "react-icons/fa";
import { PiSunLight } from "react-icons/pi";
import http from "../libs/http";

type SidebarProp = {
    toggleSide: boolean,
    setToggleSide: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = ({ toggleSide, setToggleSide }: SidebarProp) => {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    const [messages, setMessages] = useState<{
        id: string,
        content: string,
        createdAt: Date,
        updatedAt: Date,
    }[]>([]);

    const navigate = useNavigate();
    const params: { id?: string } = useParams();
    const id = params?.id;

    const getActiveClass = (active: boolean) =>
        active ? 'sidebar-link active' : 'sidebar-link'

    const toggleDropdown = () => {
        setOpen(!open);
    };

    const printValue = (name: String) => {
        return toggleSide ? name : ""
    }

    useEffect(() => {
        const theme = localStorage.getItem("theme")
        if (theme === "dark") {
            document.documentElement.classList.add("dark")
        }
    }, [])


    useEffect(() => {
        const fetchConversations = async () => {
            const res = await http.get("/conversations/user");
            console.log(res.data);
            setMessages(res.data);
        }
        fetchConversations();
    }, [])

    const handleThemeMode = () => {
        const isDark = document.documentElement.classList.toggle("dark")
        localStorage.setItem("theme", isDark ? "dark" : "")
    }

    return (
        <div
            data-testid="sidebar"
            className={`main-sidebar sidebar ${toggleSide ? 'open' : 'closed'}`}>
            <div className='sidebar left-sidebar'>

                <div className="side-header">
                    <FaRegWindowMaximize className="side-header-icon" size={30}
                        onClick={() => setToggleSide(prev => !prev)} />
                </div>


                <div className="sidebar-links">
                    <ul>
                        <li>
                            <Link to={"/"} className={getActiveClass(pathname === "/")} >
                                <BiPen size={16} className="icon" />
                                {printValue("Generate")}
                            </Link>
                        </li>
                        <li>
                            <Link to={"/forms"} className={getActiveClass(pathname === "/forms")} >
                                <CgFormatBold className="icon" />
                                {printValue("Forms")}
                            </Link>
                        </li>
                        {/* <li>
                            <Link to={"/submissions"} className={getActiveClass(pathname === "/submission")} >
                                <CgFormatBold className="icon" />
                                {printValue("Submissions")}
                            </Link>
                        </li> */}
                        {
                            toggleSide &&
                            <li>
                                <div className="__sidebar-converstaion-container" >
                                    <p className="__sidebar-converstaion-title" >Chats</p>
                                    <ul className="__sidebar-conversation-lists"  >
                                        {
                                            messages.map((message) => (
                                                <li key={message.id}
                                                    className={`${id === message.id ? 'active' : ''}`}
                                                    onClick={() => {
                                                        navigate(`/c/${message.id}`)
                                                    }}
                                                >{message.content}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </li>
                        }

                        <li className="mt" >
                            <div className="__theme" onClick={handleThemeMode} >
                                <PiSunLight className="icon" />
                                {printValue("Toggle theme")}
                            </div>
                        </li>
                    </ul>
                </div>
                <div className='sidebar-bottom'  >
                </div>

            </div>
        </div>
    )
}

export default Sidebar