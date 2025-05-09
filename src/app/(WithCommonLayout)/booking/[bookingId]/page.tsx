import BookingsComponent from "@/components/modules/booking/BookingsComponent";

const BookingPage = async ({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) => {
  const { bookingId } = await params;
  return (
    <div className="pt-20">
      <BookingsComponent tutorId={bookingId}></BookingsComponent>
    </div>
  );
};

export default BookingPage;
