'use client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Lobster, Rubik_Vinyl } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { myApp } from "./firebase.config";
import { useEffect, useState, createContext } from "react";
import {
    GoogleAuthProvider,
    getAuth,
    onAuthStateChanged,
    signInWithPopup,
    signOut
} from "firebase/auth";

const auth = getAuth(myApp);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

const queryClient = new QueryClient();
const rubik_vinyl = Rubik_Vinyl({
    weight: ['400'],
    style: ["normal"],
    subsets: ["latin"]
})
const lobster = Lobster({
    weight: ['400'],
    style: ["normal"],
    subsets: ["latin"]
})

export const UserContext = createContext();

export default function AppBackground({ children }) {
    const [sidebarOpenStatas, setSidebarOpenStatas] = useState(false);
    const [user, setUser] = useState(null);
    const [reloadSideBar, reloadSideBarFunction] = useState(1);

    const hideSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('w-72')
        sidebar.classList.add('w-0')
    }
    const openSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('w-0')
        sidebar.classList.add('w-72')
    }

    const openHistryBar = () => {
        if (sidebarOpenStatas) hideHistryBar();
        else {
            openSidebar();
            setSidebarOpenStatas(true);
        }
    }
    const hideHistryBar = () => {
        hideSidebar();
        setSidebarOpenStatas(false);
    }

    // For  user authentication
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    name: currentUser.displayName,
                    email: currentUser.email,
                    photoURL: currentUser.photoURL,
                    uid: currentUser.uid
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const logInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await result.user.reload(); // Reload the user to ensure up-to-date data
            const updatedUser = auth.currentUser;
            setUser({
                name: updatedUser.displayName,
                email: updatedUser.email,
                photoURL: updatedUser.photoURL,
                uid: updatedUser.uid
            });
        } catch (error) {
            console.error("Login failed:", error.message);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            {user == null &&
                <div className="w-full h-screen absolute top-0 left-0 z-50 flex justify-center items-center">
                    <div className="bg-gray-100 opacity-60 absolute w-full h-full -z-10"></div>
                    <button onClick={() => logInWithGoogle()} className="w-36 sm:w-48 aspect-square flex justify-center items-center bg-white rounded-full overflow-hidden">
                        <img
                            src="login.gif" alt="Login"
                            className='w-5/6 aspect-square -translate-x-1'
                        />
                    </button>
                </div>
            }

            <UserContext.Provider value={{ user, logOut, reloadSideBar, reloadSideBarFunction }}>
                <div className="w-full h-dvh flex flex-row bg-[#111827] text-[#e3f1f9]">
                    <div id="sidebar" className={`w-0 h-screen lg:w-1/3 max-w-[310px] transition-all duration-300 max-lg:fixed z-40 overflow-hidden`}>
                        <Sidebar />
                    </div>
                    <div onClick={() => hideHistryBar()} className="w-2/3 flex-1 h-full overflow-y-auto pb-6 sm:pb-10">
                        <div>
                            <div className="lg:hidden w-full h-[3.5rem] sm:h-16 flex items-center justify-between px-2 bg-gradient-to-r from-black to-[#003760]">
                                <a href='/' className="w-full h-full flex items-center justify-start gap-1">
                                    <div className="h-9 sm:h-10 aspect-square">
                                        <img src="/icon.png" alt="" className="w-full h-full" />
                                    </div>
                                    <div className={`${rubik_vinyl.className} h-auto flex-1 text-[30px] sm:text-[35px] font-bold text-white`}>
                                        DefectLens
                                    </div>
                                </a>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent parent div's onClick from firing
                                        openHistryBar();
                                    }}
                                    className="h-full aspect-square flex justify-start items-center">
                                    {sidebarOpenStatas ?
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-2/3 aspect-square">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-3/4 aspect-square">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
                                        </svg>
                                    }
                                </button>
                            </div>

                            <div className="w-full h-full pt-5 flex flex-col gap-4 px-2 lg:px-10">
                                <div className="mb-4">
                                    <div className="w-full h-7 sm:h-8 md:h-10 lg:h-12 flex flex-row gap-2 justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="h-3/4 aspect-square">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                                        </svg>

                                        <p className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#6c62f9]  to-[#90ffeb] text-transparent bg-clip-text">Elevate Your Code Quality</p>
                                    </div>
                                    <div className={`${lobster.className} w-full flex justify-center items-center text-xs md:text-sm lg:text-base text-[#52caef8f]`}>
                                        Code Quality Guardian: Detect Defects, Enhance Maintainability
                                    </div>
                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </UserContext.Provider>
        </QueryClientProvider>
    );
}