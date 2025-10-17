'use client';

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Popover,
    PopoverButton,
    PopoverPanel,
    TransitionChild,
} from '@headlessui/react';
import {
    Bars3Icon,
    ChevronUpIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import NavMenu from '@/app/components/NavMenu';
import { useEffect, useState } from 'react';
import { bottomNavigation } from '@/app/setting';
import { useRouter } from 'next/navigation';
import { User } from '@/types/UserType';

type SidebarProps = {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const cookies = document.cookie
            .split('; ')
            .reduce((acc: Record<string, string>, cookie) => {
                const [key, val] = cookie.split('=');
                acc[key] = decodeURIComponent(val);
                return acc;
            }, {});

        const userCookie = cookies['user'];
        if (userCookie) {
            try {
                setUser(JSON.parse(userCookie));
            } catch {
                setUser(null);
            }
        }

    }, []);

    const handleLogout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/auth/login');
    };

    return (
        <>
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity duration-300" />
                <div className="fixed inset-0 flex">
                    <DialogPanel className="relative mr-16 rounded-r-4xl border-orange-200 flex w-full max-w-xs flex-1 transform transition duration-700 ease-in data-closed:translate-x-full sm:duration-700 bg-white">
                        <TransitionChild>
                            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(false)}
                                    className="-m-2.5 p-2.5"
                                >
                                    <span className="sr-only">Close sidebar</span>
                                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </button>
                            </div>
                        </TransitionChild>
                        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} user={user} onLogout={handleLogout} />
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Mobile toggle */}
            <div className="sticky top-0 z-40 flex h-16 items-center px-2 sm:px-4 lg:px-6 lg:hidden">
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="-m-2.5 p-2.5 text-orange-500 hover:text-orange-900"
                >
                    <Bars3Icon className="size-6 mr-2" />
                </button>
            </div>

            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-white px-6 pb-4 border-r rounded-r-4xl border-orange-200">
                <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} user={user} onLogout={handleLogout} />
            </div>
        </>
    );
};

const SidebarContent = ({
    collapsed,
    user,
    onLogout,
}: {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
    user: User | null;
    onLogout: () => void;
}) => (
    <div
        className="flex grow flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-50 hover:scrollbar-thumb-gray-100 scrollbar-track-transparent pt-2"
        style={{ height: 'calc(100vh - 60px)' }}
    >
        <div className="flex items-center justify-center mb-2">
            <Image
                src="/logo.svg"
                alt="African Market Hub"
                width={150}
                height={40}
                className="h-10 w-30"
                priority
            />
        </div>
        <nav className="flex flex-1 flex-col justify-between">
            <NavMenu user={user} />
            <BottomMenu collapsed={collapsed} user={user} onLogout={onLogout} />
        </nav>
    </div>

);

function BottomMenu({
    collapsed,
    user,
    onLogout,
}: {
    collapsed: boolean;
    user: User | null;
    onLogout: () => void;
}) {

    return (
        <Popover className="relative w-1/2">
            <div className="fixed bottom-0 z-50 bg-hub-primary-400 text-white rounded-xl shadow-inner px-1.5 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-x-1">
                    <Image
                        className="size-5 rounded-full object-cover"
                        src="/icon.svg"
                        alt="Profile"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                            {user?.name} {user?.last_name}
                        </span>
                        <span className="max-w-[120px] truncate text-xs text-white">
                            {user?.email}
                        </span>
                    </div>
                </div>

                <PopoverButton className="text-white hover:text-white transition" aria-label="Toggle menu">
                    {({ open }) => (
                        <ChevronUpIcon className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                    )}
                </PopoverButton>
            </div>

            {/* Menu Panel */}
            <PopoverPanel className="fixed bottom-[37px] z-40 px-5">
                <div className="rounded-xl text-white p-3">
                    {bottomNavigation.map((item) => (
                        <button
                            key={item.name}
                            onClick={item.isLogout ? onLogout : undefined}
                            className={`w-full text-left flex items-center cursor-pointer gap-x-3 rounded-md px-4 py-2 text-xs font-medium hover:bg-white/10 ${item.isLogout ? 'text-orange-500 font-bold bg-white border hover:bg-white hover:text-white' : ''
                                } ${collapsed ? 'justify-center' : ''}`}
                        >
                            <item.icon
                                className={`size-4 ${item.isLogout ? 'text-red-500 hover:text-white font-bold' : 'text-white'
                                    }`}
                            />
                            {!collapsed && <span>{item.name}</span>}
                        </button>
                    ))}
                </div>
            </PopoverPanel>
        </Popover>
    );
}

export default Sidebar;
