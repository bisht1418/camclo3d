import React from "react";
import { IoMdClose } from "react-icons/io";
import { format, parse, parseISO } from "date-fns";

const Notification = ({ open, onClose, notificationData }) => {
  const formatDate = (uploaded_at) => {
    const parsedDateimp = parseISO(uploaded_at);

    const formattedDate = parsedDateimp.toISOString().substring(0, 19);
    const utcTimeStamp = `${formattedDate}`;
    const utcDate = format(new Date(utcTimeStamp), "dd/MM/yyyy, HH:mm:ss");

    // Get the user's local time from the UTC date
    const localTime = utcDate.toLocaleString();

    const inputFormat = "dd/MM/yyyy, HH:mm:ss";
    const parsedDate = parse(localTime, inputFormat, new Date());
    const currentDate = new Date();

    // @ts-ignore
    const minutesAgo = Math.floor((currentDate - parsedDate) / (1000 * 60)); // Minutes ago

    const hoursAgo = Math.floor(
      // @ts-ignore
      (currentDate - parsedDate) / (1000 * 60 * 60)
    ); // Hours ago

    const daysAgo = Math.floor(
      // @ts-ignore
      (currentDate - parsedDate) / (1000 * 60 * 60 * 24)
    ); // Days ago

    let displayFormat = "";

    if (minutesAgo < 60) {
      displayFormat = `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
    } else if (hoursAgo < 24) {
      displayFormat = `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
    } else if (daysAgo < 1) {
      displayFormat = "Today";
    } else if (daysAgo < 2) {
      displayFormat = "Yesterday";
    } else {
      displayFormat = format(parsedDate, "dd/MM/yy");
    }

    return displayFormat;
  };

  return (
    <>
      {open && (
        <div
          className={`absolute mt-[1rem] right-20 top-50 gap-[.1rem] w-[20.3rem] m-auto bg-white overflow-hidden flex flex-col rounded-[.75rem] shadow-[2px_2px_12px_0px_#CAC2D1] border-b-4 border-primary ${
            open ? "fade-in-slide-in" : "fade-in-slide-out"
          } z-50`}
        >
          <div className="flex justify-between px-[1.25rem] max-w-[320px] py-[1.5rem] border-b-[.06rem]">
            <h3 className="font-bold text-[1.1rem] leading-[1.5rem] text-secondary">
              Notification
            </h3>
            <IoMdClose
              size={20}
              className="text-primary cursor-pointer"
              onClick={onClose}
            />
          </div>
          <div className="overflow-y-auto scrollbar max-h-[20rem]">
            {notificationData?.length > 0 ? (
              notificationData.map((item, index) => (
                <div
                  key={index}
                  className="flex py-[1rem] px-[1.25rem] gap-[.65rem] hover:bg-[#EFE8F5] transition-all duration-300 ease-in-out transform"
                >
                  <div>
                    <img
                      className="w-[2.5rem] h-[2.5rem] transition-transform duration-300 ease-in-out hover:scale-110"
                      src={"/notification.png"}
                      alt=""
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-[1rem] leading-[1.25rem] text-secondary transition-colors duration-300 ease-in-out">
                      {item?.entity_type}
                    </h3>
                    <div className="flex justify-between gap-10">
                      <p className="font-medium text-[0.9rem] leading-[1.1rem] text-primaryLight transition-colors duration-300 ease-in-out">
                        {item?.title}
                      </p>
                      <p className="font-normal text-[0.75rem] leading-[1rem] text-primary transition-colors duration-300 ease-in-out">
                        {formatDate(item?.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No notifications available
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
