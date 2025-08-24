import { CalendarView } from "@/components/calendar-view";

const Booking = () => {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="@container/main flex flex-1 flex-col gap-2 h-full">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 h-full">
          <CalendarView />
        </div>
      </div>
    </div>
  );
};

export default Booking;
