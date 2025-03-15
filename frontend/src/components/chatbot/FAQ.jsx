import React from "react";

const FAQ = () => {
  // Define the array of FAQ items
  const faqItems = [
    {
      question: "What is Lorem Ipsum?",
      answer:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      question: "Why do we use it?",
      answer:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      question: "Where does it come from?",
      answer:
        "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    },
    // Add more FAQ items as needed
  ];

  return (
    <div className="mx-auto px-4 py-8 max-w-2xl text-white-100">
      <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="text-white-100 drop-shadow-md  bg-gray-700 rounded-md p-4"
          >
            <h2 className="text-xl font-semibold mb-2">{item.question}</h2>
            <p className="">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
