import WomenSareeModalComponent from "./WomenSareeModalComponent";

const WomenSaree = ({ currentStep, item }) => {
  return (
    <div>
      <WomenSareeModalComponent currentStep={currentStep} item={item} />
    </div>
  );
};

export default WomenSaree;
