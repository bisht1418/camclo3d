import React, { useEffect } from "react";
import myPlane from "../../utils/myPlane";
import history from "../../utils/history";
import { purchasePackageUser } from "../../services/ourServiceService";
import { useSelector } from "react-redux";

const Myplan = () => {
  const myPlaneData = useSelector((store) => store.service.packageUser);
  const packageData = async () => {
    const res = await purchasePackageUser();
  };
  useEffect(() => {
    packageData();
  }, []);

  const stripHtmlTags = (htmlString) => {
    return htmlString.replace(/<[^>]*>/g, "");
  };

  const parseDescription = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return Array.from(doc.body.querySelectorAll("li")).map((li) =>
      stripHtmlTags(li.innerHTML).trim()
    );
  };
  const parseNote = (desc) => {
    if (!desc) return [];
    return desc
      .filter((line) => line.toLowerCase().startsWith("note -"))
      .map((line) => line.replace(/^note -\s*/i, "").trim());
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}`;
  };
  const isDateInRange = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return currentDate >= start && currentDate <= end;
  };
  return (
    <>
      <div className="max-w-[80.625rem] w-full m-auto py-[3.175rem] md:px-[1rem]">
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 justify-center lg:gap-[2.5rem] gap-8 w-full">
          {myPlaneData[0]?.length > 0 ? (
            myPlaneData[0].map((plan, index) => {
              const descriptionList = parseDescription(
                plan?.package?.description
              );
              const notes = parseNote(descriptionList);

              return (
                <div key={index}
                  className={`py-[.75rem] rounded-[1rem] ${
                    isDateInRange(plan?.start_date, plan?.end_date)
                      ? ""
                      : "border-l-[.4rem]"
                  } border-primary max-w-[400px] ${
                    isDateInRange(plan?.start_date, plan?.end_date)
                      ? "bg-active-gradient"
                      : "bg-[#F3F2F7]"
                  }`}
                >
                  <div className="flex justify-between py-[.5rem] px-[1.5rem] ">
                    <p
                      className={`font-[700] text-[1.25rem] leading-[1.5rem] ${
                        isDateInRange(plan?.start_date, plan?.end_date)
                          ? "text-[white]"
                          : "text-primary"
                      }`}
                    >
                      My Plan
                    </p>
                    {isDateInRange(plan?.start_date, plan?.end_date) && (
                      <button className="btn-active font-[600] text-[1rem] leading-[1.24rem] Barlow">
                        Active
                      </button>
                    )}
                  </div>
                  <div>
                    <div
                      className={`flex justify-between border-t-[.06rem] px-[1.25rem] py-[.5rem] ${
                        isDateInRange(plan?.start_date, plan?.end_date)
                          ? "border-[white]"
                          : "border-primary"
                      }`}
                    >
                      <p
                        className={`font-[700] text-[2.5rem] leading-[2.813rem] Barlow ${
                          isDateInRange(plan?.start_date, plan?.end_date)
                            ? "text-[#D3CDBF]"
                            : "text-secondary"
                        }`}
                      >
                        {plan?.package?.name}
                      </p>
                      <div>
                        <p
                          className={`font-[400] text-[1rem] leading-[1rem] Barlow ${
                            isDateInRange(plan?.start_date, plan?.end_date)
                              ? "text-[white]"
                              : "text-secondary"
                          }`}
                        >
                          Expires
                        </p>
                        <p
                          className={`font-[500] text-[1rem] leading-[1rem] Barlow ${
                            isDateInRange(plan?.start_date, plan?.end_date)
                              ? "text-[white]"
                              : "text-primary"
                          }`}
                        >
                          {formatDate(plan?.end_date)}
                        </p>
                      </div>
                    </div>
                    <h2
                      className={`text-[1.5rem] leading-[1.65rem] text-start font-[700] px-[1.25rem] group-hover:text-white ${
                        isDateInRange(plan?.start_date, plan?.end_date)
                          ? "text-[white]"
                          : "text-primary"
                      }`}
                    >
                      Rs.{plan?.package?.actual_price}
                      <span
                        className={`font-[400] text-[.75rem] leading-[1.21rem] group-hover:text-white ${
                          isDateInRange(plan?.start_date, plan?.end_date)
                            ? "text-[white]"
                            : "text-primary"
                        }`}
                      >
                        /{plan?.package?.credits} Credits
                      </span>
                    </h2>
                    <p
                      className={`leading-[1.5rem] font-[400] text-[1rem] px-[1.25rem] text-start group-hover:text-white italic ${
                        isDateInRange(plan?.start_date, plan?.end_date)
                          ? "text-[white]"
                          : "text-primaryLight"
                      }`}
                    >
                      (Price per image - Rs.{plan?.package?.price_per_image})
                    </p>
                    {notes.length > 0 && (
                      <p
                        className={`font-[400] text-[1rem] leading-[1.25rem] px-[1.25rem] py-[0.75rem] ${
                          isDateInRange(plan?.start_date, plan?.end_date)
                            ? "text-[white]"
                            : "text-secondary"
                        }`}
                      >
                        {notes.map((note, idx) => (
                          <span
                            key={idx}
                            className={`font-[400] text-[1rem] leading-[1.25rem] py-[0.75rem] ${
                              isDateInRange(plan?.start_date, plan?.end_date)
                                ? "text-[white]"
                                : "text-secondary"
                            }`}
                          >
                            {note}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4">
              <p className="font-bold text-lg text-gray-500">
                No plans available.
              </p>
            </div>
          )}
        </div>
        {/* <div className="py-[2.25rem] text-secondary">
          <h3 className="font-[600] text-[1.875rem] leading-[2.25rem] ">
            Add on{" "}
            <span className="font-[700] text-[1.875rem] leading-[2.25rem]">
              {" "}
              History
            </span>
          </h3>
        </div> */}
        {/* <div className="flex flex-wrap justify-center gap-[2.5rem] w-full ">
          {history.map((plan, index) => (
            <div className="px-[1.5rem] py-[.75rem]  rounded-[1rem]   border border-primary w-full md:w-[calc(50%-1.25rem)]">
              <h3 className="font-[700] text-[1.5rem] leading-[1.8rem] text-secondary">
                {plan?.title}
              </h3>
              <p className="font-[700] text-[1.875rem] leading-[2.25rem] text-primary py-[.8rem]">
                Rs.{plan?.price}
              </p>
              <p className="font-[400] text-[1rem] leading-[1.3rem] text-primaryLight">
                {plan?.heading}
              </p>
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};

export default Myplan;
