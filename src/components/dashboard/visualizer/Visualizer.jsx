  import { useEffect, useState } from "react";
  import Stepper from "./Stepper";
  import Category from "./Category";
  import Upload from "./Upload";
  import VisualizerImage from "./VisualizerImage";
  import ModelStyleSelector from "../../modalStructure/ModelStyleSelector";
  import baseService from "../../../services/baseService";

  const Visualizer = ({ title }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [currentCategory, setCurrentCategory] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTextures, setCurrentTextures] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modelIndex, setModelIndex] = useState(0);

   const fetchTemplates = async (categoryId, subcategoryId) => {
  try {
    const response = await baseService.get(`/api/v1/getTempletaDetails/${categoryId}/${subcategoryId}`);
    let templatesData = response.data?.data[0] || response.data;

    // Ensure templatesData is an array
    if (!Array.isArray(templatesData)) {
      templatesData = [templatesData].filter(Boolean); // Convert single object to an array
    }

    // Transform the templates data if necessary
    const processedTemplates = templatesData.map((template) => ({
      ...template,
      // Add additional processing if needed here
    }));

    return processedTemplates;
  } catch (err) {
    console.error("Error fetching templates:", err);
    throw err;
  }
};



    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await baseService.get('/api/v1/getCategoryDetails');
        const data = response.data?.data[0] || response.data[0];
        setCategories(data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                            err.request ? 'No response received from server' : 
                            'An unexpected error occurred';
        setError(errorMessage);
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchCategories();
    }, []);
    // New function to handle item selection and fetch templates
    const handleItemSelect = async (item, categoryId) => {
      try {
        setLoading(true);
        const templates = await fetchTemplates(categoryId, selectedItem.subcategory_id);
        const itemWithTemplates = {
          ...selectedItem,
          templates: templates
        };
        setSelectedItem(itemWithTemplates);
        handleStepChange(1);
      } catch (err) {
        setError("Templates not found");
        console.error('Error fetching templates:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleStepChange = (step) => {
      if (step === 0) {
        setSelectedItem(null);
      }
      if (step === 3) {
        sessionStorage.removeItem("palluTop");
        sessionStorage.removeItem("sariBottom");
      }
      setCurrentStep(step);
    };

    const handleCategoryChange = (categoryName, index) => {
      setCurrentCategory(categoryName);
      setCurrentIndex(index);
    };

    const handleModelChange = (index) => {
      setModelIndex(index);
    };

    const handleModelNext = () => {
      handleStepChange(2);
    };

    if (loading) {
      return (
        <div className="container-custom flex items-center justify-center min-h-screen bg-gray-100">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-t-4 border-transparent rounded-full animate-spin 
                            bg-gradient-to-r from-primary to-primary-light border-[3px]">
            </div>
            <span className="text-2xl text-gray-800 font-semibold">Loading...</span>
          </div>
        </div>
      );
    }    

    if (error) {
      return (
        <div className="container-custom flex items-center justify-center py-12">
          <div className="text-red-500 text-xl">Error: {error}</div>
        </div>
      );
    }

    const currentCategoryItems = categories[currentIndex]?.items || [];
    
    const renderCurrentStep = () => {
      if (currentStep === 0) {
        return (
          <div className="flex sm:flex-row flex-col">
            <div className="flex flex-col gap-12 h-[300px]">
              <h3 className="font-[700] text-[1.625rem] leading-[1.95rem] text-secondary Barlow text-nowrap">
                Category Selection
              </h3>
              
              <div className="border flex flex-col gap-2 p-5 bg-[#f3f2f7] rounded-xl">
                <p className="font-[700] text-[1.1rem] leading-[1.95rem] text-secondary Barlow text-nowrap">
                  Category
                </p>

                <div className="flex flex-col gap-2 justify-start items-start w-full">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleCategoryChange(category.name, index)}
                      className={`border w-full items-start align-text-top rounded-xl p-1 
                        ${currentCategory === category.name ? 
                          "bg-primary text-white" : 
                          "bg-white"}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="w-full">
              {currentCategory && (
                <Category
                  items={currentCategoryItems}
                  handleCategory={(item) => handleItemSelect(item, categories[currentIndex].category_id)}
                  setItem={setSelectedItem}
                />
              )}
            </div>
          </div>
        );
      }

      if (currentStep === 1) {
        return (
          <Upload
            handleCategory={handleStepChange}
            uploadOptions={selectedItem}
            setCurrentTextures={setCurrentTextures}
            setItem={setSelectedItem}
            item={selectedItem}
          />
        );
      }

      if (currentStep === 2 || currentStep === 3) {
        return (
          <VisualizerImage
            handleCategory={handleStepChange}
            item={selectedItem}
            currentStep={currentStep}
            currentTextures={currentTextures}
            modelIndex={modelIndex}
          />
        );
      }

      return null;
    };

    return (
      <div className="container-custom">
        <h1 className="text-secondary text-[2rem] font-semibold my-[3.125rem]">
          {title}
        </h1>
        
        <div className="relative flex flex-col bg-white xl:py-[3.125rem] py-12 px-5 rounded-[1rem]">
          <Stepper currentStep={currentStep} setCurrentStep={handleStepChange} />
          {renderCurrentStep()}
        </div>
      </div>
    );
  };

  export default Visualizer;