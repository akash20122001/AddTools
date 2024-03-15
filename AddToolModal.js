import {
  Form,
} from "antd";
import BaseModal from "components/BaseModal";

import React, { useEffect, useMemo, useState } from "react";
import { FieldTypes, generateFormFields } from "utils/formUtils";

function AddToolModal({ recordData, dummyData, setDummyData, modalType }) {
  const [form] = Form.useForm();

  const [editId, setEditId] = useState(recordData?.id);

  const [formData, setFormData] = useState({
  });

  const categories = useMemo(()=>{
    return [
    {
      value: "Threat Model",
      label: "Threat Model",
    },
    {
      value: "SAST",
      label: "SAST",
    },
    {
      value: "Secrets",
      label: "Secrets",
    },
    {
      value: "SCA",
      label: "SCA",
    },
    {
      value: "DAST",
      label: "DAST",
    },
    {
      value: "IAST",
      label: "IAST",
    },
    {
      value: "MAST",
      label: "MAST",
    },
    {
      value: "Pen Testing",
      label: "Pen Testing",
    },
    {
      value: "API Security",
      label: "API Security",
    },
    {
      value: "IaC",
      label: "IaC",
    },
    {
      value: "Container Security",
      label: "Container Security",
    },
    {
      value: "Infrastructure Tools",
      label: "Infrastructure Tools",
    },
    {
      value: "CSPM",
      label: "CSPM",
    },
    {
      value: "Repository",
      label: "Repository",
    },
    {
      value: "Ticketing",
      label: "Ticketing",
    },
    {
      value: "Messaging",
      label: "Messaging",
    },
    {
      value: "CI/CD",
      label: "CI/CD",
    },
    {
      value: "Asset Management",
      label: "Asset Management",
    },
    {
      value: "Endpoint Vulnerability Management",
      label: "Endpoint Vulnerability Management",
    },
  ]},[]);

  const phases = useMemo(()=>{
    return [
    {
      value: "Phase 1",
      label: "Phase 1",
    },
    {
      value: "Phase 2",
      label: "Phase 2",
    },
    {
      value: "Phase 3",
      label: "Phase 3",
    },
    {
      value: "N/A",
      label: "N/A",
    },
  ]},[]);

  const SUBSCRIPTION_OPTIONS = useMemo(()=>{ 
    return [{
      label: "Yes",
      value: "Yes",
    },
    {
      label: "No",
      value: "No"
    },
    
  ]},[]);

  const initialFields = useMemo(()=> {
    return [
      {
        name: "category",
        label: "Category",
        placeholder: "Category",
        type: FieldTypes.SELECT_WITH_CUSTOM,
        options: categories,
        loading: categories === null,
        colSpan: 24,
        disabled: modalType === "edit",
        required: true,
      },
      {
        name: "tool",
        label: "Tool",
        placeholder: "Tool",
        type: FieldTypes.SELECT_WITH_CUSTOM,
        rules: [
          {
            required: true,
            message: <>Select a Tool name.</>,
          },
        ],
      },
      {
        name: "deploymentPhase",
        label: "Phase",
        placeholder: "Phase",
        type: FieldTypes.SELECT,
        options: phases,
        loading: phases === null,
        rules: [
          {
            required: true,
            message: <>Select a Development Phase.</>,
          },
        ],
      },
      {
        name: "subscription",
        label: "Subscription",
        type: FieldTypes.RADIO,
        options: SUBSCRIPTION_OPTIONS,
      },
    ];
  }, [SUBSCRIPTION_OPTIONS, categories, modalType, phases]);

  const [fields, setFields] = useState(initialFields);

  const addDataToDummyData = async () => {

    await form.validateFields();
    // Create a new object with the form data
    
    const newData = {
      id:  dummyData.length + 1, // Assuming IDs are unique and incrementing
      category: modalType==="edit"? recordData.category : formData.category,
      tool: formData.tool ,
      toolStatus: "", // Add the actual value from the form data
      deploymentPhase: formData.deploymentPhase,
      subscription: formData.subscription,
      contractRenewalDate: formData.contractRenewalDate,
      amount: formData.amount,
      duration: formData.duration
    };

    console.log("New data: ", newData);
    setDummyData((prevData) => [...prevData, newData]);

    console.log(dummyData);
  };


  useEffect(() => {
    if (formData.subscription === "Yes" ) {
      setFields([
        ...initialFields,
        {
          name: "duration",
          label: "Duration",
          type: FieldTypes.NUMBER,
          message: "Please enter the duration",
        },
        {
          name: "contractRenewalDate",
          label: "Renewal Date",
          type: FieldTypes.DATE,
        },
        {
          name: "amount",
          label: "Amount",
          type: FieldTypes.NUMBER,
        },
      ]);
    } else {
      setFields(initialFields);
      setFormData(prevData => ({
        ...prevData,
        contractRenewalDate: null,
        amount: "",
        duration: ""
      }));
    }
  }, [formData.subscription, initialFields]);

  const getCategoryTools = (categoryValue) => {
    // Implement logic to fetch tools based on the selected category
    // For demonstration, I'm returning static tools for each category
    switch (categoryValue) {
      case "Threat Model":
        return [
              {
                value: "BurpSuite",
                label: "BurpSuite",
              },
              {
                value: "Checkmarx",
                label: "Checkmarx",
              },
        ];
        case "SAST":
        return [
              {
                value: "Splunk",
                label: "Splunk",
              },
              {
                value: "SDElements",
                label: "SDElements",
              },
        ];
        case "DAST":
        return [
              {
                value: "BurpSuite",
                label: "BurpSuite",
              },
              {
                value: "Checkmarx",
                label: "Checkmarx",
              },
              {
                value: "Splunk",
                label: "Splunk",
              },
              {
                value: "SDElements",
                label: "SDElements",
              },
        ];
        case "MAST":
        return [
          {
                value: "Dependabot",
                label: "Dependabot",
              },
              {
                value: "Code-Scanning",
                label: "Code-Scanning",
              },
              {
                value: "Splunk",
                label: "Splunk",
              },
              {
                value: "SDElements",
                label: "SDElements",
              },
        ];
      // Add cases for other categories...
      default:
        return [];
    }
  };

  useEffect(() => {
    if(recordData?.category){
      const selectedCategory = categories.find(cat => cat.value === recordData.category);
      if (selectedCategory) {
        const updatedFields = initialFields.map(field => {
          if (field.name === "tool") {
            return {
              ...field,
              options: getCategoryTools(selectedCategory.value),
            };
          }
          return field;
        });
        setFields(updatedFields);
      }
    }
    else if (formData.category) {
      const selectedCategory = categories.find(cat => cat.value === formData.category);
      if (selectedCategory) {
        const updatedFields = initialFields.map(field => {
          if (field.name === "tool") {
            return {
              ...field,
              options: getCategoryTools(selectedCategory.value),
            };
          }
          return field;
        });
        setFields(updatedFields);
      }
    }
  }, [categories, formData.category, initialFields, recordData?.category]);

  const saveEditedData = async () => {
    await form.validateFields();
    // Create a new object with the edited form data
    const updatedData = {
      id: editId,
      category: recordData.category,
      otherCategory: formData.otherCategory,
      tool: formData.tool,
      otherTool: formData.otherTool,
      toolStatus: "", // Add the actual value from the form data
      deploymentPhase: formData.deploymentPhase,
      subscription: formData.subscription,
      contractRenewalDate: formData.contractRenewalDate,
      amount: formData.amount,
      duration: formData.duration,
    };

    // Update the existing row in dummyData with the edited data
    setDummyData((prevData) =>
      prevData.map((item) => (item.id === editId ? { ...item, ...updatedData } : item))
    );

    // Reset form data and editId
    setFormData({
      category: recordData.category,
      tool: "",
      deploymentPhase: "",
      subscription: "",
      duration: "",
      contractRenewalDate: null,
      amount: "",
    });
    setEditId(null);
  };

  return (
    <BaseModal
      modalProps={{
        okText: recordData?.id ? "Save" : "Add", // Change button text based on whether it's an edit or add
        title: recordData?.id ? "Edit Tool" : "Add Tool", // Change modal title based on whether it's an edit or add
        onOk: recordData?.id ? saveEditedData : addDataToDummyData
      }}
    >
      <Form 
        initialValues={recordData}
        form={form}
        onValuesChange={(data) => {
             setFormData({ ...formData, ...data });
        }}
        layout="vertical">
        {generateFormFields(fields)}
      </Form>
    </BaseModal>
  );
}

export default AddToolModal;
