import React, { useEffect, useState } from "react";
import Question from "./Question";
import { faqService } from "../../services/faqService";
import { useSelector } from "react-redux";

const Faq = () => {
 
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

  const faqData = async () => {
    const res = await faqService();
  };
  useEffect(() => {
    faqData();
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
    <section className="py-[3rem] lg:py-[6rem]">
      <div className="max-w-[80rem] px-[1.25rem] mx-auto">
        <div className="flex gap-[2rem] flex-col lg:flex-row">
          <div className="w-[17rem] py-[.5rem] mx-auto lg:mx-0 ">
            <h2 className="text-primary leading-[2.25rem] font-[700] text-[2.25rem] pb-[0.86rem]">
              NEED HELP?
            </h2>
            <p className="text-primaryLight font-[500] text-[1rem] leading-[1.5rem]">
              Frequently asked questions
            </p>
            <img className="pt-[2.6rem]" src="/faq.png" />
          </div>
          <div className="flex-1 gap-[2.2rem] lg:gap-[3rem] flex flex-col">
            {Object.entries(groupedFAQs).map(([category, faqs]) => (
              <Question
                key={category}
                faqData={faqs}
                toggleFAQ={(index) => toggleFAQ(category, index)}
                activeIndex={
                  activeIndex.section === category ? activeIndex.index : null
                }
                titlePre={category}
                titleSuf={"Queries"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
