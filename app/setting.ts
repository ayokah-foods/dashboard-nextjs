export const APP_NAME = "African Hub Marketplace";
export const APP_DESCRIPTION = "Your go to marketplace for African products ";

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
import {
    HomeIcon,
    ShoppingBagIcon,
    CreditCardIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    UserCircleIcon,
    ArrowRightStartOnRectangleIcon,
    CurrencyDollarIcon,
    MegaphoneIcon,
    BuildingStorefrontIcon,
    Squares2X2Icon,
    CubeIcon,
    AdjustmentsHorizontalIcon,
    FlagIcon,
    BanknotesIcon,
} from "@heroicons/react/24/outline";

export const CANADA_TIMEZONE = "America/Toronto";

export const NAVIGATION = [
    {
        name: "Dashboard",
        href: "/",
        icon: HomeIcon,
        children: [{ name: "Home", href: "/" }],
    },
    {
        name: "Customer Management",
        href: "/customers",
        icon: UserCircleIcon,
        children: [
            { name: "Customer List", href: "/customers" },
            { name: "Customer Activity", href: "/customers/activities" },
        ],
    },
    {
        name: "Order Management",
        href: "/orders",
        icon: CreditCardIcon,
        children: [
            { name: "All Orders", href: "/orders" },
            { name: "Processing orders", href: "/orders/processing" },
            { name: "Ongoing orders", href: "/orders/ongoing" },
            { name: "Delivered orders", href: "/orders/delivered" },
            { name: "Cancelled orders", href: "/orders/cancelled" },
            { name: "Returns & Refunds orders", href: "/orders/returned" },
        ],
    },
    {
        name: "Booking Management",
        href: "/bookings",
        icon: CreditCardIcon,
        children: [
            { name: "All bookings", href: "/bookings" },
            { name: "Processing bookings", href: "/bookings/processing" },
            { name: "Ongoing bookings", href: "/bookings/ongoing" },
            { name: "Delivered bookings", href: "/bookings/delivered" },
            { name: "Cancelled bookings", href: "/bookings/cancelled" },
            { name: "Returns & Refunds bookings", href: "/bookings/returned" },
        ],
    },
    {
        name: "Reviews Management",
        href: "/reviews",
        icon: CreditCardIcon,
        children: [
            { name: "All Reviews", href: "/reviews" },
            { name: "Un-Reviews orders", href: "/reviews/un-reviews" },
        ],
    },
    {
        name: "Vendor Management",
        href: "/vendors",
        icon: ShoppingBagIcon,
        children: [
            { name: "Vendor List", href: "/vendors" },
            { name: "Vendor Performance", href: "/vendors/activities" },
        ],
    },
    {
        name: "Items Management",
        href: "/products",
        icon: CubeIcon,
        children: [
            { name: "All items", href: "/products" },
            { name: "Pending Approvals", href: "/products/pending" },
            { name: "Item Analytics", href: "/products/analytics" },
        ],
    },
    {
        name: "Category Management",
        href: "/categories",
        icon: Squares2X2Icon,
        children: [
            { name: "All categories", href: "/categories" },
            { name: "Sub-categories", href: "/categories/sub" },
            { name: "Category Analytics", href: "/categories/analytics" },
        ],
    },
    {
        name: "Variation Management",
        href: "/variations",
        icon: AdjustmentsHorizontalIcon,
        children: [
            { name: "Product colors", href: "/variations/colors" },
            { name: "Product sizes", href: "/variations/sizes" },
        ],
    },
    {
        name: "Banner Management",
        href: "/categories",
        icon: FlagIcon,
        children: [
            { name: "Banner types", href: "/banners/types" },
            { name: "Banners", href: "/banners" },
        ],
    },
    {
        name: "Shop Management",
        href: "/shops",
        icon: BuildingStorefrontIcon,
        children: [
            { name: "Shop List", href: "/shops" },
            { name: "Shop Performance", href: "/shops/performance" },
        ],
    },
    {
        name: "Subscriptions",
        href: "/subscriptions",
        icon: BanknotesIcon,
        children: [
            { name: "All subscriptions", href: "/subscriptions" },
            { name: "Subscriber", href: "/subscriptions/subscribers" },
        ],
    },
    {
        name: "FAQs Management",
        href: "/faqs",
        icon: QuestionMarkCircleIcon,
        children: [
            { name: "FAQs", href: "/faqs" },
            { name: "Tutorials", href: "/tutorials" },
        ],
    },

    {
        name: "Financial Management",
        href: "/finance",
        icon: CurrencyDollarIcon,
        children: [
            { name: "Revenue Overview", href: "/finance" },
            { name: "Payout Requests", href: "/finance/payouts" },
            { name: "Transactions", href: "/finance/transactions" },
            { name: "Commission Revenues", href: "/finance/revenues" },
            { name: "Commission Rates", href: "/finance/commissions" },
            // {
            //     name: "Settlment Accounts",
            //     href: "/finance/settlement-accounts",
            // },
        ],
    },
    {
        name: "Support Tickets",
        href: "/tickets",
        icon: MegaphoneIcon,
        children: [
            { name: "Tickets", href: "/tickets" },
            { name: "Notifications", href: "/notifications" },
        ],
    },

    {
        name: "Security & Compliance",
        href: "/security",
        icon: Cog6ToothIcon,
        children: [
            { name: "Privacy & Compliance", href: "/settings/policies" },
        ],
    }, 
    {
        name: "Platform Settings",
        href: "/settings/app",
        icon: AdjustmentsHorizontalIcon,
        children: [
            { name: "Team members", href: "/teams" },
        ],
    },
];

export const PrivacyPages = [
    { name: "Privacy Policy", type: "privacy" },
    { name: "Terms and Conditions", type: "terms" }, 
    { name: "Return and Refund Policy", type: "return" },
];

export const receiverOptions = [
    { label: "All notifications", value: "" },
    { label: "All users", value: "all" },
    { label: "All customers", value: "customer" },
    { label: "All vendor", value: "vendor" },
];

export const typeOptions = [
    // { label: "SMS", value: "sms" },
    { label: "Email", value: "email" },
];

export const bottomNavigation = [
    {
        name: "Sign out",
        href: "#",
        icon: ArrowRightStartOnRectangleIcon,
        isLogout: true,
    },
];
 
// export const FAQ_DATA: FAQItem[] = [
//     {
//         question: "What products can I find at African Market HubSUPERMARKET?",
//         answer: "You can find fresh groceries, beverages, home essentials, organic produce, and FMCG products. We ensure quality, verified, and fresh items from trusted local suppliers.",
//     },
//     {
//         question: "How do I place an order for African Market Hubdelivery?",
//         answer: "Orders can be placed through our African Market Hub platform. Simply select your items, add to cart, and complete checkout. Delivery is available within major towns.",
//     },
//     {
//         question:
//             "What services does African Market Hub EVENTS & CATERING offer?",
//         answer: "We provide premium catering for weddings, birthdays, corporate events, private dining, and large outdoor celebrations. Menus can be customized to suit your event needs.",
//     },
//     {
//         question: "Can I hire African Market Hub SERVICES for home tasks?",
//         answer: "Yes, African Market Hub Services offers home cleaning, laundry, private chef, and other lifestyle support solutions. All service professionals are trained and verified for reliability.",
//     },
//     {
//         question: "How do I contact African Market Hub for support?",
//         answer: "You can contact us via our email, phone, or contact form on the African Market Hub website. Our team is ready to assist you with any questions or concerns.",
//     },
//     {
//         question:
//             "Does African Market Hub offer bulk orders or corporate packages?",
//         answer: "Yes, both our supermarket and catering services can handle bulk orders and corporate packages. Please contact us directly to discuss your specific requirements.",
//     },
// ];