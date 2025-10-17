import BookingsTable from "../components/BookingsTable";

export default function ReturnedBookings() {
    return (
        <div>
             <h1 className="text-2xl font-bold text-gray-950">Returned Bookings</h1>
            <p className="text-sm text-gray-500">Manage your returned and refunded bookings here.</p>
            <div className="space-y-6 mt-6"> 

                <BookingsTable limit={10} status="returned" />

            </div>
         </div>
    );
}