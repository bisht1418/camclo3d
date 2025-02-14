import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { faqService } from "../../services/faqService";

const Faq = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState({
    section: null,
    index: null,
  });

  const toggleFAQ = (section, index) => {
    setActiveIndex((prevState) =>
      prevState.section === section && prevState.index === index
        ? { section: null, index: null }
        : { section, index }
    );
  };

  const faqDataFetch = async () => {
    await faqService(); // Consider storing the fetched data if needed
  };

  useEffect(() => {
    faqDataFetch();
  }, []);

  const faq = useSelector((store) => store.faq.faq);

  const groupFAQsByCategory = (data) => {
    return data.reduce((acc, faq) => {
      const categoryName = faq.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(faq);
      return acc;
    }, {});
  };

  const groupedFAQs = groupFAQsByCategory(faq);

  return (
    <div className="max-w-[80rem] px-[1.25rem] mx-auto py-[3rem] lg:py-[6rem] flex flex-col gap-[2rem]">
      <div className="flex flex-col md:flex-row justify-between gap-[2rem] items-start md:items-center">
        <h2 className="text-secondary leading-[3.375rem] font-[600] text-[2.813rem]">
          Frequently Asked
          <span className="text-primary">&nbsp;Questions</span>
        </h2>
        <button className="btn-outline flex gap-[0.625rem] text-[0.875rem] font-[700] items-center ml-auto">
          <p
            onClick={() => {
              navigate("/faq");
              window.scrollTo(0, 0);
            }}
          >
            View All
          </p>
          <img src="/right-arrow.png" className="h-full" alt="View All" />
        </button>
      </div>

      <div className="border-t">
        {Object.entries(groupedFAQs)
          .slice(0, 1)
          ?.map(([category, faqs]) => (
            <div key={category} className="border-b">
              {faqs.map((faq, index) => (
                <div key={faq._id} className="border-b">
                  <div className="p-[1.45rem_1.25rem]">
                    <button
                      className="w-full text-left py-0 flex justify-between items-center"
                      onClick={() => toggleFAQ(category, index)}
                    >
                      <span
                        className={`text-[1.25rem] font-[600] leading-[1.25rem] flex flex-row ${
                          activeIndex.section === category &&
                          activeIndex.index === index
                            ? "text-primary"
                            : "text-black"
                        }`}
                      >
                        <span
                          className={`${
                            activeIndex.section === category &&
                            activeIndex.index === index
                              ? "text-primary"
                              : "text-[#CAC2D1]"
                          }`}
                        >
                          {(index + 1).toString().padStart(2, "0") + "."}
                        </span>
                        &nbsp; &nbsp;
                        {faq.name}
                      </span>
                      <span
                        className={`text-xl ${
                          activeIndex.section === category &&
                          activeIndex.index === index
                            ? "text-primary"
                            : "text-primary"
                        }`}
                      >
                        {activeIndex.section === category &&
                        activeIndex.index === index ? (
                          <img src="/subtract.png" alt="Collapse" />
                        ) : (
                          <img src="/add.png" alt="Expand" />
                        )}
                      </span>
                    </button>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      activeIndex.section === category &&
                      activeIndex.index === index
                        ? "max-h-[31.25rem] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="text-primaryLight text-[1rem] leading-[1.563rem] font-[400] p-[1.45rem_1.25rem] pt-2 pb-6 text-align-start">
                      <div
                        dangerouslySetInnerHTML={{ __html: faq.description }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Faq;
